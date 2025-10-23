# Sysmon CSV Format Guide

## ✅ Supported CSV Formats

The analyzer automatically detects and handles multiple CSV formats:

### 1. **Sysmon Direct Export** (Recommended) ⭐
```csv
UtcTime,EventID,Computer,ProcessId,Image,CommandLine,User
2024-10-22 10:30:45.123,1,DESKTOP-01,4512,C:\Windows\System32\powershell.exe,powershell.exe -enc JAB...,DOMAIN\user
```

### 2. **Windows Event Log CSV**
```csv
Level,Date and Time,Source,Event ID,Task Category,Computer,Message
Information,10/22/2024 10:30:45 AM,Microsoft-Windows-Sysmon,1,Process Create,DESKTOP-01,Process Create: Image: C:\Windows\...
```

### 3. **Custom Format** (Flexible)
As long as your CSV has these **required columns** (names can vary):
- **EventID** (or Event ID, EventId, ID)
- **TimeCreated** (or UtcTime, Timestamp, Time, Date)
- **At least one of**: Image, CommandLine, SourceIp, QueryName, or TargetFilename

---

## 📋 How to Export Sysmon Logs

### Method 1: PowerShell (Best for analysis)

```powershell
# Export all Sysmon events
Get-WinEvent -LogName "Microsoft-Windows-Sysmon/Operational" | 
  Select-Object TimeCreated, Id, MachineName, UserId, Message | 
  Export-Csv -Path "sysmon_export.csv" -NoTypeInformation

# Export with filtering (last 24 hours)
Get-WinEvent -FilterHashtable @{
  LogName='Microsoft-Windows-Sysmon/Operational'
  StartTime=(Get-Date).AddDays(-1)
} | Export-Csv "sysmon_24h.csv" -NoTypeInformation

# Export specific event types (Process Creation, Network, DNS)
Get-WinEvent -LogName "Microsoft-Windows-Sysmon/Operational" |
  Where-Object {$_.Id -in @(1,3,22)} |
  Export-Csv "sysmon_filtered.csv" -NoTypeInformation
```

### Method 2: Event Viewer GUI

1. Open **Event Viewer** (Win + R → `eventvwr`)
2. Navigate to: **Applications and Services Logs** → **Microsoft** → **Windows** → **Sysmon** → **Operational**
3. Right-click on **Sysmon/Operational**
4. Select **"Save All Events As..."**
5. Choose **CSV** format
6. Save the file

### Method 3: Using EvtxToElk Tool

```powershell
# Download EvtxToElk from GitHub
# Run conversion
.\EvtxToElk.exe -i "C:\Windows\System32\winevt\Logs\Microsoft-Windows-Sysmon%4Operational.evtx" -o sysmon.csv
```

---

## 🔍 What Happens If Format Is Wrong?

The analyzer will:

1. **Auto-Detect** the CSV format in first 10KB
2. **Validate** required columns exist
3. **Show Clear Error** with specific issues:
   ```
   ❌ Missing required columns: EventID, TimeCreated
   
   💡 This looks like a Windows Event Log export. 
      Try exporting Sysmon events specifically (EventID 1-26).
   
   📋 How to export correctly:
      • PowerShell: Get-WinEvent -LogName "Microsoft-Windows-Sysmon/Operational" | Export-Csv
      • Event Viewer: Filter by Sysmon logs before exporting
      • Use sample data button to test the analyzer
   ```

4. **Suggest Fixes** based on detected format

---

## 📊 Expected Sysmon Event Types

The analyzer recognizes these EventIDs:

| Event ID | Event Type | Key Columns |
|----------|------------|-------------|
| 1 | Process Creation | Image, CommandLine, ParentImage |
| 3 | Network Connection | SourceIp, DestinationIp, Protocol |
| 11 | File Created | TargetFilename |
| 12-14 | Registry Event | TargetObject, Details |
| 22 | DNS Query | QueryName, QueryResults |
| 4104 | PowerShell Script Block | ScriptBlockText |

---

## ⚙️ Column Name Variations

The analyzer handles different column name formats:

### EventID variations:
- `EventID`
- `EventId`  
- `Event ID`
- `Event_ID`
- `ID`

### Time variations:
- `TimeCreated`
- `UtcTime`
- `Timestamp`
- `Time`
- `Date`

### Computer variations:
- `Computer`
- `ComputerName`
- `Computer Name`
- `Hostname`
- `Host`

### Process variations:
- `Image` (preferred)
- `ProcessName`
- `Process`
- `ExecutablePath`

---

## 🧪 Testing Without Real Data

**Use the "Download Sample Data" button!**

The analyzer includes a sample CSV generator with realistic threat scenarios:
- PowerShell encoded commands
- Download cradles
- Mimikatz execution
- Registry persistence
- Shadow copy deletion
- Suspicious network connections

Click **"Download Sample Data"** → Upload the file → See real detections!

---

## ❓ Common Issues & Solutions

### Issue: "File format not recognized"
**Solution**: Export from Sysmon logs specifically, not general Windows logs.

### Issue: "Missing EventID column"
**Solution**: Your CSV might use "Event ID" (with space) or "EventId". The analyzer handles this automatically, but check if column exists.

### Issue: "No detections found"
**Solution**: 
- Verify you're exporting **Sysmon events** (not Security logs)
- Check EventID column contains values 1-26, not 4688
- Use sample data to verify analyzer works

### Issue: "File too large"
**Solution**: 
- Filter by time range in PowerShell
- Export only relevant event types (1, 3, 22)
- Current limit is 50MB

---

## 💡 Pro Tips

1. **Filter Before Export**: Export only relevant time periods to reduce file size
2. **Include Multiple Event Types**: More event types = better detection coverage
3. **Test First**: Use sample data to understand the output before analyzing production logs
4. **Check Sysmon Config**: Ensure Sysmon is configured to capture the events you need
5. **Regular Exports**: Analyze logs regularly for continuous monitoring

---

## 🚀 Quick Start Workflow

1. **Export logs**:
   ```powershell
   Get-WinEvent -LogName "Microsoft-Windows-Sysmon/Operational" | 
     Export-Csv sysmon.csv -NoTypeInformation
   ```

2. **Upload to analyzer**:
   - Drag & drop OR click "Select File"
   - Wait for format validation
   - Click "Start Analysis"

3. **Review results**:
   - Check threat detections
   - Review MITRE ATT&CK mappings
   - Export report if needed

---

## 📖 Additional Resources

- [Sysmon Documentation](https://docs.microsoft.com/en-us/sysinternals/downloads/sysmon)
- [MITRE ATT&CK](https://attack.mitre.org/)
- [Sysmon Configuration Examples](https://github.com/SwiftOnSecurity/sysmon-config)

---

**Need help?** The analyzer provides real-time format validation and helpful suggestions when you upload a file! 🎯
