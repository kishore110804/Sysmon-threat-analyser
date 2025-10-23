/**
 * CSV Format Detector and Validator
 * Detects different Sysmon CSV formats and provides helpful error messages
 */

export interface CSVFormatValidation {
  isValid: boolean;
  format?: 'sysmon' | 'windows-event-log' | 'evtx-export' | 'custom' | 'unknown';
  detectedColumns: string[];
  missingRequiredColumns: string[];
  suggestions: string[];
  confidence: number; // 0-100
}

/**
 * Required columns for minimal Sysmon parsing
 */
const MINIMAL_REQUIRED_COLUMNS = [
  ['EventID', 'EventId', 'Event ID'],
  ['TimeCreated', 'UtcTime', 'Timestamp', 'Time'],
];

/**
 * Common Sysmon column variations
 */
const SYSMON_COLUMN_MAPPINGS: { [key: string]: string[] } = {
  // Standard names
  EventID: ['EventID', 'EventId', 'Event ID', 'Event_ID', 'ID'],
  TimeCreated: ['TimeCreated', 'UtcTime', 'Timestamp', 'Time', 'Date'],
  Computer: ['Computer', 'ComputerName', 'Computer Name', 'Hostname', 'Host'],
  Image: ['Image', 'ProcessName', 'Process', 'ExecutablePath'],
  CommandLine: ['CommandLine', 'Command Line', 'ProcessCommandLine', 'CmdLine'],
  User: ['User', 'UserName', 'Account', 'AccountName'],
  
  // Network fields
  SourceIp: ['SourceIp', 'SourceIP', 'Source IP', 'SrcIP', 'SourceAddress'],
  DestinationIp: ['DestinationIp', 'DestinationIP', 'Destination IP', 'DestIP', 'DestinationAddress'],
  SourcePort: ['SourcePort', 'Source Port', 'SrcPort'],
  DestinationPort: ['DestinationPort', 'Destination Port', 'DestPort'],
  
  // Process fields
  ParentImage: ['ParentImage', 'ParentProcessName', 'Parent Image'],
  ParentCommandLine: ['ParentCommandLine', 'Parent CommandLine', 'ParentCmdLine'],
};

/**
 * Normalize a CSV column name to standard Sysmon field name
 */
export function normalizeColumnName(columnName: string): string {
  const trimmed = columnName.trim();
  
  for (const [standardName, variations] of Object.entries(SYSMON_COLUMN_MAPPINGS)) {
    if (variations.some(v => v.toLowerCase() === trimmed.toLowerCase())) {
      return standardName;
    }
  }
  
  return trimmed;
}

/**
 * Get confidence score for Sysmon format detection (0-100)
 */
export function getSysmonConfidence(headers: string[]): number {
  const normalizedHeaders = headers.map(h => h.trim().toLowerCase());
  let totalScore = 0;
  let maxScore = 0;
  
  // Weight fields by importance
  const fieldWeights: { [key: string]: number } = {
    EventID: 10,
    TimeCreated: 10,
    Computer: 8,
    Image: 7,
    CommandLine: 6,
    User: 5,
    SourceIp: 4,
    DestinationIp: 4,
  };
  
  for (const [field, weight] of Object.entries(fieldWeights)) {
    maxScore += weight;
    const variations = SYSMON_COLUMN_MAPPINGS[field] || [];
    const hasMatch = variations.some(variation =>
      normalizedHeaders.includes(variation.toLowerCase())
    );
    if (hasMatch) totalScore += weight;
  }
  
  return Math.round((totalScore / maxScore) * 100);
}

/**
 * Validate CSV format by reading first few rows
 */
export async function detectCSVFormat(file: File): Promise<CSVFormatValidation> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) {
        resolve({
          isValid: false,
          detectedColumns: [],
          missingRequiredColumns: ['All columns'],
          suggestions: ['File appears to be empty or unreadable'],
          confidence: 0,
        });
        return;
      }

      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        resolve({
          isValid: false,
          detectedColumns: [],
          missingRequiredColumns: ['All columns'],
          suggestions: ['File is empty'],
          confidence: 0,
        });
        return;
      }

      // Parse header
      const headerLine = lines[0];
      const detectedColumns = parseCSVLine(headerLine);

      // Check for required columns
      const missingColumns: string[] = [];
      const normalizedColumns = detectedColumns.map(col => col.toLowerCase().trim());

      MINIMAL_REQUIRED_COLUMNS.forEach((columnVariations) => {
        const hasColumn = columnVariations.some(variant => 
          normalizedColumns.some(col => col.includes(variant.toLowerCase()))
        );
        if (!hasColumn) {
          missingColumns.push(columnVariations[0]);
        }
      });

      // Detect format type
      const format = detectFormatType(detectedColumns);
      const confidence = calculateConfidence(detectedColumns, format);
      const suggestions = generateSuggestions(detectedColumns, missingColumns, format);

      resolve({
        isValid: missingColumns.length === 0,
        format,
        detectedColumns,
        missingRequiredColumns: missingColumns,
        suggestions,
        confidence,
      });
    };

    reader.onerror = () => {
      resolve({
        isValid: false,
        detectedColumns: [],
        missingRequiredColumns: ['All columns'],
        suggestions: ['Failed to read file'],
        confidence: 0,
      });
    };

    // Read first 10KB to detect format
    const blob = file.slice(0, 10240);
    reader.readAsText(blob);
  });
}

