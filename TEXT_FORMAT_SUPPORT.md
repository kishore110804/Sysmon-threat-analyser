# PowerShell Text Format Support

## Overview
The analyzer now supports **both CSV and PowerShell text format** for Sysmon event logs!

## Supported File Formats

### 1. CSV Format
- Traditional Sysmon CSV exports
- Custom CSV formats with Sysmon columns
- Auto-detected and validated

### 2. PowerShell Text Format (NEW!)
- Output from `Get-WinEvent` PowerShell cmdlet
- Windows Event Log text exports
- Structured key-value pair format

## How to Export PowerShell Text Format

```powershell
# Export Sysmon events to text file
Get-WinEvent -LogName "Microsoft-Windows-Sysmon/Operational" | 
    Select-Object Message, Id, TimeCreated, RecordId, ProviderName, ProcessId, ThreadId | 
    Out-File -FilePath sysmon-events.txt
```

## Example PowerShell Text Format

```
Message              : Process accessed:
                       RuleName: -
                       UtcTime: 2025-10-19 07:49:01.683
                       SourceProcessGuid: {c8eef8e0-cc9b-673e-6901-000000000f00}
                       SourceProcessId: 508
                       SourceThreadId: 548
                       SourceImage: C:\Windows\System32\lsass.exe
                       TargetProcessGuid: {c8eef8e0-cc9c-673e-6d01-000000001100}
                       TargetProcessId: 640
                       TargetImage: C:\Windows\System32\services.exe
                       GrantedAccess: 0x1000
                       CallTrace: ...
Id                   : 10
Version              : 3
RecordId             : 24295
TimeCreated          : 19-10-2025 13:19:01
ProviderName         : Microsoft-Windows-Sysmon
```

## File Upload Support

The UI now accepts:
- `.csv` files
- `.txt` files  
- `.log` files

## Auto-Detection

The analyzer automatically detects the file format by:
1. Checking for PowerShell text format signatures:
   - "Message" field
   - "Id" field  
   - "TimeCreated" field
   - "ProviderName: Microsoft-Windows-Sysmon"

2. If not PowerShell format, validates as CSV

## Implementation Details

### Key Files Modified

1. **src/lib/parser/text-parser.ts** (NEW)
   - PowerShell text format parser
   - Extracts Sysmon fields from Message section
   - Maps to SysmonEvent structure

2. **src/lib/analyzer.ts**
   - Added format auto-detection
   - Routes to appropriate parser (CSV or text)
   - Unified error handling

3. **src/pages/home.tsx**
   - Updated file input to accept `.csv`, `.txt`, `.log`
   - Updated drag-and-drop to accept all formats
   - Updated UI text to mention multiple formats

### Parsing Strategy

For PowerShell text format:
1. Read file as text
2. Split by blank lines to separate events
3. Extract key-value pairs using regex
4. Parse nested Sysmon fields from Message section
5. Map to SysmonEvent structure
6. Validate and return results

### Field Mapping

PowerShell properties → SysmonEvent fields:
- `Id` → `EventID`
- `TimeCreated` → `UtcTime`
- Message fields → Direct mapping (ProcessId, Image, etc.)
- `ProviderName` → Validation check
- `RecordId` → `ProcessGuid` (fallback)

## Usage

1. Export your Sysmon events using PowerShell or CSV
2. Drop the file onto the analyzer (CSV, TXT, or LOG)
3. The format is automatically detected
4. Analysis proceeds with same detection rules
5. View results with full MITRE ATT&CK enrichment

## Benefits

- ✅ No need to convert PowerShell exports to CSV
- ✅ Works with native Windows event log exports
- ✅ Same detection rules apply to both formats
- ✅ Automatic format detection
- ✅ Consistent analysis results

## Testing

To test with PowerShell format:
1. Use provided example data
2. Or export your own Sysmon events:
   ```powershell
   Get-WinEvent -LogName "Microsoft-Windows-Sysmon/Operational" | 
       Select-Object -First 100 | 
       Format-List * | 
       Out-File test-sysmon.txt
   ```
3. Upload to the analyzer
4. Verify format is detected as "PowerShell Text"
5. Check analysis results

## Troubleshooting

**Q: File not being detected as PowerShell format?**
- Ensure file contains "Message", "Id", "TimeCreated" fields
- Check that "ProviderName: Microsoft-Windows-Sysmon" is present
- Verify events are separated by blank lines

**Q: Getting parsing errors?**
- Check that Message field contains Sysmon data
- Ensure key-value pairs are formatted correctly
- Try exporting with `Format-List *` in PowerShell

**Q: Some events not being parsed?**
- Check errors array in parse result
- Verify EventID is present (from "Id" field)
- Ensure Message contains proper Sysmon structure

## Future Enhancements

- [ ] Support for JSON format
- [ ] Direct Windows Event Log API integration
- [ ] Real-time PowerShell streaming
- [ ] Custom field mapping configuration
- [ ] Multi-format batch processing
