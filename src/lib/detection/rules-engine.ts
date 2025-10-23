import { SysmonEvent, Detection, DetectionRule, SeverityLevel} from '@/types/sysmon';

/**
 * MITRE ATT&CK Detection Rules Engine
 * Analyzes Sysmon events and maps to MITRE techniques
 */

/**
 * Core detection rules for common MITRE ATT&CK techniques
 */
export const DETECTION_RULES: DetectionRule[] = [
  // T1059.001 - PowerShell
  {
    id: 'T1059.001',
    name: 'PowerShell Execution',
    technique: 'T1059.001',
    tactic: 'Execution',
    severity: 'high',
    description: 'Detected suspicious PowerShell execution with encoded commands or download cradles',
    patterns: [
      {
        field: 'CommandLine',
        pattern: /-e(nc(oded)?)?command/i,
      },
      {
        field: 'CommandLine',
        pattern: /\b(IEX|Invoke-Expression)\b/i,
      },
      {
        field: 'CommandLine',
        pattern: /downloadstring|downloadfile/i,
      },
      {
        field: 'CommandLine',
        pattern: /-w(indowstyle)?\s+(hidden|minimized)/i,
      },
      {
        field: 'CommandLine',
        pattern: /-nop(rofile)?/i,
      },
      {
        field: 'CommandLine',
        pattern: /-ep\s+bypass|-executionpolicy\s+bypass/i,
      },
      {
        field: 'ScriptBlockText',
        pattern: /\b(IEX|Invoke-Expression|DownloadString|DownloadFile)\b/i,
      },
    ],
    indicators: ['encoded_command', 'download_cradle', 'hidden_window', 'bypass_policy', 'invoke_expression'],
    confidence: 85,
  },
  
  // T1071.001 - Web Protocols (C2)
  {
    id: 'T1071.001',
    name: 'Web Protocols',
    technique: 'T1071.001',
    tactic: 'Command and Control',
    severity: 'medium',
    description: 'Suspicious network connections to external domains or unusual web traffic',
    patterns: [
      {
        field: 'CommandLine',
        pattern: /Net\.WebClient|System\.Net\.WebRequest/i,
      },
      {
        field: 'DestinationPort',
        pattern: /^(8080|8443|4444|9001)$/,
      },
      {
        field: 'QueryName',
        pattern: /\.(tk|ml|ga|cf|gq)$/i, // Suspicious TLDs
      },
    ],
    indicators: ['external_connection', 'webclient_usage', 'uncommon_port', 'suspicious_domain'],
    confidence: 70,
  },
  
  // T1027 - Obfuscated Files or Information
  {
    id: 'T1027',
    name: 'Obfuscated Files or Information',
    technique: 'T1027',
    tactic: 'Defense Evasion',
    severity: 'medium',
    description: 'Base64 encoded content or string obfuscation detected',
    patterns: [
      {
        field: 'CommandLine',
        pattern: /\[Convert\]::FromBase64String/i,
      },
      {
        field: 'CommandLine',
        pattern: /[A-Za-z0-9+/]{50,}={0,2}/, // Base64-like strings
      },
      {
        field: 'CommandLine',
        pattern: /`|''\+''|\$\(\$|"{3,}/i, // Obfuscation techniques
      },
      {
        field: 'ScriptBlockText',
        pattern: /-join|\[char\]\d+/i,
      },
    ],
    indicators: ['base64_encoding', 'string_concatenation', 'invoke_expression', 'char_obfuscation'],
    confidence: 75,
  },
  
  // T1055 - Process Injection
  {
    id: 'T1055',
    name: 'Process Injection',
    technique: 'T1055',
    tactic: 'Defense Evasion',
    severity: 'high',
    description: 'Detected process injection techniques',
    patterns: [
      {
        field: 'CommandLine',
        pattern: /VirtualAlloc|WriteProcessMemory|CreateRemoteThread/i,
      },
    ],
    indicators: ['memory_allocation', 'remote_thread', 'process_injection'],
    confidence: 90,
  },
  
  // T1003.001 - LSASS Memory Access
  {
    id: 'T1003.001',
    name: 'LSASS Memory Access',
    technique: 'T1003.001',
    tactic: 'Credential Access',
    severity: 'high',
    description: 'Process accessing LSASS memory - potential credential dumping',
    patterns: [
      {
        field: 'EventID',
        pattern: /^10$/,
      },
      {
        field: 'TargetImage',
        pattern: /\\lsass\.exe$/i,
      },
      {
        field: 'GrantedAccess',
        pattern: /0x1010|0x1410|0x1438|0x143a|PROCESS_VM_READ/i,
      },
    ],
    indicators: ['lsass_access', 'credential_dumping', 'memory_access'],
    confidence: 95,
  },

  // T1003 - Credential Dumping
  {
    id: 'T1003',
    name: 'OS Credential Dumping',
    technique: 'T1003',
    tactic: 'Credential Access',
    severity: 'high',
    description: 'Detected credential dumping attempts',
    patterns: [
      {
        field: 'Image',
        pattern: /mimikatz|procdump|pwdump/i,
      },
      {
        field: 'CommandLine',
        pattern: /sekurlsa|lsadump|sam/i,
      },
      {
        field: 'TargetFilename',
        pattern: /\\lsass\.(dmp|exe)|ntds\.dit/i,
      },
    ],
    indicators: ['mimikatz', 'lsass_dump', 'credential_access'],
    confidence: 95,
  },
  
  // T1218.011 - Rundll32
  {
    id: 'T1218.011',
    name: 'Rundll32',
    technique: 'T1218.011',
    tactic: 'Defense Evasion',
    severity: 'medium',
    description: 'Suspicious rundll32 execution',
    patterns: [
      {
        field: 'Image',
        pattern: /\\rundll32\.exe$/i,
      },
      {
        field: 'CommandLine',
        pattern: /javascript:|vbscript:|http/i,
      },
    ],
    indicators: ['rundll32_abuse', 'suspicious_dll'],
    confidence: 80,
  },
  
  // T1547.001 - Registry Run Keys
  {
    id: 'T1547.001',
    name: 'Registry Run Keys / Startup Folder',
    technique: 'T1547.001',
    tactic: 'Persistence',
    severity: 'medium',
    description: 'Modifications to autorun registry keys',
    patterns: [
      {
        field: 'TargetObject',
        pattern: /\\(Run|RunOnce|RunOnceEx)\\|\\Startup\\/i,
      },
    ],
    indicators: ['registry_persistence', 'autorun_key'],
    confidence: 85,
  },
  
  // T1569.002 - Service Execution
  {
    id: 'T1569.002',
    name: 'Service Execution',
    technique: 'T1569.002',
    tactic: 'Execution',
    severity: 'medium',
    description: 'Service creation or modification for execution',
    patterns: [
      {
        field: 'CommandLine',
        pattern: /sc\s+(create|config)|New-Service/i,
      },
    ],
    indicators: ['service_creation', 'sc_command'],
    confidence: 75,
  },
  
  // T1053.005 - Scheduled Task
  {
    id: 'T1053.005',
    name: 'Scheduled Task/Job',
    technique: 'T1053.005',
    tactic: 'Execution',
    severity: 'medium',
    description: 'Scheduled task creation for persistence or execution',
    patterns: [
      {
        field: 'CommandLine',
        pattern: /schtasks\s+\/create|Register-ScheduledTask/i,
      },
    ],
    indicators: ['scheduled_task', 'persistence'],
    confidence: 80,
  },
  
  // T1490 - Inhibit System Recovery
  {
    id: 'T1490',
    name: 'Inhibit System Recovery',
    technique: 'T1490',
    tactic: 'Impact',
    severity: 'high',
    description: 'Attempts to delete backups or shadow copies',
    patterns: [
      {
        field: 'CommandLine',
        pattern: /vssadmin\s+delete\s+shadows|wbadmin\s+delete|bcdedit.*recoveryenabled.*no/i,
      },
    ],
    indicators: ['shadow_copy_deletion', 'backup_deletion', 'recovery_disabled'],
    confidence: 95,
  },
];

/**
 * Run detection rules against events
 */
export function runDetection(events: SysmonEvent[]): Detection[] {
  const detections: Detection[] = [];
  
  console.log(`Running ${DETECTION_RULES.length} detection rules against ${events.length} events`);
  
  DETECTION_RULES.forEach(rule => {
    const matchingEvents = findMatchingEvents(events, rule);
    
    if (matchingEvents.length > 0) {
      const detection: Detection = {
        id: rule.id,
        technique: rule.technique,
        name: rule.name,
        tactic: rule.tactic,
        severity: rule.severity,
        count: matchingEvents.length,
        description: rule.description,
        indicators: findMatchedIndicators(matchingEvents, rule),
        confidence: rule.confidence,
        events: matchingEvents.slice(0, 10), // Limit to first 10 events
      };
      
      console.log(`✓ Detection: ${detection.name} (${detection.technique}) - ${detection.count} events - Tactic: ${detection.tactic}`);
      
      detections.push(detection);
    }
  });
  
  console.log(`Total detections created: ${detections.length}`);
  
  // Sort by severity then count
  return detections.sort((a, b) => {
    const severityOrder: { [key in SeverityLevel]: number } = { high: 3, medium: 2, low: 1 };
    const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
    return severityDiff !== 0 ? severityDiff : b.count - a.count;
  });
}

/**
 * Find events matching detection rule patterns
 */
function findMatchingEvents(events: SysmonEvent[], rule: DetectionRule): SysmonEvent[] {
  return events.filter(event => {
    return rule.patterns.some(pattern => {
      const fieldValue = event[pattern.field];
      
      if (!fieldValue) return false;
      
      const valueStr = String(fieldValue);
      
      if (pattern.pattern instanceof RegExp) {
        return pattern.pattern.test(valueStr);
      } else {
        return valueStr.includes(pattern.pattern);
      }
    });
  });
}

/**
 * Find which indicators were actually matched
 */
function findMatchedIndicators(events: SysmonEvent[], rule: DetectionRule): string[] {
  const matched = new Set<string>();
  
  events.forEach(event => {
    rule.patterns.forEach((pattern, idx) => {
      const fieldValue = event[pattern.field];
      if (!fieldValue) return;
      
      const valueStr = String(fieldValue);
      const isMatch = pattern.pattern instanceof RegExp 
        ? pattern.pattern.test(valueStr)
        : valueStr.includes(pattern.pattern);
      
      if (isMatch && rule.indicators[idx]) {
        matched.add(rule.indicators[idx]);
      }
    });
  });
  
  return Array.from(matched);
}

/**
 * Calculate severity breakdown
 */
export function calculateSeverityBreakdown(detections: Detection[]) {
  return {
    high: detections.filter(d => d.severity === 'high').reduce((sum, d) => sum + d.count, 0),
    medium: detections.filter(d => d.severity === 'medium').reduce((sum, d) => sum + d.count, 0),
    low: detections.filter(d => d.severity === 'low').reduce((sum, d) => sum + d.count, 0),
  };
}

/**
 * Calculate top tactics
 */
export function calculateTopTactics(detections: Detection[]): { name: string; count: number }[] {
  const tacticCounts = new Map<string, number>();
  
  detections.forEach(detection => {
    const current = tacticCounts.get(detection.tactic) || 0;
    tacticCounts.set(detection.tactic, current + detection.count);
  });
  
  return Array.from(tacticCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}
