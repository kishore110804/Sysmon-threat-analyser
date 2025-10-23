import { MitreMetadata } from '@/types/sysmon';

/**
 * MITRE ATT&CK Integration
 * Local cache of MITRE ATT&CK technique metadata
 */

/**
 * Local MITRE ATT&CK technique database
 * This is a subset of techniques relevant to Sysmon detection
 */
export const MITRE_TECHNIQUES: { [key: string]: MitreMetadata } = {
  'T1059.001': {
    id: 'T1059.001',
    name: 'PowerShell',
    description: 'Adversaries may abuse PowerShell commands and scripts for execution. PowerShell is a powerful interactive command-line interface and scripting environment included in Windows.',
    tactics: ['Execution'],
    url: 'https://attack.mitre.org/techniques/T1059/001/',
    platforms: ['Windows'],
    dataSource: ['Process: Process Creation', 'Command: Command Execution', 'Script: Script Execution'],
  },
  'T1071.001': {
    id: 'T1071.001',
    name: 'Web Protocols',
    description: 'Adversaries may communicate using application layer protocols associated with web traffic to avoid detection/network filtering.',
    tactics: ['Command and Control'],
    url: 'https://attack.mitre.org/techniques/T1071/001/',
    platforms: ['Windows', 'Linux', 'macOS'],
    dataSource: ['Network Traffic: Network Traffic Content', 'Network Traffic: Network Traffic Flow'],
  },
  'T1027': {
    id: 'T1027',
    name: 'Obfuscated Files or Information',
    description: 'Adversaries may attempt to make an executable or file difficult to discover or analyze by encrypting, encoding, or otherwise obfuscating its contents.',
    tactics: ['Defense Evasion'],
    url: 'https://attack.mitre.org/techniques/T1027/',
    platforms: ['Windows', 'Linux', 'macOS'],
    dataSource: ['File: File Metadata', 'Process: Process Creation', 'Script: Script Execution'],
  },
  'T1055': {
    id: 'T1055',
    name: 'Process Injection',
    description: 'Adversaries may inject code into processes in order to evade process-based defenses or elevate privileges.',
    tactics: ['Defense Evasion', 'Privilege Escalation'],
    url: 'https://attack.mitre.org/techniques/T1055/',
    platforms: ['Windows', 'Linux', 'macOS'],
    dataSource: ['Process: OS API Execution', 'Process: Process Access', 'Process: Process Modification'],
  },
  'T1003': {
    id: 'T1003',
    name: 'OS Credential Dumping',
    description: 'Adversaries may attempt to dump credentials to obtain account login and credential material.',
    tactics: ['Credential Access'],
    url: 'https://attack.mitre.org/techniques/T1003/',
    platforms: ['Windows', 'Linux', 'macOS'],
    dataSource: ['Command: Command Execution', 'File: File Access', 'Process: Process Access'],
  },
  'T1218.011': {
    id: 'T1218.011',
    name: 'Rundll32',
    description: 'Adversaries may abuse rundll32.exe to proxy execution of malicious code.',
    tactics: ['Defense Evasion'],
    url: 'https://attack.mitre.org/techniques/T1218/011/',
    platforms: ['Windows'],
    dataSource: ['Process: Process Creation', 'Module: Module Load'],
  },
  'T1547.001': {
    id: 'T1547.001',
    name: 'Registry Run Keys / Startup Folder',
    description: 'Adversaries may achieve persistence by adding a program to a startup folder or referencing it with a Registry run key.',
    tactics: ['Persistence', 'Privilege Escalation'],
    url: 'https://attack.mitre.org/techniques/T1547/001/',
    platforms: ['Windows'],
    dataSource: ['Windows Registry: Windows Registry Key Creation', 'File: File Creation', 'Process: Process Creation'],
  },
  'T1569.002': {
    id: 'T1569.002',
    name: 'Service Execution',
    description: 'Adversaries may abuse the Windows service control manager to execute malicious commands or payloads.',
    tactics: ['Execution'],
    url: 'https://attack.mitre.org/techniques/T1569/002/',
    platforms: ['Windows'],
    dataSource: ['Process: Process Creation', 'Command: Command Execution', 'Service: Service Creation'],
  },
  'T1053.005': {
    id: 'T1053.005',
    name: 'Scheduled Task',
    description: 'Adversaries may abuse the Windows Task Scheduler to perform task scheduling for initial or recurring execution.',
    tactics: ['Execution', 'Persistence', 'Privilege Escalation'],
    url: 'https://attack.mitre.org/techniques/T1053/005/',
    platforms: ['Windows'],
    dataSource: ['Process: Process Creation', 'Command: Command Execution', 'Scheduled Job: Scheduled Job Creation'],
  },
  'T1490': {
    id: 'T1490',
    name: 'Inhibit System Recovery',
    description: 'Adversaries may delete or remove built-in data and turn off services designed to aid in recovery of a corrupted system.',
    tactics: ['Impact'],
    url: 'https://attack.mitre.org/techniques/T1490/',
    platforms: ['Windows', 'Linux', 'macOS'],
    dataSource: ['Process: Process Creation', 'Command: Command Execution', 'File: File Deletion'],
  },
};

/**
 * Get MITRE metadata for a technique ID
 */
export function getMitreMetadata(techniqueId: string): MitreMetadata | undefined {
  return MITRE_TECHNIQUES[techniqueId];
}

/**
 * Enrich detection with MITRE metadata
 */
export function enrichDetectionWithMitre<T extends { technique: string }>(
  detection: T
): T & { mitre?: MitreMetadata } {
  return {
    ...detection,
    mitre: getMitreMetadata(detection.technique),
  };
}

/**
 * Get all techniques by tactic
 */
export function getTechniquesByTactic(tactic: string): MitreMetadata[] {
  return Object.values(MITRE_TECHNIQUES).filter(technique =>
    technique.tactics.includes(tactic)
  );
}

/**
 * Search techniques by name or description
 */
export function searchTechniques(query: string): MitreMetadata[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(MITRE_TECHNIQUES).filter(
    technique =>
      technique.name.toLowerCase().includes(lowerQuery) ||
      technique.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get all unique tactics
 */
export function getAllTactics(): string[] {
  const tactics = new Set<string>();
  Object.values(MITRE_TECHNIQUES).forEach(technique => {
    technique.tactics.forEach(tactic => tactics.add(tactic));
  });
  return Array.from(tactics).sort();
}
