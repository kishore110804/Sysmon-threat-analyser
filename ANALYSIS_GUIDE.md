# 🎯 Sysmon Threat Analysis Guide

## What I Enhanced for Your Data

Your PowerShell text format contains **CRITICAL security events**! Here's what I improved:

### ✅ New Detection: LSASS Memory Access (T1003.001)

**What it detects:**
- Process Access (Event ID 10) to `lsass.exe`
- Common credential dumping technique
- Severity: **HIGH**

**In your data, I found:**
```
SourceImage: C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe
TargetImage: C:\Windows\system32\lsass.exe
GrantedAccess: 0x1010
```

This is **PowerShell accessing LSASS** - a red flag for potential credential theft!

---

## 📋 How to Analyze Your Data

### Step 1: Save Your Text File
Copy your PowerShell output to a `.txt` file:
```powershell
Get-WinEvent -LogName "Microsoft-Windows-Sysmon/Operational" | Format-List > sysmon_events.txt
```

### Step 2: Upload to Analyzer
1. Go to http://localhost:5173/
2. Drag and drop your `.txt` file
3. Click **"Analyze"**

### Step 3: Check Console for Debug Output
Open browser console (F12) to see:
```
Text parser: File content length: 123456
Text parser: Found 50 event blocks
Text parser: Parsed 50 valid events with 0 errors
Total events parsed: 50
Detections found: 3
```

---

## 🔍 What the Analyzer Will Detect

Based on your data, expect to see:

### 1. **LSASS Memory Access** (T1003.001)
- **Severity:** HIGH
- **Events:** PowerShell → LSASS (Event ID 10)
- **Indicators:** credential_dumping, lsass_access
- **MITRE Tactic:** Credential Access

### 2. **PowerShell Execution** (T1059.001)
- **Severity:** MEDIUM
- **Events:** powershell.exe processes
- **Indicators:** suspicious_powershell
- **MITRE Tactic:** Execution

### 3. **Process Termination** (Event ID 5)
- Multiple processes terminated:
  - LocationNotificationWindows.exe
  - backgroundTaskHost.exe
  - notepad.exe
  - rundll32.exe
  - whoami.exe

### 4. **Suspicious Commands**
- `whoami.exe` - User enumeration (T1033)
- `HOSTNAME.EXE` - System discovery (T1082)
- `rundll32.exe` - Potential DLL abuse (T1218.011)

---

## 📊 Expected Analysis Results

### Top Tactics (MITRE ATT&CK)
1. **Credential Access** - LSASS targeting
2. **Execution** - PowerShell commands
3. **Discovery** - whoami, hostname
4. **Defense Evasion** - rundll32

### Severity Distribution
- **High:** 1-2 detections (LSASS access)
- **Medium:** 3-5 detections (PowerShell, discovery)
- **Low:** 2-4 detections (normal operations)

### Timeline
Your events span: **October 19, 2025** around 07:55 (UTC)

---

## 🚨 Critical Findings in Your Data

### ⚠️ HIGH SEVERITY: LSASS Access Detected

**Event Details:**
```
Message: Process accessed:
  SourceImage: C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe
  TargetImage: C:\Windows\system32\lsass.exe
  GrantedAccess: 0x1010
  SourceUser: DESKTOP-76KGJ24\aakaa
  TargetUser: NT AUTHORITY\SYSTEM
```

**Why This Matters:**
- LSASS (Local Security Authority Subsystem Service) stores credentials
- PowerShell accessing LSASS is unusual and potentially malicious
- `0x1010` access rights allow reading process memory
- Common technique for credential theft (Mimikatz-style)

**Recommendation:**
- Investigate what PowerShell script was running
- Check for credential dumping tools
- Review user `aakaa` activities
- Scan for malware/persistence mechanisms

---

## 🔧 Troubleshooting

### If Loading Hangs
1. Open Console (F12)
2. Check last log message:
   - Stuck at "Starting analysis"? → File upload issue
   - Stuck at "Format detected"? → Parser issue
   - Stuck at "Parsing events"? → Large file, wait longer
   - Stuck at "Running detections"? → Detection rules issue

### If No Detections Found
- Check: Are EventID fields present?
- Check: Is TimeCreated field valid?
- Check: Console shows parsed events count

### File Format Requirements
Your format is perfect! Ensure:
- ✅ Contains "Message :" headers
- ✅ Contains "Id :" fields
- ✅ Contains "ProviderName : Microsoft-Windows-Sysmon"
- ✅ Events separated by blank lines

---

## 📈 Understanding the UI

### Stats Cards
- **Total Events:** Number of Sysmon events parsed
- **Threats Detected:** Number of suspicious patterns found
- **Severity Score:** Weighted threat level (0-100)
- **MITRE Coverage:** Number of ATT&CK techniques detected

### Severity Chart
Visual breakdown of threat levels:
- 🔴 Red = High severity (credential access, exploitation)
- 🟡 Yellow = Medium severity (suspicious behavior)
- 🔵 Blue = Low severity (reconnaissance)

### MITRE Tactics Chart
Shows attack stages detected in your data:
- Credential Access (LSASS targeting)
- Execution (PowerShell, processes)
- Discovery (whoami, hostname)
- Defense Evasion (rundll32)

### Detection Details
Each detection shows:
- **Technique ID:** MITRE ATT&CK reference
- **Name:** Human-readable description
- **Severity:** Risk level
- **Count:** How many events matched
- **Confidence:** Detection accuracy (0-100%)
- **Indicators:** Tags for filtering
- **Event IDs:** Matching Sysmon events

---

## 💾 Export Options

### Download Report (TXT)
Complete text report with:
- Executive summary
- Detection breakdown
- MITRE mapping
- Timeline analysis
- Recommendations

### Export JSON
Raw analysis data for:
- Integration with SIEM
- Custom analysis tools
- Long-term storage
- Sharing with team

---

## 🎓 Next Steps

### Immediate Actions
1. ✅ Upload your file to the analyzer
2. ✅ Review LSASS access detection
3. ✅ Check console for parse results
4. ✅ Download full report

### Investigation
1. Identify the PowerShell script accessing LSASS
2. Review user `aakaa` account activities
3. Check for persistence mechanisms
4. Scan system for malware
5. Review other suspicious processes (rundll32, whoami)

### Prevention
1. Enable PowerShell logging (ScriptBlock, Module, Transcription)
2. Monitor LSASS access with Windows Defender ATP
3. Implement Credential Guard
4. Use Protected Process Light (PPL) for LSASS
5. Regular security audits

---

## 📚 Resources

### MITRE ATT&CK Techniques
- **T1003.001:** LSASS Memory
- **T1059.001:** PowerShell
- **T1033:** System Owner/User Discovery
- **T1082:** System Information Discovery
- **T1218.011:** Rundll32

### Sysmon Event IDs
- **Event ID 1:** Process Creation
- **Event ID 5:** Process Termination
- **Event ID 10:** Process Access (LSASS targeting)

---

## 🔒 Security Note

Your data shows **clear indicators of credential access attempts**. This could be:
- ✅ Legitimate security testing
- ✅ Penetration testing activity
- ⚠️ Malware activity
- ⚠️ Insider threat
- ⚠️ Compromised account

**Always investigate LSASS access in production environments!**

---

## Need Help?

If the analyzer isn't working:
1. Check console logs (F12)
2. Share the error message
3. Verify file format matches this guide
4. Try with sample data first (Download Sample button)

Your data is **perfect** for analysis - the parser is specifically designed for this PowerShell format! 🎉
