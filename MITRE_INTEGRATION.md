# MITRE ATT&CK Integration Strategy

## Overview
This document explains how we'll match Sysmon events to the MITRE ATT&CK framework.

## What is MITRE ATT&CK?
MITRE ATT&CK is a globally-accessible knowledge base of adversary tactics and techniques based on real-world observations. It's like a "playbook" of how attackers operate.

- **Tactics**: The "why" of an attack (e.g., Initial Access, Execution, Persistence)
- **Techniques**: The "how" - specific methods attackers use (e.g., T1059.001 - PowerShell)
- **Sub-techniques**: More specific variants of techniques

## Our Integration Approach

### 1. **Local Rule-Based Matching** (Phase 1 - Immediate)
We'll create a local database of detection rules that map Sysmon patterns to MITRE techniques:

```typescript
// Example rule structure
const rules = {
  "T1059.001": { // PowerShell technique
    name: "Command and Scripting Interpreter: PowerShell",
    tactic: "Execution",
    patterns: [
      { field: "CommandLine", regex: /-enc(odedcommand)?/i },
      { field: "CommandLine", regex: /downloadstring/i },
      { field: "CommandLine", regex: /invoke-expression|iex/i },
      { field: "ScriptBlockText", contains: "base64" }
    ]
  }
}
```

**How it works:**
1. Parse Sysmon CSV → Extract CommandLine, ScriptBlock, ProcessName, etc.
2. For each event, check against all rule patterns
3. If pattern matches → Tag event with MITRE technique ID
4. Aggregate results and show in dashboard

### 2. **MITRE ATT&CK STIX Data** (Phase 2 - Enhanced)
Use the official MITRE ATT&CK dataset (available as JSON/STIX format):

**Data Source:** https://github.com/mitre/cti
- Download `enterprise-attack.json`
- Parse locally to get technique descriptions, tactics, mitigations
- Enrich our detections with official MITRE metadata

```typescript
// Enrichment example
{
  technique_id: "T1059.001",
  name: "PowerShell",
  description: "Adversaries may abuse PowerShell commands...",
  tactics: ["Execution"],
  platforms: ["Windows"],
  data_sources: ["Command: Command Execution", "Process: Process Creation"],
  mitigations: [
    "Execution Prevention",
    "Restrict Script Execution"
  ]
}
```

### 3. **Pattern Detection Logic**

#### For PowerShell (T1059.001):
```typescript
function detectPowerShellAbuse(event) {
  const indicators = [
    event.CommandLine?.includes('-enc') || event.CommandLine?.includes('-encodedcommand'),
    event.CommandLine?.match(/downloadstring|webclient/i),
    event.CommandLine?.match(/invoke-expression|iex/i),
    event.CommandLine?.includes('-nop') && event.CommandLine?.includes('-w hidden'),
    event.ScriptBlockText?.includes('base64')
  ];
  
  return indicators.filter(Boolean).length >= 2; // Require 2+ indicators
}
```

#### For Download Cradle (T1059.001 sub-pattern):
```typescript
function detectDownloadCradle(event) {
  const patterns = [
    /New-Object.*Net\.WebClient/i,
    /DownloadString|DownloadFile/i,
    /Invoke-WebRequest|iwr/i,
    /Invoke-RestMethod|irm/i,
    /\(New-Object.*\)\.DownloadString/i
  ];
  
  return patterns.some(pattern => pattern.test(event.CommandLine));
}
```

### 4. **Severity Scoring**
We'll assign severity based on multiple factors:

```typescript
function calculateSeverity(technique, indicators) {
  let score = 0;
  
  // Base score by technique danger level
  if (technique.is_exploit) score += 30;
  
  // Indicator count
  score += indicators.length * 10;
  
  // Context-aware scoring
  if (indicators.includes('encoded_command')) score += 20;
  if (indicators.includes('hidden_window')) score += 15;
  if (indicators.includes('network_download')) score += 25;
  
  // Categorize
  if (score >= 70) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 30) return 'medium';
  return 'low';
}
```

## Data Flow

```
[Sysmon CSV Upload]
        ↓
[CSV Parser] → Extract: RecordId, EventID, CommandLine, ScriptBlock, Image, etc.
        ↓
[Detection Engine] → Apply rules for each MITRE technique
        ↓
[Match Results] → List of (EventID, TechniqueID, Indicators, Confidence)
        ↓
[MITRE Enrichment] → Add technique details from local MITRE database
        ↓
[Results Dashboard] → Show techniques, timeline, severity, recommendations
```

## Supported Techniques (Initial Release)

### Execution (TA0002)
- **T1059.001** - PowerShell
  - Encoded commands
  - Download cradles
  - Execution policy bypass

### Defense Evasion (TA0005)
- **T1027** - Obfuscated Files or Information
  - Base64 encoding
  - String concatenation
  - Variable substitution

### Command and Control (TA0011)
- **T1071.001** - Web Protocols
  - HTTP/HTTPS connections
  - WebClient usage
  - Suspicious domains

## File Structure

```
src/
  lib/
    mitre/
      techniques.json          # Local MITRE technique database
      rules.ts                 # Detection rule definitions
      detector.ts              # Pattern matching engine
      enrichment.ts            # Add MITRE metadata to detections
    parser/
      sysmon-parser.ts         # Parse CSV → structured events
      event-types.ts           # TypeScript types for events
```

## Example Detection Output

```json
{
  "analysis_id": "abc123",
  "total_events": 1247,
  "detections": [
    {
      "technique_id": "T1059.001",
      "technique_name": "PowerShell",
      "tactic": "Execution",
      "severity": "high",
      "confidence": 0.92,
      "event_count": 8,
      "indicators": [
        "encoded_command",
        "download_cradle",
        "hidden_window"
      ],
      "events": [
        {
          "record_id": 42,
          "timestamp": "2025-10-22T10:15:30Z",
          "command_line": "powershell.exe -enc <base64>",
          "process_id": 1234,
          "parent_image": "cmd.exe"
        }
      ],
      "recommendation": "Investigate PowerShell execution. Review command history and parent process."
    }
  ]
}
```

## Next Steps

1. ✅ Create TypeScript parser for Sysmon CSV
2. ✅ Define detection rules for T1059.001 (PowerShell)
3. ✅ Download MITRE ATT&CK enterprise dataset
4. ✅ Build enrichment layer
5. ✅ Test with real Sysmon data
6. ✅ Add more techniques (T1027, T1071, T1055, T1003)

## Resources

- **MITRE ATT&CK Website**: https://attack.mitre.org
- **MITRE ATT&CK GitHub**: https://github.com/mitre/cti
- **Sysmon Documentation**: https://docs.microsoft.com/sysinternals/downloads/sysmon
- **Atomic Red Team**: https://github.com/redcanaryco/atomic-red-team (for testing)
