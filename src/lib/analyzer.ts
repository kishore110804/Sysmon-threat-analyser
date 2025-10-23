import { AnalysisResult, SysmonEvent } from '@/types/sysmon';
import { parseSysmonCSV, extractUniqueProcesses, countEventsByType } from './parser/sysmon-parser';
import { parseSysmonText, isPowerShellTextFormat } from './parser/text-parser';
import { runDetection, calculateSeverityBreakdown, calculateTopTactics } from './detection/rules-engine';
import { enrichDetectionWithMitre } from './mitre/mitre-data';
import { detectCSVFormat, getFormatErrorMessage } from './parser/csv-format-detector';

/**
 * Main Analyzer
 * Orchestrates CSV parsing, detection, and MITRE enrichment
 */

export interface AnalyzeOptions {
  onProgress?: (stage: string, progress: number) => void;
}

/**
 * Analyze Sysmon CSV file
 * @param file CSV file to analyze
 * @param options Analysis options
 */
export async function analyzeSysmonFile(
  file: File,
  options: AnalyzeOptions = {}
): Promise<AnalysisResult> {
  const startTime = performance.now();
  const { onProgress } = options;

  try {
    // Stage 0: Detect file format (CSV vs PowerShell text)
    if (onProgress) onProgress('Detecting file format...', 0);
    
    console.log('Starting analysis for file:', file.name, 'Size:', file.size);
    
    const fileContent = await file.text();
    console.log('File content loaded, length:', fileContent.length);
    
    const isTextFormat = isPowerShellTextFormat(fileContent);
    console.log('Format detected:', isTextFormat ? 'PowerShell Text' : 'CSV');
    
    if (onProgress) onProgress(`Format detected: ${isTextFormat ? 'PowerShell Text' : 'CSV'}`, 5);

    let parseResult;
    
    if (isTextFormat) {
      // Parse PowerShell text format
      if (onProgress) onProgress('Parsing PowerShell event log...', 10);
      
      console.log('Parsing as PowerShell text format...');
      parseResult = await parseSysmonText(file);
      console.log('PowerShell parse result:', parseResult.stats);
      
      if (onProgress) onProgress('PowerShell log parsed successfully', 30);
    } else {
      // Parse CSV format with validation
      if (onProgress) onProgress('Validating CSV format...', 10);
      
      console.log('Validating CSV format...');
      const formatValidation = await detectCSVFormat(file);
      console.log('CSV validation:', formatValidation);
      
      if (!formatValidation.isValid || formatValidation.confidence < 50) {
        const errorMessage = getFormatErrorMessage(formatValidation);
        throw new Error(errorMessage);
      }
      
      if (onProgress) onProgress(`CSV format detected: ${formatValidation.format}`, 15);
      
      if (onProgress) onProgress('Parsing CSV...', 15);
      
      console.log('Parsing CSV...');
      parseResult = await parseSysmonCSV(file, {
        onProgress: (parsed: number) => {
          if (onProgress) onProgress('Parsing CSV...', Math.min(15 + parsed / 1000 * 15, 30));
        },
      });
      console.log('CSV parse complete, events:', parseResult.events.length);

      if (onProgress) onProgress('CSV parsed successfully', 30);
    }

    // Check for parse errors
    if (parseResult.errors && parseResult.errors.length > 0) {
      console.warn(`Parsed with ${parseResult.errors.length} errors:`, parseResult.errors.slice(0, 5));
    }
    
    console.log('Total events parsed:', parseResult.events.length);
    
    if (parseResult.events.length === 0) {
      throw new Error('No valid events found in file. Please check the file format.');
    }

    // Stage 2: Run detection
    if (onProgress) onProgress('Running threat detection...', 40);
    
    console.log('Running detection rules...');
    const detections = runDetection(parseResult.events);
    console.log('Detections found:', detections.length);
    
    if (onProgress) onProgress('Detections complete', 60);

    // Stage 3: Enrich with MITRE data
    if (onProgress) onProgress('Enriching with MITRE ATT&CK data...', 70);
    
    console.log('Enriching with MITRE data...');
    const enrichedDetections = detections.map(d => enrichDetectionWithMitre(d));
    console.log('Enrichment complete');
    
    if (onProgress) onProgress('MITRE enrichment complete', 80);

    // Stage 4: Calculate statistics
    if (onProgress) onProgress('Calculating statistics...', 90);
    
    console.log('Calculating statistics...');
    const stats = calculateStatistics(parseResult.events);
    const severityBreakdown = calculateSeverityBreakdown(enrichedDetections);
    const topTactics = calculateTopTactics(enrichedDetections);
    const eventTypeBreakdown = countEventsByType(parseResult.events);

    const processingTime = performance.now() - startTime;
    console.log('Analysis complete in', processingTime, 'ms');
    
    if (onProgress) onProgress('Analysis complete!', 100);

    // Build result
    const result: AnalysisResult = {
      fileName: file.name,
      totalEvents: parseResult.events.length,
      analyzedAt: new Date().toISOString(),
      processingTime: `${Math.round(processingTime)}ms`,
      uniqueProcesses: stats.uniqueProcesses,
      networkConnections: parseResult.events.filter(e => e.EventID === 3).length,
      fileModifications: parseResult.events.filter(e => e.EventID === 11).length,
      registryChanges: parseResult.events.filter(e => [12, 13, 14].includes(e.EventID)).length,
      detections: enrichedDetections,
      severityBreakdown,
      topTactics,
      eventTypeBreakdown,
    };

    console.log('Returning result:', result);
    return result;
  } catch (error) {
    console.error('Analysis failed:', error);
    throw new Error(
      `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Calculate general statistics from events
 */
function calculateStatistics(events: SysmonEvent[]) {
  const uniqueProcesses = extractUniqueProcesses(events).length;
  
  return {
    uniqueProcesses,
  };
}

/**
 * Validate file before analysis
 */
export function validateSysmonFile(file: File): { valid: boolean; error?: string } {
  // Check file type (accept CSV and TXT)
  const validExtensions = ['.csv', '.txt', '.log'];
  const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  
  if (!hasValidExtension) {
    return { valid: false, error: 'File must be a CSV, TXT, or LOG file' };
  }

  // Check file size (max 50MB)
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 50MB limit' };
  }

  // Check file is not empty
  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }

  return { valid: true };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Format processing time for display
 */
export function formatProcessingTime(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}
