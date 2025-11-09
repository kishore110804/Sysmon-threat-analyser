# Sysmon Threat Analyzer - Complete Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [File Parsing System](#file-parsing-system)
4. [Detection Engine](#detection-engine)
5. [UI Components](#ui-components)
6. [File Structure](#file-structure)
7. [Setup & Installation](#setup--installation)
8. [Usage Guide](#usage-guide)
9. [API Reference](#api-reference)
10. [Contributing](#contributing)

---

## 🎯 Project Overview

**Sysmon Threat Analyzer** is a modern, web-based security analysis platform that processes Windows Sysmon logs and detects malicious behavior using the MITRE ATT&CK framework.

### Key Features

- ✅ **Dual Format Support**: CSV and PowerShell text formats
- ✅ **15+ MITRE ATT&CK Detection Rules**: Including all Atomic Red Team PowerShell tests
- ✅ **Real-time Analysis**: Fast parsing and instant threat detection
- ✅ **Interactive UI**: Vercel-inspired dark theme with detailed results
- ✅ **Export Capabilities**: Download reports as PDF or JSON
- ✅ **Format Guide**: Built-in UI showing exactly what file formats to upload

### Technology Stack

**Frontend:**
- React 18.2.0 + TypeScript
- Vite 4.5.1 (build tool)
- Tailwind CSS (styling)
- Lucide React (icons)

**Parsing:**
- Papa Parse (CSV parsing)
- Custom regex engine (PowerShell text parsing)

**Security Intelligence:**
- MITRE ATT&CK framework
- 15+ detection rules covering major attack techniques

---

## 🏗️ Architecture

### High-Level Flow

```
┌─────────────┐
│  User File  │
│ (CSV/TXT)   │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Format Detection   │
│  (auto-detect type) │
└──────┬──────────────┘
       │
       ├─── CSV Format ────►┌──────────────┐
       │                    │ CSV Parser   │
       │                    │ (Papa Parse) │
       │                    └──────┬───────┘
       │                           │
       └─── TXT Format ────►┌──────────────┐
                            │ Text Parser  │
                            │ (Regex)      │
                            └──────┬───────┘
                                   │
                            ┌──────▼──────┐
                            │   Events    │
                            │   Array     │
                            └──────┬──────┘
                                   │
                            ┌──────▼──────────┐
                            │ Detection Engine│
                            │ (Rules-based)   │
                            └──────┬──────────┘
                                   │
                            ┌──────▼──────────┐
                            │ MITRE Enrichment│
                            │ (Add metadata)  │
                            └──────┬──────────┘
                                   │
                            ┌──────▼──────────┐
                            │ Results + Stats │
                            │ (JSON output)   │
                            └─────────────────┘
```

### Core Components

1. **Format Detector** (`csv-format-detector.ts`)
   - Analyzes file content to determine if it's CSV or PowerShell text
   - Validates required fields
   - Returns confidence score (0-100)

2. **CSV Parser** (`sysmon-parser.ts`)
   - Uses Papa Parse library for robust CSV handling
   - Streams large files for memory efficiency
   - Normalizes column names (handles variations)
   - Validates event structure

3. **Text Parser** (`text-parser.ts`)
   - Custom regex-based parser for PowerShell `Get-WinEvent` output
   - Splits events by boundaries
   - Extracts key-value pairs from Message field
   - Supports all Sysmon event types (1-26)

4. **Detection Engine** (`rules-engine.ts`)
   - Pattern matching against 15+ MITRE ATT&CK rules
   - Field-level regex matching
   - Confidence scoring
   - Severity classification (High/Medium/Low)

5. **Analyzer** (`analyzer.ts`)
   - Orchestrates the entire analysis pipeline
   - Progress callbacks for UI updates
   - Error handling and validation
   - Statistics calculation

---

## 📄 File Parsing System

### 1. Format Detection

**File:** `src/lib/parser/csv-format-detector.ts`

**Purpose:** Automatically detect if uploaded file is CSV or PowerShell text format.

#### Functions

##### `detectCSVFormat(content: string)`
Detects CSV format by analyzing headers and structure.

```typescript
// Example usage
const content = "TimeCreated,EventID,Computer\n2024-11-08,1,DESKTOP";
const format = detectCSVFormat(content);
// Returns: { format: 'csv', confidence: 95, requiredFields: ['TimeCreated', 'EventID'] }
```

**Algorithm:**
1. Split content into lines
2. Parse first line as headers
3. Check for required Sysmon fields: `TimeCreated`, `EventID`, `Computer`
4. Validate at least one process field exists (`Image`, `CommandLine`, `TargetFilename`)
5. Calculate confidence score based on field matches

##### `isPowerShellTextFormat(content: string)`
Detects PowerShell Get-WinEvent output format.

```typescript
// Example usage
const content = "TimeCreated : 11/8/2024\nId : 1\nMessage : Process Create:";
const isPowerShell = isPowerShellTextFormat(content);
// Returns: true
```

**Detection Criteria:**
- Contains `TimeCreated :` pattern (PowerShell property format)
- Contains `Message :` field
- Contains event boundaries with key-value pairs
- Has Sysmon-specific terms in Message content

##### `normalizeColumnName(name: string)`
Normalizes column name variations to standard field names.

```typescript
// Handles variations
normalizeColumnName("Event ID") → "EventID"
normalizeColumnName("Time Created") → "TimeCreated"
normalizeColumnName("Source Image") → "SourceImage"
```

**Mappings:**
- `Time Created` / `Time` → `TimeCreated`
- `Event ID` / `Event Id` → `EventID`
- `Source Image` → `SourceImage`
- `Target Image` → `TargetImage`
- `Process Guid` → `ProcessGuid`

##### `getSysmonConfidence(headers: string[])`
Calculates confidence score (0-100) that file is Sysmon data.

**Scoring System:**
- Required field found: +30 points each
- Process field found: +10 points
- Network field found: +5 points
- Registry field found: +5 points

---

### 2. CSV Parser

**File:** `src/lib/parser/sysmon-parser.ts` (234 lines)

**Purpose:** Parse CSV format Sysmon logs using Papa Parse library.

#### Main Function: `parseSysmonCSV()`

```typescript
async function parseSysmonCSV(
  file: File,
  options?: {
    maxEvents?: number;
    skipErrors?: boolean;
    onProgress?: (validEvents: SysmonEvent[]) => void;
  }
): Promise<SysmonEvent[]>
```

**Parameters:**
- `file`: The CSV file to parse
- `maxEvents`: Maximum events to parse (default: unlimited)
- `skipErrors`: Continue on parsing errors (default: true)
- `onProgress`: Callback function with current events array

**Returns:** Array of `SysmonEvent` objects

#### Implementation Details

**1. Header Normalization**
```typescript
transformHeader: (header) => {
  return normalizeColumnName(header.trim());
}
```
- Trims whitespace from headers
- Normalizes to standard field names
- Handles case variations

**2. Streaming Parser**
```typescript
Papa.parse(file, {
  header: true,          // First row as headers
  dynamicTyping: true,   // Auto-convert types
  skipEmptyLines: true,  // Ignore empty rows
  step: (row, parser) => {
    // Process each row as it's parsed
    const event = normalizeEvent(row.data);
    if (validateEvent(event)) {
      events.push(event);
      onProgress?.(events); // Progress update
    }
  }
});
```

**3. Event Validation**
```typescript
function validateEvent(event: any): boolean {
  // Must have EventID
  if (!event.EventID) return false;
  
  // Must have timestamp
  if (!event.TimeCreated) return false;
  
  // Must have at least one key field
  const hasKeyField = 
    event.Image || 
    event.CommandLine || 
    event.TargetFilename ||
    event.QueryName;
    
  return hasKeyField;
}
```

**4. Error Handling**
```typescript
error: (error) => {
  if (!skipErrors) {
    reject(new Error(`CSV parsing failed: ${error.message}`));
  }
  // Otherwise continue parsing
}
```

#### Example Usage

```typescript
import { parseSysmonCSV } from '@/lib/parser/sysmon-parser';

const events = await parseSysmonCSV(file, {
  maxEvents: 1000,
  skipErrors: true,
  onProgress: (events) => {
    console.log(`Parsed ${events.length} events so far...`);
  }
});

console.log(`Total events parsed: ${events.length}`);
```

---

### 3. PowerShell Text Parser

**File:** `src/lib/parser/text-parser.ts` (253 lines)

**Purpose:** Parse PowerShell Get-WinEvent output format using custom regex engine.

#### Main Function: `parseSysmonText()`

```typescript
async function parseSysmonText(
  file: File,
  options?: {
    maxEvents?: number;
    onProgress?: (validEvents: SysmonEvent[]) => void;
  }
): Promise<SysmonEvent[]>
```

**Parameters:**
- `file`: The text file to parse
- `maxEvents`: Maximum events to parse (default: unlimited)
- `onProgress`: Callback function with current events array

**Returns:** Array of `SysmonEvent` objects

#### Implementation Details

**1. File Reading**
```typescript
const text = await file.text(); // Read entire file as string
```

**2. Event Block Splitting**
```typescript
function splitEventBlocks(text: string): string[] {
  // Split on "Message :" which marks new events
  const blocks = text.split(/\n(?=TimeCreated\s*:)/);
  return blocks.filter(block => block.trim());
}
```

**Example Input:**
```
TimeCreated : 11/8/2024 10:23:45 AM
Id          : 1
Message     : Process Create:
              ...fields...

TimeCreated : 11/8/2024 10:24:12 AM
Id          : 10
Message     : Process Access:
              ...fields...
```

**Result:** Array of 2 event blocks

**3. Field Extraction**
```typescript
function parseEventBlock(block: string): Partial<SysmonEvent> {
  const event: any = {};
  
  // Extract top-level fields (TimeCreated, Id)
  const fieldPattern = /^([A-Z][a-zA-Z]*)\s*:\s*(.+)$/gm;
  let match;
  
  while ((match = fieldPattern.exec(block)) !== null) {
    const [, key, value] = match;
    
    if (key === 'TimeCreated') {
      event.TimeCreated = value.trim();
    } else if (key === 'Id') {
      event.EventID = value.trim();
    } else if (key === 'Message') {
      // Parse Message content separately
      parseMessageContent(value, event);
    }
  }
  
  return event;
}
```

**4. Message Content Parsing**

The Message field contains the actual Sysmon data:

```typescript
function parseMessageContent(message: string, event: any) {
  // Extract fields from Message content
  // Example: "Image: C:\Windows\cmd.exe"
  
  const lines = message.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    const colonIndex = trimmed.indexOf(':');
    
    if (colonIndex > 0) {
      const key = trimmed.substring(0, colonIndex).trim();
      const value = trimmed.substring(colonIndex + 1).trim();
      
      // Map to SysmonEvent fields
      if (key === 'Image') event.Image = value;
      else if (key === 'CommandLine') event.CommandLine = value;
      else if (key === 'User') event.User = value;
      else if (key === 'SourceImage') event.SourceImage = value;
      else if (key === 'TargetImage') event.TargetImage = value;
      // ... more fields
    }
  }
}
```

**5. Event ID-Specific Parsing**

Different event types have different fields:

```typescript
// Event ID 1 - Process Create
if (eventId === '1') {
  event.Image = extractField('Image');
  event.CommandLine = extractField('CommandLine');
  event.User = extractField('User');
  event.ParentImage = extractField('ParentImage');
}

// Event ID 3 - Network Connection
if (eventId === '3') {
  event.DestinationIp = extractField('DestinationIp');
  event.DestinationPort = extractField('DestinationPort');
  event.Protocol = extractField('Protocol');
}

// Event ID 10 - Process Access
if (eventId === '10') {
  event.SourceImage = extractField('SourceImage');
  event.TargetImage = extractField('TargetImage');
  event.GrantedAccess = extractField('GrantedAccess');
  event.SourceUser = extractField('SourceUser');
  event.TargetUser = extractField('TargetUser');
}
```

#### Example Usage

```typescript
import { parseSysmonText } from '@/lib/parser/text-parser';

const events = await parseSysmonText(file, {
  maxEvents: 500,
  onProgress: (events) => {
    console.log(`Parsed ${events.length} events...`);
  }
});

console.log(`Total events: ${events.length}`);
console.log(`First event:`, events[0]);
```

#### Supported Event Types

| Event ID | Name | Key Fields |
|----------|------|------------|
| 1 | Process Create | Image, CommandLine, User, ParentImage |
| 3 | Network Connection | DestinationIp, DestinationPort, Protocol |
| 5 | Process Terminated | Image, User |
| 7 | Image Loaded | ImageLoaded, Image |
| 8 | CreateRemoteThread | SourceImage, TargetImage |
| 10 | Process Access | SourceImage, TargetImage, GrantedAccess |
| 11 | File Create | TargetFilename, Image |
| 12 | Registry Object Added/Deleted | TargetObject, EventType |
| 13 | Registry Value Set | TargetObject, Details |
| 22 | DNS Query | QueryName, QueryResults |

---

## 🔍 Detection Engine

**File:** `src/lib/detection/rules-engine.ts` (383 lines)

**Purpose:** Detect malicious behavior using pattern-based rules mapped to MITRE ATT&CK techniques.

### Detection Rules

#### Rule Structure

```typescript
interface DetectionRule {
  id: string;              // Unique identifier
  name: string;            // Human-readable name
  technique: string;       // MITRE ATT&CK technique ID
  tactic: string;          // MITRE ATT&CK tactic
  severity: 'high' | 'medium' | 'low';
  description: string;     // What the rule detects
  patterns: Pattern[];     // Matching patterns
  indicators: string[];    // IOC identifiers
  confidence: number;      // Confidence score (0-100)
}

interface Pattern {
  field: string;           // SysmonEvent field to check
  pattern: RegExp | string; // Pattern to match
}
```

#### Example Rule: T1003.001 - LSASS Memory Access

```typescript
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
      pattern: /^10$/  // Event ID 10 (Process Access)
    },
    {
      field: 'TargetImage',
      pattern: /\\lsass\.exe$/i  // Target is lsass.exe
    },
    {
      field: 'GrantedAccess',
      pattern: /0x1010|0x1410|0x1438|0x143a|PROCESS_VM_READ/i
    }
  ],
  indicators: ['lsass_access', 'credential_dumping', 'memory_access'],
  confidence: 95
}
```

**How it works:**
1. Checks if EventID is 10 (Process Access event)
2. Checks if TargetImage ends with `lsass.exe`
3. Checks if GrantedAccess contains suspicious memory access rights
4. If ALL patterns match → Detection triggered

### All Detection Rules (15+)

#### 1. **T1059.001 - PowerShell Execution**
- **Severity:** High
- **Detects:** Malicious PowerShell usage
- **Patterns:**
  - Encoded commands (`-encodedcommand`)
  - Download cradles (`IEX`, `Invoke-Expression`, `DownloadString`)
  - Hidden windows (`-WindowStyle Hidden`)
  - Execution policy bypass (`-ExecutionPolicy Bypass`)

#### 2. **T1003.001 - LSASS Memory Access**
- **Severity:** High
- **Detects:** Credential dumping via LSASS memory
- **Patterns:**
  - Event ID 10 (Process Access)
  - TargetImage = `lsass.exe`
  - Suspicious GrantedAccess rights

#### 3. **T1003.001-Mimikatz - Mimikatz Credential Dumping**
- **Severity:** High (98% confidence)
- **Detects:** Invoke-Mimikatz execution
- **Patterns:**
  - `Invoke-Mimikatz` in CommandLine
  - `mimikatz.ps1` in CommandLine
  - `IEX.*mimikatz` download cradle
  - `sekurlsa::logonpasswords` in ScriptBlockText

#### 4. **T1087.002 - BloodHound/SharpHound Execution**
- **Severity:** High
- **Detects:** Active Directory enumeration tools
- **Patterns:**
  - `SharpHound` or `Invoke-BloodHound` in CommandLine
  - `SharpHound.ps1` download cradle
  - `*BloodHound.zip` file creation
  - `-CollectionMethod` parameter

#### 5. **T1059.001-Cradlecraft - PsSendKeys Execution**
- **Severity:** High
- **Detects:** GUI automation via PsSendKeys
- **Patterns:**
  - `$wshell.SendKeys` in CommandLine
  - `System.Windows.Forms.*SendKeys`
  - `Start-Process notepad.*SendKeys`
  - `notepad.exe` execution

#### 6. **T1548.002 - UAC Bypass via App Paths**
- **Severity:** High
- **Detects:** UAC bypass using registry App Paths
- **Patterns:**
  - Registry modification: `App Paths\` key
  - `Invoke-AppPathBypass` in CommandLine
  - `HKLM\Software\...\App Paths\cmd.exe`

#### 7. **T1059.001-MemoryExec - PowerShell Memory-Only Execution**
- **Severity:** High
- **Detects:** Fileless PowerShell execution
- **Patterns:**
  - `IEX (New-Object Net.WebClient).DownloadString`
  - `IEX (iwr -UseBasicParsing)`
  - Memory-based script execution

#### 8. **T1071.001 - Web Protocols (C2)**
- **Severity:** Medium
- **Detects:** Command & Control via web protocols
- **Patterns:**
  - `Net.WebClient` or `System.Net.WebRequest` usage
  - Uncommon ports (8080, 8443, 4444, 9001)
  - Suspicious TLDs (`.tk`, `.ml`, `.ga`, `.cf`, `.gq`)

#### 9. **T1027 - Obfuscated Files or Information**
- **Severity:** Medium
- **Detects:** Code obfuscation techniques
- **Patterns:**
  - Base64 encoding (`[Convert]::FromBase64String`)
  - Base64-like strings (50+ chars)
  - Obfuscation techniques (backticks, string concatenation)
  - `[char]` obfuscation

#### 10. **T1055 - Process Injection**
- **Severity:** High
- **Detects:** Process injection techniques
- **Patterns:**
  - `VirtualAlloc`, `WriteProcessMemory`, `CreateRemoteThread`

#### 11. **T1003 - OS Credential Dumping**
- **Severity:** High
- **Detects:** Generic credential dumping
- **Patterns:**
  - Tools: `mimikatz`, `procdump`, `pwdump`
  - Commands: `sekurlsa`, `lsadump`, `sam`
  - Files: `lsass.dmp`, `ntds.dit`

#### 12. **T1218.011 - Rundll32**
- **Severity:** Medium
- **Detects:** Suspicious rundll32 usage
- **Patterns:**
  - `rundll32.exe` execution
  - With `javascript:`, `vbscript:`, or `http` schemes

#### 13. **T1547.001 - Registry Run Keys**
- **Severity:** Medium
- **Detects:** Persistence via autorun registry keys
- **Patterns:**
  - Registry: `Run`, `RunOnce`, `RunOnceEx` keys
  - Startup folder modifications

#### 14. **T1569.002 - Service Execution**
- **Severity:** Medium
- **Detects:** Service creation/modification
- **Patterns:**
  - `sc create`, `sc config` commands
  - `New-Service` PowerShell cmdlet

#### 15. **T1053.005 - Scheduled Task**
- **Severity:** Medium
- **Detects:** Scheduled task creation
- **Patterns:**
  - `schtasks /create` command
  - `Register-ScheduledTask` PowerShell cmdlet

#### 16. **T1490 - Inhibit System Recovery**
- **Severity:** High
- **Detects:** Backup/shadow copy deletion (ransomware behavior)
- **Patterns:**
  - `vssadmin delete shadows`
  - `wbadmin delete`
  - `bcdedit.*recoveryenabled.*no`

### Detection Algorithm

#### Main Function: `runDetection()`

```typescript
function runDetection(events: SysmonEvent[]): Detection[] {
  const detections: Detection[] = [];
  
  console.log(`Running ${DETECTION_RULES.length} rules against ${events.length} events`);
  
  // Test each rule
  DETECTION_RULES.forEach(rule => {
    const matchingEvents = findMatchingEvents(events, rule);
    
    if (matchingEvents.length > 0) {
      // Create detection result
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
        events: matchingEvents.slice(0, 10) // First 10 events only
      };
      
      detections.push(detection);
    }
  });
  
  // Sort by severity, then count
  return detections.sort((a, b) => {
    const severityOrder = { high: 3, medium: 2, low: 1 };
    const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
    return severityDiff !== 0 ? severityDiff : b.count - a.count;
  });
}
```

#### Pattern Matching: `findMatchingEvents()`

```typescript
function findMatchingEvents(
  events: SysmonEvent[], 
  rule: DetectionRule
): SysmonEvent[] {
  return events.filter(event => {
    // Event matches if ANY pattern matches
    return rule.patterns.some(pattern => {
      const fieldValue = event[pattern.field];
      
      if (!fieldValue) return false;
      
      const valueStr = String(fieldValue);
      
      // Test pattern
      if (pattern.pattern instanceof RegExp) {
        return pattern.pattern.test(valueStr);
      } else {
        return valueStr.includes(pattern.pattern);
      }
    });
  });
}
```

#### Indicator Extraction: `findMatchedIndicators()`

```typescript
function findMatchedIndicators(
  events: SysmonEvent[], 
  rule: DetectionRule
): string[] {
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
```

### Statistics Functions

#### `calculateSeverityBreakdown()`
```typescript
function calculateSeverityBreakdown(detections: Detection[]) {
  return {
    high: detections
      .filter(d => d.severity === 'high')
      .reduce((sum, d) => sum + d.count, 0),
    medium: detections
      .filter(d => d.severity === 'medium')
      .reduce((sum, d) => sum + d.count, 0),
    low: detections
      .filter(d => d.severity === 'low')
      .reduce((sum, d) => sum + d.count, 0)
  };
}
```

#### `calculateTopTactics()`
```typescript
function calculateTopTactics(detections: Detection[]): { name: string; count: number }[] {
  const tacticCounts = new Map<string, number>();
  
  detections.forEach(detection => {
    const current = tacticCounts.get(detection.tactic) || 0;
    tacticCounts.set(detection.tactic, current + detection.count);
  });
  
  return Array.from(tacticCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5
}
```

---

## 🎨 UI Components

### 1. Home Page (`src/pages/home.tsx`)

**File Size:** 553 lines

**Main Component:** Analysis interface with file upload, format guide, and results display.

#### State Management

```typescript
const [file, setFile] = useState<File | null>(null);
const [isAnalyzing, setIsAnalyzing] = useState(false);
const [showResults, setShowResults] = useState(false);
const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
const [showFormatGuide, setShowFormatGuide] = useState(false);
const [error, setError] = useState<string | null>(null);
```

#### File Upload Section

**Drag & Drop Support:**
```typescript
const handleDrop = useCallback((e: React.DragEvent) => {
  e.preventDefault();
  setIsDragging(false);
  
  const droppedFile = e.dataTransfer.files[0];
  const validExtensions = ['.csv', '.txt', '.log'];
  const hasValidExtension = validExtensions.some(ext => 
    droppedFile?.name.toLowerCase().endsWith(ext)
  );
  
  if (droppedFile && hasValidExtension) {
    setFile(droppedFile);
    setError(null);
  } else {
    setError('Please drop a valid CSV, TXT, or LOG file');
  }
}, []);
```

**File Input:**
```tsx
<input
  type="file"
  accept=".csv,.txt,.log"
  onChange={handleFileSelect}
  className="hidden"
  id="file-upload"
/>
<label htmlFor="file-upload">
  <Button asChild size="lg">
    <span>Select File</span>
  </Button>
</label>
```

#### Format Guide Section

**Expandable Card:**
```tsx
<div className="vercel-card rounded-xl p-6 sm:p-8">
  <button onClick={() => setShowFormatGuide(!showFormatGuide)}>
    <FileCode className="w-5 h-5 text-blue-400" />
    <h3>Supported File Formats</h3>
    {/* Arrow icon that rotates */}
  </button>
  
  {showFormatGuide && (
    <div className="mt-6 space-y-6">
      {/* CSV Format */}
      {/* PowerShell Text Format */}
      {/* Quick Export Commands */}
    </div>
  )}
</div>
```

**CSV Format Example:**
```tsx
<div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-4">
  <pre className="text-xs font-mono text-gray-300">
    <span className="text-blue-400">TimeCreated</span>,
    <span className="text-blue-400">EventID</span>,
    <span className="text-blue-400">Computer</span>,...
    2024-11-08 10:23:45,1,DESKTOP-ABC,C:\Windows\System32\cmd.exe,...
  </pre>
</div>
```

#### Analysis Function

```typescript
const handleAnalyze = async () => {
  if (!file) return;
  
  // Validate file
  const validation = validateSysmonFile(file);
  if (!validation.valid) {
    setError(validation.error || 'Invalid file');
    return;
  }

  setIsAnalyzing(true);
  setShowResults(false);
  setAnalysisProgress('Starting analysis...');

  try {
    // Run analysis with progress updates
    const result = await analyzeSysmonFile(file, {
      onProgress: (stage, progress) => {
        setAnalysisProgress(`${stage} (${Math.round(progress)}%)`);
      }
    });

    setAnalysisResults(result);
    setIsAnalyzing(false);
    setShowResults(true);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Analysis failed');
    setIsAnalyzing(false);
  }
};
```

#### Results Display

**Statistics Cards:**
```tsx
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
  {/* Total Events */}
  <div className="vercel-card p-5 sm:p-6 rounded-xl">
    <p className="text-xs sm:text-sm text-gray-400 mb-2">Total Events</p>
    <p className="text-3xl sm:text-4xl font-bold">
      {analysisResults.totalEvents.toLocaleString()}
    </p>
  </div>
  
  {/* Threats Detected */}
  <div className="vercel-card p-5 sm:p-6 rounded-xl">
    <p className="text-xs sm:text-sm text-gray-400 mb-2">Threats Detected</p>
    <p className="text-3xl sm:text-4xl font-bold text-red-400">
      {analysisResults.detections.length}
    </p>
  </div>
  
  {/* Total Alerts */}
  <div className="vercel-card p-5 sm:p-6 rounded-xl">
    <p className="text-xs sm:text-sm text-gray-400 mb-2">Total Alerts</p>
    <p className="text-3xl sm:text-4xl font-bold">
      {analysisResults.detections.reduce((sum, d) => sum + d.count, 0)}
    </p>
  </div>
  
  {/* Unique Processes */}
  <div className="vercel-card p-5 sm:p-6 rounded-xl">
    <p className="text-xs sm:text-sm text-gray-400 mb-2">Unique Processes</p>
    <p className="text-3xl sm:text-4xl font-bold">
      {analysisResults.uniqueProcesses}
    </p>
  </div>
</div>
```

**Severity Distribution Chart:**
```tsx
<div className="vercel-card p-6 sm:p-8 rounded-xl">
  <h3 className="text-lg font-semibold mb-6">Severity Distribution</h3>
  <div className="space-y-5">
    {/* High */}
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">High</span>
        <span className="text-sm font-mono">{severityBreakdown.high}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-red-500 to-red-400" 
          style={{ width: `${(severityBreakdown.high / 16) * 100}%` }}
        />
      </div>
    </div>
    {/* Medium, Low... */}
  </div>
</div>
```

**Detection Cards:**
```tsx
{analysisResults.detections.map((detection) => (
  <div key={detection.id} className={`vercel-card border rounded-xl p-5 sm:p-6`}>
    <div className="flex items-start gap-3 sm:gap-4">
      {/* Severity Icon */}
      <div className="mt-0.5">
        {getSeverityIcon(detection.severity)}
      </div>
      
      <div className="flex-1">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <h4 className="text-lg font-semibold">{detection.name}</h4>
          <span className="px-2.5 py-0.5 bg-white/10 rounded-full text-xs font-mono">
            {detection.technique}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase">
            {detection.severity}
          </span>
          <span className="text-xs text-gray-500">• {detection.tactic}</span>
        </div>
        
        {/* Description */}
        <p className="text-sm text-gray-300 mb-4">{detection.description}</p>
        
        {/* Indicators */}
        <div className="flex flex-wrap gap-2 mb-3">
          {detection.indicators.map((indicator, idx) => (
            <span key={idx} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-xs font-mono">
              {indicator}
            </span>
          ))}
        </div>
        
        {/* Event Count */}
        <p className="text-xs sm:text-sm text-gray-400">
          <span className="font-semibold text-white">{detection.count}</span> matching events
        </p>
      </div>
    </div>
  </div>
))}
```

#### Severity Styling

```typescript
function getSeverityStyles(severity: SeverityLevel) {
  switch (severity) {
    case 'high':
      return {
        border: 'border-red-500/20',
        bg: 'bg-red-500/5',
        badge: 'bg-red-500/20 text-red-400',
        glow: 'shadow-lg shadow-red-500/10'
      };
    case 'medium':
      return {
        border: 'border-yellow-500/20',
        bg: 'bg-yellow-500/5',
        badge: 'bg-yellow-500/20 text-yellow-400',
        glow: 'shadow-lg shadow-yellow-500/10'
      };
    case 'low':
      return {
        border: 'border-blue-500/20',
        bg: 'bg-blue-500/5',
        badge: 'bg-blue-500/20 text-blue-400',
        glow: 'shadow-lg shadow-blue-500/10'
      };
  }
}

function getSeverityIcon(severity: SeverityLevel) {
  switch (severity) {
    case 'high': 
      return <AlertTriangle className="w-4 h-4 text-red-400" />;
    case 'medium': 
      return <Info className="w-4 h-4 text-yellow-400" />;
    case 'low': 
      return <CheckCircle className="w-4 h-4 text-blue-400" />;
  }
}
```

### 2. About Page (`src/pages/about.tsx`)

**Purpose:** Documentation and feature showcase

**Sections:**
1. **Project Overview** - What is Sysmon Analyzer
2. **Key Features** - 4 feature cards with icons
3. **Supported Detection Techniques** - List of all 15+ MITRE techniques
4. **Atomic Red Team Coverage** - All 5 atomic tests documented
5. **Technology Stack** - Frontend, Detection Engine, Infrastructure
6. **Resources** - Links to MITRE ATT&CK, Sysmon docs, GitHub

**Atomic Test Coverage:**
```tsx
<div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
  <h3 className="text-base font-semibold text-green-400">
    ✓ Atomic Test #1 - Mimikatz
  </h3>
  <p className="text-sm text-gray-400">
    Downloads Invoke-Mimikatz and dumps credentials via PowerShell download cradle
  </p>
</div>
```

### 3. Navbar (`src/components/navbar.tsx`)

**Features:**
- Logo (logo.png)
- Site title: "Sysmon Threat Analyzer"
- Navigation links (Home, About)
- Dark mode toggle
- Responsive mobile menu

---

## 📁 File Structure

```
X57Designs/
├── public/
│   ├── logo.png                    # App logo (32×32)
│   └── fonts/                      # Custom fonts
│
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx          # Reusable button component
│   │   │   └── dropdown-menu.tsx   # Dropdown menu component
│   │   ├── navbar.tsx              # Main navigation bar
│   │   ├── footer.tsx              # Footer component
│   │   ├── mode-toggle.tsx         # Dark mode switch
│   │   └── icons.tsx               # Icon components
│   │
│   ├── pages/
│   │   ├── home.tsx                # Main analysis page (553 lines)
│   │   ├── about.tsx               # About/documentation page
│   │   └── auth/                   # Authentication pages
│   │
│   ├── lib/
│   │   ├── analyzer.ts             # Main analyzer orchestrator (204 lines)
│   │   ├── utils.ts                # Utility functions
│   │   ├── firebase.ts             # Firebase configuration
│   │   │
│   │   ├── parser/
│   │   │   ├── sysmon-parser.ts    # CSV parser (234 lines)
│   │   │   ├── text-parser.ts      # PowerShell text parser (253 lines)
│   │   │   └── csv-format-detector.ts  # Format detection
│   │   │
│   │   ├── detection/
│   │   │   └── rules-engine.ts     # Detection rules (383 lines)
│   │   │
│   │   └── mitre/
│   │       └── mitre-data.ts       # MITRE ATT&CK data
│   │
│   ├── types/
│   │   ├── sysmon.ts               # TypeScript interfaces (142 lines)
│   │   └── nav.ts                  # Navigation types
│   │
│   ├── App.tsx                     # Main app component
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles
│
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── vite.config.ts                  # Vite config
├── tailwind.config.js              # Tailwind CSS config
└── DOCUMENTATION.md                # This file
```

---

## 🚀 Setup & Installation

### Prerequisites

- Node.js 18+ and npm/yarn
- Modern web browser (Chrome, Firefox, Edge)
- Windows machine with Sysmon installed (for log collection)

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/kishore110804/Sysmon-threat-analyser.git
cd Sysmon-threat-analyser
```

2. **Install dependencies**
```bash
yarn install
# or
npm install
```

3. **Run development server**
```bash
yarn dev
# or
npm run dev
```

4. **Open in browser**
```
http://localhost:5173
```

5. **Build for production**
```bash
yarn build
# or
npm run build
```

Build output will be in `dist/` folder.

### Environment Variables

No environment variables required for basic functionality.

Optional Firebase configuration (for authentication):
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

---

## 📖 Usage Guide

### 1. Collecting Sysmon Logs

#### Method 1: PowerShell (Recommended)

```powershell
# Export last 1000 events as text
Get-WinEvent -LogName "Microsoft-Windows-Sysmon/Operational" -MaxEvents 1000 | 
  Select-Object TimeCreated, Id, Message | 
  Out-File sysmon.txt

# Export all events (may be large)
Get-WinEvent -LogName "Microsoft-Windows-Sysmon/Operational" | 
  Out-File sysmon-all.txt
```

#### Method 2: Event Viewer (CSV)

1. Open Event Viewer (`eventvwr.msc`)
2. Navigate to: Applications and Services Logs → Microsoft → Windows → Sysmon → Operational
3. Right-click → Save All Events As...
4. Choose CSV format
5. Save file

#### Method 3: wevtutil (CSV)

```cmd
wevtutil epl Microsoft-Windows-Sysmon/Operational sysmon.evtx
wevtutil qe sysmon.evtx /f:csv > sysmon.csv
```

### 2. Analyzing Logs

1. **Open the analyzer**
   - Navigate to http://localhost:5173

2. **Upload file**
   - Drag & drop file onto upload area, OR
   - Click "Select File" button

3. **View format guide** (optional)
   - Click "Supported File Formats" to see examples
   - Shows CSV and PowerShell text format examples
   - Quick export commands included

4. **Start analysis**
   - Click "Start Analysis" button
   - Wait for processing (usually < 5 seconds)

5. **Review results**
   - **Statistics**: Total events, threats detected, alerts, processes
   - **Charts**: Severity distribution, top tactics
   - **Detections**: Detailed cards for each threat found
   - Each detection shows:
     - Technique name and ID
     - Severity level (High/Medium/Low)
     - MITRE ATT&CK tactic
     - Description
     - Indicators of Compromise (IOCs)
     - Number of matching events

6. **Export results** (optional)
   - Click "Download Report" for PDF
   - Click "Export JSON" for raw data

### 3. Understanding Results

#### Detection Card Example

```
🔴 Mimikatz Credential Dumping
    [T1003.001] [HIGH] • Credential Access
    
    Invoke-Mimikatz execution detected via PowerShell download cradle
    
    [invoke_mimikatz] [credential_dumping] [download_cradle] [sekurlsa]
    
    5 matching events
```

**What this means:**
- **🔴 Red icon**: High severity threat
- **T1003.001**: MITRE ATT&CK technique ID
- **HIGH**: Severity level (immediate attention required)
- **Credential Access**: The attacker's goal (tactic)
- **Indicators**: Specific IOCs found in your logs
- **5 matching events**: Number of suspicious events detected

#### Severity Levels

| Level | Meaning | Action |
|-------|---------|--------|
| **HIGH** 🔴 | Critical threat, immediate attention required | Investigate immediately, isolate affected systems |
| **MEDIUM** 🟡 | Suspicious activity, should be reviewed | Review within 24 hours, analyze context |
| **LOW** 🔵 | Potentially suspicious, low risk | Review during routine security checks |

#### Common Tactics (MITRE ATT&CK)

- **Credential Access**: Stealing passwords/credentials
- **Execution**: Running malicious code
- **Defense Evasion**: Hiding malicious activity
- **Discovery**: Gathering information about the system
- **Command and Control**: Communicating with attacker's server
- **Privilege Escalation**: Gaining higher permissions
- **Impact**: Destroying data or systems

### 4. Sample Data

Click "Download Sample Data" button to get example Sysmon CSV with:
- Process creation events
- Network connections
- File operations
- Registry modifications
- Example malicious PowerShell

---

## 🔧 API Reference

### Analyzer Module (`src/lib/analyzer.ts`)

#### `analyzeSysmonFile()`

Main entry point for file analysis.

```typescript
async function analyzeSysmonFile(
  file: File,
  options?: AnalyzerOptions
): Promise<AnalysisResult>
```

**Parameters:**
- `file`: File object to analyze (CSV, TXT, or LOG)
- `options`: Optional configuration
  - `maxEvents?: number`: Maximum events to process
  - `skipErrors?: boolean`: Continue on parsing errors
  - `onProgress?: (stage: string, progress: number) => void`: Progress callback

**Returns:** `AnalysisResult` object
```typescript
interface AnalysisResult {
  fileName: string;              // Original filename
  fileSize: number;              // File size in bytes
  totalEvents: number;           // Total events parsed
  detections: Detection[];       // Array of detections
  severityBreakdown: {           // Count by severity
    high: number;
    medium: number;
    low: number;
  };
  topTactics: {                  // Top 5 tactics
    name: string;
    count: number;
  }[];
  uniqueProcesses: number;       // Unique process count
  analyzedAt: string;            // ISO timestamp
  processingTime: string;        // Human-readable time
  format: 'csv' | 'text';        // Detected format
}
```

**Example:**
```typescript
const result = await analyzeSysmonFile(file, {
  maxEvents: 1000,
  skipErrors: true,
  onProgress: (stage, progress) => {
    console.log(`${stage}: ${progress}%`);
  }
});

console.log(`Found ${result.detections.length} threats`);
```

#### `validateSysmonFile()`

Validate file before processing.

```typescript
function validateSysmonFile(file: File): {
  valid: boolean;
  error?: string;
}
```

**Validation checks:**
- File size < 50MB
- Valid extension (.csv, .txt, .log)
- Not empty

**Example:**
```typescript
const validation = validateSysmonFile(file);
if (!validation.valid) {
  alert(validation.error);
  return;
}
```

### Parser Modules

#### CSV Parser

```typescript
import { parseSysmonCSV } from '@/lib/parser/sysmon-parser';

const events = await parseSysmonCSV(file, {
  maxEvents: 500,
  skipErrors: true,
  onProgress: (events) => {
    console.log(`Parsed ${events.length} events`);
  }
});
```

#### Text Parser

```typescript
import { parseSysmonText } from '@/lib/parser/text-parser';

const events = await parseSysmonText(file, {
  maxEvents: 500,
  onProgress: (events) => {
    console.log(`Parsed ${events.length} events`);
  }
});
```

### Detection Engine

```typescript
import { runDetection } from '@/lib/detection/rules-engine';

const detections = runDetection(events);
console.log(`Found ${detections.length} threats`);

// Get severity breakdown
import { calculateSeverityBreakdown } from '@/lib/detection/rules-engine';
const breakdown = calculateSeverityBreakdown(detections);

// Get top tactics
import { calculateTopTactics } from '@/lib/detection/rules-engine';
const tactics = calculateTopTactics(detections);
```

### Type Definitions

#### SysmonEvent

```typescript
interface SysmonEvent {
  // Core fields (required)
  EventID: string;
  TimeCreated: string;
  Computer: string;
  
  // Process fields
  Image?: string;
  CommandLine?: string;
  User?: string;
  ParentImage?: string;
  ParentCommandLine?: string;
  ProcessId?: string;
  ProcessGuid?: string;
  
  // Process Access (Event ID 10)
  SourceImage?: string;
  TargetImage?: string;
  SourceUser?: string;
  TargetUser?: string;
  GrantedAccess?: string;
  SourceProcessId?: string;
  TargetProcessId?: string;
  
  // Network fields (Event ID 3)
  DestinationIp?: string;
  DestinationPort?: string;
  SourceIp?: string;
  SourcePort?: string;
  Protocol?: string;
  
  // File fields (Event ID 11)
  TargetFilename?: string;
  CreationUtcTime?: string;
  
  // Registry fields (Event ID 12, 13, 14)
  TargetObject?: string;
  Details?: string;
  EventType?: string;
  
  // DNS fields (Event ID 22)
  QueryName?: string;
  QueryResults?: string;
  
  // Image Load (Event ID 7)
  ImageLoaded?: string;
  
  // Script Block (Event ID 4104)
  ScriptBlockText?: string;
  
  // Additional fields
  [key: string]: any;
}
```

#### Detection

```typescript
interface Detection {
  id: string;                   // Rule ID
  technique: string;            // MITRE ATT&CK ID (e.g., T1003.001)
  name: string;                 // Detection name
  tactic: string;               // MITRE tactic
  severity: 'high' | 'medium' | 'low';
  count: number;                // Number of matching events
  description: string;          // What was detected
  indicators: string[];         // Matched IOCs
  confidence: number;           // Confidence score (0-100)
  events: SysmonEvent[];        // Matching events (limited)
}
```

---

## 🤝 Contributing

### Adding New Detection Rules

1. **Open** `src/lib/detection/rules-engine.ts`

2. **Add rule to `DETECTION_RULES` array:**

```typescript
{
  id: 'T1234.567',              // MITRE technique ID
  name: 'Your Detection Name',
  technique: 'T1234.567',
  tactic: 'Execution',          // MITRE tactic
  severity: 'high',             // high, medium, or low
  description: 'What this detects',
  patterns: [
    {
      field: 'CommandLine',     // SysmonEvent field
      pattern: /suspicious.*pattern/i  // Regex or string
    },
    {
      field: 'Image',
      pattern: /malicious\.exe$/i
    }
  ],
  indicators: [                 // IOC names (one per pattern)
    'suspicious_command',
    'malicious_binary'
  ],
  confidence: 85                // 0-100
}
```

3. **Test rule:**
```bash
yarn build
yarn dev
# Upload test data
```

4. **Update About page** (`src/pages/about.tsx`) with new rule documentation

### Adding New Parser Support

1. **Create parser file** in `src/lib/parser/`

2. **Implement parser function:**
```typescript
export async function parseMyFormat(
  file: File,
  options?: ParserOptions
): Promise<SysmonEvent[]> {
  const text = await file.text();
  const events: SysmonEvent[] = [];
  
  // Parse logic here
  
  return events;
}
```

3. **Add format detection** in `csv-format-detector.ts`

4. **Update analyzer** (`src/lib/analyzer.ts`) to use new parser

5. **Update format guide** in UI (`src/pages/home.tsx`)

### Code Style

- TypeScript strict mode
- Functional components (React hooks)
- Tailwind CSS for styling
- ESLint + Prettier for formatting

---

## 📝 Changelog

### Version 2.0 (Current)

**✅ Completed Features:**
- Full CSV parser with Papa Parse (234 lines)
- Complete PowerShell text parser (253 lines)
- 15+ MITRE ATT&CK detection rules
- All 5 Atomic Red Team PowerShell tests covered
- Interactive format guide in UI
- LSASS Memory Access detection (T1003.001)
- BloodHound/SharpHound detection (T1087.002)
- UAC Bypass detection (T1548.002)
- Cradlecraft PsSendKeys detection (T1059.001)
- Memory-only PowerShell execution detection
- Logo branding (logo.png)
- About page with full documentation
- Export functionality (PDF/JSON)

**🐛 Bug Fixes:**
- Fixed 31 TypeScript compilation errors
- Fixed Event ID 10 field extraction
- Fixed logo path in navbar and favicon
- Fixed format detection for mixed content

**📦 Build:**
- Production build: 5.20s
- Bundle size: 769 KB (gzipped: 202 KB)
- 1357 modules transformed

---

## 📧 Support

**Repository:** https://github.com/kishore110804/Sysmon-threat-analyser

**Issues:** https://github.com/kishore110804/Sysmon-threat-analyser/issues

**Author:** kishore110804

---

## 📜 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- **Microsoft Sysinternals** - Sysmon tool
- **MITRE Corporation** - ATT&CK framework
- **Atomic Red Team** - Attack simulation tests
- **Papa Parse** - CSV parsing library
- **Vercel** - UI design inspiration
- **Lucide** - Icon library

---

**Last Updated:** November 9, 2025
**Version:** 2.0
**Total Lines of Code:** ~3,000+
