import Papa from 'papaparse';
import { SysmonEvent } from '@/types/sysmon';

/**
 * Sysmon CSV Parser
 * Handles large CSV files with streaming support
 */

export interface ParseOptions {
  maxEvents?: number;
  skipErrors?: boolean;
  onProgress?: (parsed: number) => void;
}

export interface ParseResult {
  events: SysmonEvent[];
  errors: string[];
  stats: {
    totalRows: number;
    validEvents: number;
    invalidEvents: number;
    parseTime: number;
  };
}

/**
 * Parse Sysmon CSV file
 * @param file File object from input
 * @param options Parsing options
 */
export async function parseSysmonCSV(
  file: File,
  options: ParseOptions = {}
): Promise<ParseResult> {
  const startTime = performance.now();
  const events: SysmonEvent[] = [];
  const errors: string[] = [];
  let totalRows = 0;
  let validEvents = 0;
  let invalidEvents = 0;

  const { maxEvents = Infinity, skipErrors = true, onProgress } = options;

  console.log('CSV parser: Starting parse for file:', file.name);

  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      transformHeader: (header: string) => {
        // Normalize header names (handle different Sysmon export formats)
        return header.trim();
      },
      step: (row: Papa.ParseStepResult<any>, parser: Papa.Parser) => {
        totalRows++;

        try {
          const event = normalizeEvent(row.data);
          
          // Validate event has minimum required fields
          if (validateEvent(event)) {
            events.push(event);
            validEvents++;
            
            if (onProgress) {
              onProgress(validEvents);
            }
            
            // Stop if max events reached
            if (validEvents >= maxEvents) {
              parser.abort();
            }
          } else {
            invalidEvents++;
            if (!skipErrors) {
              errors.push(`Row ${totalRows}: Invalid event structure`);
            }
          }
        } catch (error) {
          invalidEvents++;
          if (!skipErrors) {
            errors.push(`Row ${totalRows}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      },
      complete: () => {
        const parseTime = performance.now() - startTime;
        
        console.log('CSV parser: Complete -', validEvents, 'valid events,', invalidEvents, 'invalid, parse time:', parseTime, 'ms');
        
        resolve({
          events,
          errors,
          stats: {
            totalRows,
            validEvents,
            invalidEvents,
            parseTime,
          },
        });
      },
      error: (error: Error) => {
        console.error('CSV parser error:', error);
        reject(new Error(`CSV parsing failed: ${error.message}`));
      },
    });
  });
}

/**
 * Normalize event data to SysmonEvent interface
 */
function normalizeEvent(rawData: any): SysmonEvent {
  return {
    RecordId: String(rawData.RecordId || rawData.RecordID || ''),
    EventID: Number(rawData.EventID || rawData.EventId || 0),
    EventRecordID: String(rawData.EventRecordID || rawData.EventRecordId || ''),
    Computer: String(rawData.Computer || rawData.ComputerName || ''),
    TimeCreated: String(rawData.TimeCreated || rawData.Timestamp || ''),
    
    // Process fields
    Image: rawData.Image,
    CommandLine: rawData.CommandLine,
    ParentImage: rawData.ParentImage,
    ParentCommandLine: rawData.ParentCommandLine,
    User: rawData.User,
    LogonId: rawData.LogonId,
    
    // Network fields
    SourceIp: rawData.SourceIp || rawData.SourceIP,
    SourcePort: rawData.SourcePort,
    DestinationIp: rawData.DestinationIp || rawData.DestinationIP,
    DestinationPort: rawData.DestinationPort,
    Protocol: rawData.Protocol,
    
    // File fields
    TargetFilename: rawData.TargetFilename,
    
    // Registry fields
    TargetObject: rawData.TargetObject,
    Details: rawData.Details,
    
    // PowerShell fields
    ScriptBlockText: rawData.ScriptBlockText,
    
    // DNS fields
    QueryName: rawData.QueryName,
    QueryResults: rawData.QueryResults,
    
    // Preserve other fields
    ...rawData,
  };
}

/**
 * Validate event has minimum required fields
 */
function validateEvent(event: SysmonEvent): boolean {
  return !!(
    event.EventID &&
    event.TimeCreated &&
    (event.Image || event.CommandLine || event.SourceIp || event.QueryName || event.TargetFilename)
  );
}

/**
 * Get event type from EventID
 */
export function getEventType(eventId: number): string {
  const eventTypes: { [key: number]: string } = {
    1: 'Process Creation',
    2: 'File Creation Time Changed',
    3: 'Network Connection',
    4: 'Sysmon Service State Changed',
    5: 'Process Terminated',
    6: 'Driver Loaded',
    7: 'Image Loaded',
    8: 'CreateRemoteThread',
    9: 'RawAccessRead',
    10: 'ProcessAccess',
    11: 'File Created',
    12: 'Registry Key/Value Created or Deleted',
    13: 'Registry Value Set',
    14: 'Registry Key/Value Renamed',
    15: 'File Stream Created',
    17: 'Pipe Created',
    18: 'Pipe Connected',
    19: 'WMI Event Filter',
    20: 'WMI Event Consumer',
    21: 'WMI Event Consumer To Filter',
    22: 'DNS Query',
    23: 'File Delete',
    24: 'Clipboard Changed',
    25: 'Process Tampering',
    26: 'File Delete Detected',
    4104: 'PowerShell Script Block',
  };
  
  return eventTypes[eventId] || 'Unknown Event';
}

/**
 * Extract unique processes from events
 */
export function extractUniqueProcesses(events: SysmonEvent[]): string[] {
  const processes = new Set<string>();
  
  events.forEach(event => {
    if (event.Image) {
      processes.add(event.Image);
    }
    if (event.ParentImage) {
      processes.add(event.ParentImage);
    }
  });
  
  return Array.from(processes);
}

/**
 * Count events by type
 */
export function countEventsByType(events: SysmonEvent[]) {
  return {
    processCreation: events.filter(e => e.EventID === 1).length,
    networkConnection: events.filter(e => e.EventID === 3).length,
    fileCreation: events.filter(e => e.EventID === 11).length,
    registryEvent: events.filter(e => [12, 13, 14].includes(e.EventID)).length,
    dnsQuery: events.filter(e => e.EventID === 22).length,
    other: events.filter(e => ![1, 3, 11, 12, 13, 14, 22].includes(e.EventID)).length,
  };
}