/**
 * Parse a CSV line handling quotes and commas
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  if (current) {
    result.push(current.trim());
  }

  return result;
}

/**
 * Detect format type based on columns
 */
function detectFormatType(columns: string[]): CSVFormatValidation['format'] {
  const normalizedCols = columns.map(c => c.toLowerCase());

  // Check for Sysmon-specific columns
  const sysmonIndicators = ['utctime', 'processguid', 'parentprocessguid', 'rulename'];
  const sysmonMatches = sysmonIndicators.filter(ind => 
    normalizedCols.some(col => col.includes(ind))
  ).length;

  if (sysmonMatches >= 2) {
    return 'sysmon';
  }

  // Check for Windows Event Log export
  const eventLogIndicators = ['eventid', 'level', 'task category', 'logname'];
  const eventLogMatches = eventLogIndicators.filter(ind =>
    normalizedCols.some(col => col.includes(ind))
  ).length;

  if (eventLogMatches >= 3) {
    return 'windows-event-log';
  }

  // Check for EVTX export
  const evtxIndicators = ['event id', 'log', 'source', 'event data'];
  const evtxMatches = evtxIndicators.filter(ind =>
    normalizedCols.some(col => col.includes(ind))
  ).length;

  if (evtxMatches >= 2) {
    return 'evtx-export';
  }

  // Has some event-like columns
  if (normalizedCols.some(col => col.includes('event') || col.includes('time') || col.includes('process'))) {
    return 'custom';
  }

  return 'unknown';
}

/**
 * Calculate confidence score
 */
function calculateConfidence(columns: string[], format: CSVFormatValidation['format']): number {
  const normalizedCols = columns.map(c => c.toLowerCase());
  let score = 0;

  // Check for EventID (critical)
  if (normalizedCols.some(col => col.includes('event') && col.includes('id'))) {
    score += 40;
  }

  // Check for Time field (critical)
  if (normalizedCols.some(col => col.includes('time') || col.includes('timestamp'))) {
    score += 30;
  }

  // Check for process-related fields
  if (normalizedCols.some(col => col.includes('image') || col.includes('process'))) {
    score += 15;
  }

  // Check for computer/host field
  if (normalizedCols.some(col => col.includes('computer') || col.includes('host'))) {
    score += 10;
  }

  // Bonus for known formats
  if (format === 'sysmon') {
    score += 5;
  }

  return Math.min(score, 100);
}

/**
 * Generate helpful suggestions
 */
function generateSuggestions(
  columns: string[],
  missingColumns: string[],
  format: CSVFormatValidation['format']
): string[] {
  const suggestions: string[] = [];

  if (missingColumns.length === 0) {
    suggestions.push('✅ CSV format looks good! All required columns detected.');
    return suggestions;
  }

  // General guidance
  suggestions.push(`❌ Missing required columns: ${missingColumns.join(', ')}`);

  // Format-specific suggestions
  if (format === 'windows-event-log') {
    suggestions.push('💡 This looks like a Windows Event Log export. Try exporting Sysmon events specifically (EventID 1-26).');
    suggestions.push('📝 In Event Viewer: Filter by "Microsoft-Windows-Sysmon/Operational" before exporting.');
  } else if (format === 'evtx-export') {
    suggestions.push('💡 This appears to be an EVTX export. Use a tool like "EvtxToElk" or "Get-WinEvent" for better CSV format.');
  } else if (format === 'custom' || format === 'unknown') {
    suggestions.push('💡 CSV format not recognized. Expected Sysmon CSV with columns like:');
    suggestions.push('   • EventID (or Event ID, EventId)');
    suggestions.push('   • TimeCreated (or UtcTime, Timestamp)');
    suggestions.push('   • Image, CommandLine, Computer, User (optional but recommended)');
  }

  // Export instructions
  if (format !== 'sysmon') {
    suggestions.push('');
    suggestions.push('📋 How to export Sysmon logs correctly:');
    suggestions.push('   1. PowerShell: Get-WinEvent -LogName "Microsoft-Windows-Sysmon/Operational" | Export-Csv sysmon.csv');
    suggestions.push('   2. Event Viewer: Right-click Sysmon log → "Save All Events As..." → CSV format');
    suggestions.push('   3. Use sample data: Click "Download Sample Data" button to test the analyzer');
  }

  // Column mapping suggestion
  const detectedCols = columns.map(c => c.toLowerCase());
  if (detectedCols.some(c => c.includes('event')) && !detectedCols.some(c => c === 'eventid')) {
    suggestions.push('💡 Found column with "event" but not "EventID" - check if column name needs to be renamed.');
  }

  return suggestions;
}

/**
 * Get user-friendly error message
 */
export function getFormatErrorMessage(validation: CSVFormatValidation): string {
  if (validation.isValid) {
    return 'CSV format is valid';
  }

  let message = `CSV format issue detected (Confidence: ${validation.confidence}%)\n\n`;
  message += validation.suggestions.join('\n');

  return message;
}
