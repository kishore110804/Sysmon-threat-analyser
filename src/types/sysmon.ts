/**
 * Sysmon Event Types
 * Based on Sysmon schema for Windows event logging
 */

export type SeverityLevel = 'high' | 'medium' | 'low';

export type MitreTactic = 
  | 'Initial Access'
  | 'Execution'
  | 'Persistence'
  | 'Privilege Escalation'
  | 'Defense Evasion'
  | 'Credential Access'
  | 'Discovery'
  | 'Lateral Movement'
  | 'Collection'
  | 'Command and Control'
  | 'Exfiltration'
  | 'Impact';

// Raw Sysmon CSV row
export interface SysmonEvent {
  RecordId: string;
  EventID: number;
  EventRecordID: string;
  Computer: string;
  TimeCreated: string;
  
  // Process creation (Event ID 1)
  Image?: string;
  CommandLine?: string;
  ParentImage?: string;
  ParentCommandLine?: string;
  User?: string;
  LogonId?: string;
  
  // Network connection (Event ID 3)
  SourceIp?: string;
  SourcePort?: string;
  DestinationIp?: string;
  DestinationPort?: string;
  Protocol?: string;
  
  // File creation (Event ID 11)
  TargetFilename?: string;
  
  // Process access (Event ID 10)
  SourceProcessId?: string;
  TargetProcessId?: string;
  SourceImage?: string;
  TargetImage?: string;
  SourceUser?: string;
  TargetUser?: string;
  GrantedAccess?: string;
  
  // Registry events (Event ID 12, 13, 14)
  TargetObject?: string;
  Details?: string;
  
  // PowerShell (Event ID 4104)
  ScriptBlockText?: string;
  
  // DNS query (Event ID 22)
  QueryName?: string;
  QueryResults?: string;
  
  // Raw data for additional fields
  [key: string]: string | number | undefined;
}

// Detection result
export interface Detection {
  id: string;
  technique: string;
  name: string;
  tactic: MitreTactic;
  severity: SeverityLevel;
  count: number;
  description: string;
  indicators: string[];
  confidence: number; // 0-100
  events: SysmonEvent[];
  mitre?: MitreMetadata;
}

// MITRE ATT&CK metadata
export interface MitreMetadata {
  id: string;
  name: string;
  description: string;
  tactics: string[];
  url: string;
  platforms: string[];
  dataSource?: string[];
}

// Analysis results
export interface AnalysisResult {
  fileName: string;
  totalEvents: number;
  analyzedAt: string;
  processingTime: string;
  uniqueProcesses: number;
  networkConnections: number;
  fileModifications: number;
  registryChanges: number;
  detections: Detection[];
  severityBreakdown: {
    high: number;
    medium: number;
    low: number;
  };
  topTactics: {
    name: string;
    count: number;
  }[];
  eventTypeBreakdown: {
    processCreation: number;
    networkConnection: number;
    fileCreation: number;
    registryEvent: number;
    dnsQuery: number;
    other: number;
  };
}

// Detection rule interface
export interface DetectionRule {
  id: string;
  name: string;
  technique: string;
  tactic: MitreTactic;
  severity: SeverityLevel;
  description: string;
  patterns: {
    field: keyof SysmonEvent;
    pattern: RegExp | string;
    flags?: string;
  }[];
  indicators: string[];
  confidence: number;
}
