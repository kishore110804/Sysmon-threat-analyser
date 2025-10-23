import { SysmonEvent } from '@/types/sysmon';

/**
 * PowerShell Text Format Parser
 * Parses Sysmon events from PowerShell Get-WinEvent output (text format)
 */

export interface TextParseResult {
  events: SysmonEvent[];
  errors: string[];
  stats: {
    totalEvents: number;
    validEvents: number;
    invalidEvents: number;
    parseTime: number;
  };
}

/**
 * Parse PowerShell text format Sysmon logs
 * Format: Get-WinEvent output with "Message", "Id", "TimeCreated", etc.
 */
export async function parseSysmonText(file: File): Promise<TextParseResult> {
  const startTime = performance.now();
  const events: SysmonEvent[] = [];
  const errors: string[] = [];

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) {
          reject(new Error('File is empty or unreadable'));
          return;
        }

        console.log('Text parser: File content length:', text.length);

        // Split by event boundaries (each event starts with "Message")
        const eventBlocks = splitEventBlocks(text);
        console.log('Text parser: Found', eventBlocks.length, 'event blocks');

        if (eventBlocks.length === 0) {
          reject(new Error('No event blocks found in file. Expected PowerShell Get-WinEvent format.'));
          return;
        }

        eventBlocks.forEach((block, index) => {
          try {
            const event = parseEventBlock(block);
            if (event && event.EventID > 0) {
              events.push(event);
            } else {
              errors.push(`Event ${index + 1}: Invalid or missing EventID`);
            }
          } catch (error) {
            errors.push(`Event ${index + 1}: ${error instanceof Error ? error.message : 'Parse error'}`);
          }
        });

        console.log('Text parser: Parsed', events.length, 'valid events with', errors.length, 'errors');

        const parseTime = performance.now() - startTime;

        resolve({
          events,
          errors,
          stats: {
            totalEvents: eventBlocks.length,
            validEvents: events.length,
            invalidEvents: eventBlocks.length - events.length,
            parseTime,
          },
        });
      } catch (error) {
        console.error('Text parser error:', error);
        reject(new Error(`Text parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Split text into individual event blocks
 */
function splitEventBlocks(text: string): string[] {
  // Events are separated by blank lines followed by "Message"
  const blocks: string[] = [];
  const lines = text.split('\n');
  let currentBlock: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Start of new event block
    if (line.startsWith('Message ') && currentBlock.length > 0) {
      blocks.push(currentBlock.join('\n'));
      currentBlock = [line];
    } else if (line || currentBlock.length > 0) {
      currentBlock.push(line);
    }
  }

  // Add last block
  if (currentBlock.length > 0) {
    blocks.push(currentBlock.join('\n'));
  }

  return blocks.filter(b => b.trim().length > 0);
}

/**
 * Parse a single event block into SysmonEvent
 */
function parseEventBlock(block: string): SysmonEvent | null {
  const fields: any = {};

  // Parse Message section (contains the actual Sysmon data)
  const messageMatch = block.match(/Message\s*:\s*([\s\S]*?)(?=\n[A-Z][a-z]+\s*:|$)/);
  if (messageMatch) {
    const messageContent = messageMatch[1];
    parseMessageContent(messageContent, fields);
  }

  // Parse metadata fields (Id, TimeCreated, RecordId, etc.)
  const fieldRegex = /^([A-Z][a-zA-Z]*)\s*:\s*(.+)$/gm;
  let match;
  while ((match = fieldRegex.exec(block)) !== null) {
    const [, key, value] = match;
    if (key !== 'Message' && key !== 'Properties') {
      fields[key] = value.trim();
    }
  }

  // Map to SysmonEvent interface
  return {
    RecordId: fields.RecordId || '',
    EventID: parseEventId(fields.Id, fields.Task),
    EventRecordID: fields.RecordId || '',
    Computer: fields.MachineName || '',
    TimeCreated: fields.TimeCreated || fields.UtcTime || '',

    // Process fields from Message
    Image: fields.Image || fields.SourceImage || undefined,
    CommandLine: fields.CommandLine || undefined,
    ParentImage: fields.ParentImage || undefined,
    ParentCommandLine: fields.ParentCommandLine || undefined,
    User: fields.User || fields.SourceUser || undefined,
    LogonId: fields.LogonId || undefined,

    // Process Access fields (Event ID 10)
    SourceProcessId: fields.SourceProcessId || undefined,
    TargetProcessId: fields.TargetProcessId || undefined,
    SourceImage: fields.SourceImage || undefined,
    TargetImage: fields.TargetImage || undefined,
    SourceUser: fields.SourceUser || undefined,
    TargetUser: fields.TargetUser || undefined,
    GrantedAccess: fields.GrantedAccess || undefined,

    // Network fields
    SourceIp: fields.SourceIp || undefined,
    SourcePort: fields.SourcePort || undefined,
    DestinationIp: fields.DestinationIp || undefined,
    DestinationPort: fields.DestinationPort || undefined,
    Protocol: fields.Protocol || undefined,

    // File fields
    TargetFilename: fields.TargetFilename || undefined,

    // Registry fields
    TargetObject: fields.TargetObject || undefined,
    Details: fields.Details || undefined,

    // PowerShell fields
    ScriptBlockText: fields.ScriptBlockText || undefined,

    // DNS fields
    QueryName: fields.QueryName || undefined,
    QueryResults: fields.QueryResults || undefined,
  };
}

/**
 * Parse message content (Sysmon event details)
 */
function parseMessageContent(message: string, fields: any): void {
  const lines = message.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Parse "Key: Value" format
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex > 0) {
      const key = trimmed.substring(0, colonIndex).trim();
      const value = trimmed.substring(colonIndex + 1).trim();

      if (key && value && value !== '-') {
        fields[key] = value;
      }
    }
  }
}

/**
 * Parse EventID from Id field
 */
function parseEventId(id: string | undefined, task: string | number | undefined): number {
  if (id) {
    const numId = Number(id);
    if (!isNaN(numId)) return numId;
  }

  if (task) {
    const numTask = Number(task);
    if (!isNaN(numTask)) return numTask;
  }

  return 0;
}

/**
 * Detect if file is PowerShell text format
 */
export function isPowerShellTextFormat(content: string): boolean {
  // Check for common PowerShell Get-WinEvent output patterns
  const indicators = [
    /Message\s*:/,
    /Id\s*:/,
    /TimeCreated\s*:/,
    /ProviderName\s*:\s*Microsoft-Windows-Sysmon/,
    /LogName\s*:\s*Microsoft-Windows-Sysmon/,
  ];

  let matchCount = 0;
  for (const indicator of indicators) {
    if (indicator.test(content)) {
      matchCount++;
    }
  }

  return matchCount >= 3;
}
