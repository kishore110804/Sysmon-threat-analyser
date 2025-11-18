import { Target, Shield, Activity, GitBranch } from "lucide-react"

export default function About() {
  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <div className="gradient-bg">
        <div className="container mx-auto max-w-5xl px-4 py-16">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">About Sysmon Analyzer</h1>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
              A modern threat detection platform powered by Sysmon and MITRE ATT&CK
            </p>
          </div>

          {/* What is Sysmon Analyzer */}
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-semibold">What is Sysmon Analyzer?</h2>
            <p className="mb-4 text-base text-gray-300">
              Sysmon Analyzer is a web-based threat detection platform that helps security professionals
              analyze Windows Sysmon logs and identify malicious behavior using the MITRE ATT&CK framework.
            </p>
            <p className="text-base text-gray-300">
              Upload your Sysmon CSV logs, and our detection engine will automatically identify suspicious
              patterns, map them to MITRE ATT&CK techniques, and provide detailed analysis with actionable
              indicators of compromise.
            </p>
          </section>

          {/* Features Grid */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-semibold">Key Features</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="vercel-card rounded-xl p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Target className="h-6 w-6 text-blue-400" />
                  <h3 className="text-lg font-semibold">MITRE ATT&CK Mapping</h3>
                </div>
                <p className="text-sm text-gray-400">
                  Automatically map detected threats to MITRE ATT&CK techniques, tactics, and procedures
                  for standardized threat intelligence.
                </p>
              </div>

              <div className="vercel-card rounded-xl p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Shield className="h-6 w-6 text-purple-400" />
                  <h3 className="text-lg font-semibold">Pattern Detection</h3>
                </div>
                <p className="text-sm text-gray-400">
                  Advanced rule-based detection engine identifies malicious PowerShell, command injection,
                  obfuscation, and C2 communication patterns.
                </p>
              </div>

              <div className="vercel-card rounded-xl p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Activity className="h-6 w-6 text-green-400" />
                  <h3 className="text-lg font-semibold">Real-time Analysis</h3>
                </div>
                <p className="text-sm text-gray-400">
                  Fast CSV parsing and instant detection results with detailed indicators, severity scoring,
                  and event correlation.
                </p>
              </div>

              <div className="vercel-card rounded-xl p-6">
                <div className="mb-4 flex items-center gap-3">
                  <GitBranch className="h-6 w-6 text-orange-400" />
                  <h3 className="text-lg font-semibold">Export Reports</h3>
                </div>
                <p className="text-sm text-gray-400">
                  Generate comprehensive PDF reports or export raw JSON data for integration with SIEM
                  platforms and threat intelligence feeds.
                </p>
              </div>
            </div>
          </section>

          {/* Supported Techniques */}
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-semibold">Supported Detection Techniques</h2>
            <div className="vercel-card rounded-xl p-6 sm:p-8">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-gray-500">▸</span>
                  <div>
                    <strong className="text-base">T1059.001 - PowerShell Execution:</strong>{" "}
                    <span className="text-sm text-gray-400">
                      Detection of malicious PowerShell usage including encoded commands, download cradles,
                      execution policy bypasses, and memory-only fileless execution
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-gray-500">▸</span>
                  <div>
                    <strong className="text-base">T1003.001 - LSASS Memory Access / Mimikatz:</strong>{" "}
                    <span className="text-sm text-gray-400">
                      Detects credential dumping via LSASS memory access and Invoke-Mimikatz execution
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-gray-500">▸</span>
                  <div>
                    <strong className="text-base">T1087.002 - BloodHound/SharpHound:</strong>{" "}
                    <span className="text-sm text-gray-400">
                      Detection of Active Directory enumeration tools (BloodHound/SharpHound) including
                      disk-based and memory-only execution via download cradles
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-gray-500">▸</span>
                  <div>
                    <strong className="text-base">T1059.001 - Cradlecraft PsSendKeys:</strong>{" "}
                    <span className="text-sm text-gray-400">
                      Identifies GUI automation attacks using PsSendKeys (opens Notepad, automates keystrokes
                      for payload execution)
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-gray-500">▸</span>
                  <div>
                    <strong className="text-base">T1548.002 - UAC Bypass via App Paths:</strong>{" "}
                    <span className="text-sm text-gray-400">
                      Detects UAC bypass techniques using Windows App Paths registry manipulation (Invoke-AppPathBypass)
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-gray-500">▸</span>
                  <div>
                    <strong className="text-base">T1027 - Obfuscation:</strong>{" "}
                    <span className="text-sm text-gray-400">
                      Identification of obfuscated scripts, Base64 encoding, and other obfuscation techniques
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-gray-500">▸</span>
                  <div>
                    <strong className="text-base">T1071.001 - Web Protocols (C2):</strong>{" "}
                    <span className="text-sm text-gray-400">
                      Detection of suspicious network connections and web-based command and control
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-gray-500">▸</span>
                  <div>
                    <strong className="text-base">T1055 - Process Injection:</strong>{" "}
                    <span className="text-sm text-gray-400">
                      Detects process injection techniques (VirtualAlloc, WriteProcessMemory, CreateRemoteThread)
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-gray-500">▸</span>
                  <div>
                    <strong className="text-base">T1547.001 - Registry Run Keys / Persistence:</strong>{" "}
                    <span className="text-sm text-gray-400">
                      Monitors autorun registry keys and startup folder modifications for persistence
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-gray-500">▸</span>
                  <div>
                    <strong className="text-base">T1490 - Inhibit System Recovery:</strong>{" "}
                    <span className="text-sm text-gray-400">
                      Detects attempts to delete backups, shadow copies, or disable recovery (ransomware behavior)
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Atomic Red Team Coverage */}
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-semibold">Atomic Red Team Test Coverage</h2>
            <div className="vercel-card rounded-xl p-6 sm:p-8">
              <p className="mb-6 text-sm text-gray-400">
                This analyzer covers all atomic tests for PowerShell-based attack simulations:
              </p>
              <div className="space-y-4">
                <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                  <h3 className="mb-2 text-base font-semibold text-green-400">✓ Atomic Test #1 - Mimikatz</h3>
                  <p className="text-sm text-gray-400">
                    Downloads Invoke-Mimikatz and dumps credentials via PowerShell download cradle
                  </p>
                </div>
                <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                  <h3 className="mb-2 text-base font-semibold text-green-400">✓ Atomic Test #2 - Run BloodHound from Local Disk</h3>
                  <p className="text-sm text-gray-400">
                    Fetches SharpHound.ps1, imports it, runs AD collection, and writes *BloodHound.zip to %TEMP%
                  </p>
                </div>
                <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                  <h3 className="mb-2 text-base font-semibold text-green-400">✓ Atomic Test #3 - Run BloodHound from Memory</h3>
                  <p className="text-sm text-gray-400">
                    Loads SharpHound directly into memory via IEX (New-Object Net.WebClient).DownloadString(...)
                  </p>
                </div>
                <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                  <h3 className="mb-2 text-base font-semibold text-green-400">✓ Atomic Test #4 - Mimikatz Cradlecraft PsSendKeys</h3>
                  <p className="text-sm text-gray-400">
                    Automates GUI (opens Notepad, etc.) and executes Mimikatz using PsSendKeys automation
                  </p>
                </div>
                <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                  <h3 className="mb-2 text-base font-semibold text-green-400">✓ Atomic Test #5 - Invoke-AppPathBypass</h3>
                  <p className="text-sm text-gray-400">
                    Runs a UAC bypass (Windows 10) via App Paths registry manipulation to start a payload
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Technology Stack */}
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-semibold">Technology Stack</h2>
            <div className="vercel-card rounded-xl p-6 sm:p-8">
              <div className="grid gap-8 md:grid-cols-3">
                <div>
                  <h3 className="mb-3 text-base font-semibold">Frontend</h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• React + TypeScript</li>
                    <li>• Vite Build Tool</li>
                    <li>• Tailwind CSS</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 text-base font-semibold">Detection Engine</h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Pattern Matching</li>
                    <li>• MITRE STIX Data</li>
                    <li>• Severity Scoring</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 text-base font-semibold">Infrastructure</h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Firebase Auth</li>
                    <li>• Cloud Storage</li>
                    <li>• Serverless Functions</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Resources */}
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-semibold">Resources</h2>
            <div className="space-y-4">
              <a
                href="https://attack.mitre.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="vercel-card block rounded-xl p-5"
              >
                <h3 className="mb-1 text-base font-semibold">MITRE ATT&CK Framework</h3>
                <p className="text-sm text-gray-400">
                  Official MITRE ATT&CK knowledge base of adversary tactics and techniques
                </p>
              </a>
              <a
                href="https://docs.microsoft.com/en-us/sysinternals/downloads/sysmon"
                target="_blank"
                rel="noopener noreferrer"
                className="vercel-card block rounded-xl p-5"
              >
                <h3 className="mb-1 text-base font-semibold">Sysmon Documentation</h3>
                <p className="text-sm text-gray-400">
                  Microsoft Sysinternals Sysmon documentation and download
                </p>
              </a>
              <a
                href="https://github.com/kishore110804"
                target="_blank"
                rel="noopener noreferrer"
                className="vercel-card block rounded-xl p-5"
              >
                <h3 className="mb-1 text-base font-semibold">GitHub Repository</h3>
                <p className="text-sm text-gray-400">View source code and contribute to the project</p>
              </a>
            </div>
          </section>

          {/* Attack Techniques Explained */}
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-semibold"> Attack Techniques Explained </h2>
            <p className="mb-8 text-sm text-gray-400">
              Here's what each attack does, why attackers use them, and what damage they can cause.
            </p>
            
            <div className="space-y-6">
              {/* Mimikatz */}
              <div className="vercel-card rounded-xl border-l-4 border-red-500 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400">
                    CRITICAL
                  </span>
                  <h3 className="text-lg font-bold text-red-400">T1003.001 - Mimikatz (Credential Dumping)</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <p><strong className="text-white">What it is:</strong> <span className="text-gray-300">A hacking tool that steals passwords from Windows memory</span></p>
                  <p><strong className="text-white">Attacker's Goal:</strong> <span className="text-gray-300">Extract login credentials (usernames & passwords) from running processes</span></p>
                  <p><strong className="text-white">How it works:</strong> <span className="text-gray-300">Reads Windows LSASS process memory where passwords are temporarily stored</span></p>
                  <p><strong className="text-white">Damage:</strong> <span className="text-red-300"> Can steal admin passwords → Full network takeover, data theft, ransomware deployment</span></p>
                  <p><strong className="text-white">Real-world use:</strong> <span className="text-gray-300">Used in 80%+ of ransomware attacks to spread laterally across networks</span></p>
                </div>
              </div>

              {/* PowerShell */}
              <div className="vercel-card rounded-xl border-l-4 border-orange-500 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-400">
                    HIGH
                  </span>
                  <h3 className="text-lg font-bold text-orange-400">T1059.001 - Malicious PowerShell</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <p><strong className="text-white">What it is:</strong> <span className="text-gray-300">Abusing Windows' built-in scripting tool (PowerShell) to run malicious code</span></p>
                  <p><strong className="text-white">Attacker's Goal:</strong> <span className="text-gray-300">Execute commands without installing malware (living off the land)</span></p>
                  <p><strong className="text-white">How it works:</strong> <span className="text-gray-300">Downloads malicious scripts from internet, runs them in memory (no file on disk)</span></p>
                  <p><strong className="text-white">Damage:</strong> <span className="text-orange-300"> Install backdoors, steal data, disable security tools, download more malware</span></p>
                  <p><strong className="text-white">Why it's dangerous:</strong> <span className="text-gray-300">Hard to detect (no file written), looks like normal admin activity</span></p>
                </div>
              </div>

              {/* BloodHound */}
              <div className="vercel-card rounded-xl border-l-4 border-purple-500 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-400">
                    HIGH
                  </span>
                  <h3 className="text-lg font-bold text-purple-400">T1087.002 - BloodHound/SharpHound (AD Reconnaissance)</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <p><strong className="text-white">What it is:</strong> <span className="text-gray-300">Mapping tool that draws a "treasure map" of your company's network</span></p>
                  <p><strong className="text-white">Attacker's Goal:</strong> <span className="text-gray-300">Find the fastest path to Domain Admin (god-mode access)</span></p>
                  <p><strong className="text-white">How it works:</strong> <span className="text-gray-300">Scans Active Directory to find users, computers, permissions, trust relationships</span></p>
                  <p><strong className="text-white">Damage:</strong> <span className="text-purple-300">Reveals weak spots in your network → Attackers know exactly who to target next</span></p>
                  <p><strong className="text-white">Output:</strong> <span className="text-gray-300">Creates a visual graph showing "if I hack user X, I can access server Y"</span></p>
                </div>
              </div>

              {/* PsSendKeys */}
              <div className="vercel-card rounded-xl border-l-4 border-yellow-500 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-400">
                    MEDIUM
                  </span>
                  <h3 className="text-lg font-bold text-yellow-400">T1059.001 - PsSendKeys (GUI Automation)</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <p><strong className="text-white">What it is:</strong> <span className="text-gray-300">Automated keyboard/mouse control to run malicious commands</span></p>
                  <p><strong className="text-white">Attacker's Goal:</strong> <span className="text-gray-300">Bypass security restrictions by simulating human interaction</span></p>
                  <p><strong className="text-white">How it works:</strong> <span className="text-gray-300">Opens Notepad → Types malicious PowerShell → Hits Enter → Executes payload</span></p>
                  <p><strong className="text-white">Damage:</strong> <span className="text-yellow-300"> Execute code that might be blocked by security policies, evade detection</span></p>
                  <p><strong className="text-white">Sneaky trick:</strong> <span className="text-gray-300">Looks like a user typing on keyboard (harder to detect than direct commands)</span></p>
                </div>
              </div>

              {/* UAC Bypass */}
              <div className="vercel-card rounded-xl border-l-4 border-blue-500 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400">
                    HIGH
                  </span>
                  <h3 className="text-lg font-bold text-blue-400">T1548.002 - UAC Bypass (Privilege Escalation)</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <p><strong className="text-white">What it is:</strong> <span className="text-gray-300">Trick to disable Windows' "Do you want to allow this app?" popup</span></p>
                  <p><strong className="text-white">Attacker's Goal:</strong> <span className="text-gray-300">Get admin privileges without you noticing</span></p>
                  <p><strong className="text-white">How it works:</strong> <span className="text-gray-300">Exploits Windows registry (App Paths) to run programs with elevated rights silently</span></p>
                  <p><strong className="text-white">Damage:</strong> <span className="text-blue-300"> Gain admin access → Install rootkits, disable antivirus, control the entire system</span></p>
                  <p><strong className="text-white">Why it matters:</strong> <span className="text-gray-300">Turns a normal user account into an admin without your permission</span></p>
                </div>
              </div>

              {/* Obfuscation */}
              <div className="vercel-card rounded-xl border-l-4 border-green-500 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">
                    MEDIUM
                  </span>
                  <h3 className="text-lg font-bold text-green-400">T1027 - Code Obfuscation (Hiding Malicious Code)</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <p><strong className="text-white">What it is:</strong> <span className="text-gray-300">Disguising malicious commands so they look like gibberish</span></p>
                  <p><strong className="text-white">Attacker's Goal:</strong> <span className="text-gray-300">Evade antivirus and detection systems</span></p>
                  <p><strong className="text-white">How it works:</strong> <span className="text-gray-300">Base64 encoding, string reversal, variable substitution, random spaces/characters</span></p>
                  <p><strong className="text-white">Example:</strong> <span className="font-mono text-gray-300">mimikatz → bWltaWthdHo= (base64) → Looks harmless to antivirus</span></p>
                  <p><strong className="text-white">Damage:</strong> <span className="text-green-300"> Makes malware invisible to basic detection tools, prolongs attacker dwell time</span></p>
                </div>
              </div>

              {/* Process Injection */}
              <div className="vercel-card rounded-xl border-l-4 border-pink-500 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded-full bg-pink-500/10 px-3 py-1 text-xs font-bold text-pink-400">
                    HIGH
                  </span>
                  <h3 className="text-lg font-bold text-pink-400">T1055 - Process Injection (Hiding in Legitimate Programs)</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <p><strong className="text-white">What it is:</strong> <span className="text-gray-300">Injecting malicious code into normal Windows programs (explorer.exe, svchost.exe)</span></p>
                  <p><strong className="text-white">Attacker's Goal:</strong> <span className="text-gray-300">Hide malware inside trusted processes so it looks legitimate</span></p>
                  <p><strong className="text-white">How it works:</strong> <span className="text-gray-300">Uses Windows APIs (VirtualAlloc, WriteProcessMemory) to inject code into running processes</span></p>
                  <p><strong className="text-white">Damage:</strong> <span className="text-pink-300"> Stealth execution, bypasses application whitelisting, evades endpoint detection</span></p>
                  <p><strong className="text-white">Real example:</strong> <span className="text-gray-300">Malware runs inside chrome.exe so firewall thinks it's just your browser</span></p>
                </div>
              </div>

              {/* Persistence */}
              <div className="vercel-card rounded-xl border-l-4 border-indigo-500 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-400">
                    MEDIUM
                  </span>
                  <h3 className="text-lg font-bold text-indigo-400">T1547.001 - Registry Persistence (Staying on Your System)</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <p><strong className="text-white">What it is:</strong> <span className="text-gray-300">Creating "autorun" entries so malware survives restarts</span></p>
                  <p><strong className="text-white">Attacker's Goal:</strong> <span className="text-gray-300">Maintain access even after computer reboots or updates</span></p>
                  <p><strong className="text-white">How it works:</strong> <span className="text-gray-300">Modifies Windows registry keys (Run, RunOnce) or startup folders to auto-launch malware</span></p>
                  <p><strong className="text-white">Damage:</strong> <span className="text-indigo-300">♾️ Persistent backdoor access, can reinstall malware even if you delete it</span></p>
                  <p><strong className="text-white">Common locations:</strong> <span className="text-gray-300">HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run</span></p>
                </div>
              </div>

              {/* Ransomware Behavior */}
              <div className="vercel-card rounded-xl border-l-4 border-red-600 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded-full bg-red-600/10 px-3 py-1 text-xs font-bold text-red-500">
                    CRITICAL
                  </span>
                  <h3 className="text-lg font-bold text-red-500">T1490 - Inhibit System Recovery (Ransomware Prep)</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <p><strong className="text-white">What it is:</strong> <span className="text-gray-300">Deleting backups and recovery options before encrypting your files</span></p>
                  <p><strong className="text-white">Attacker's Goal:</strong> <span className="text-gray-300">Force you to pay ransom by making data recovery impossible</span></p>
                  <p><strong className="text-white">How it works:</strong> <span className="text-gray-300">Deletes Shadow Copies (vssadmin delete), disables Windows recovery, removes backups</span></p>
                  <p><strong className="text-white">Damage:</strong> <span className="text-red-400"> No way to restore files → Pay ransom or lose everything (avg ransom: $200K+)</span></p>
                  <p><strong className="text-white">Commands used:</strong> <span className="font-mono text-gray-300">vssadmin.exe Delete Shadows /All /Quiet</span></p>
                </div>
              </div>

              {/* C2 Communication */}
              <div className="vercel-card rounded-xl border-l-4 border-cyan-500 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400">
                    HIGH
                  </span>
                  <h3 className="text-lg font-bold text-cyan-400">T1071.001 - Command & Control (C2) Communication</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <p><strong className="text-white">What it is:</strong> <span className="text-gray-300">Malware "calling home" to attacker's server for instructions</span></p>
                  <p><strong className="text-white">Attacker's Goal:</strong> <span className="text-gray-300">Remote control of infected machine, receive new commands, exfiltrate data</span></p>
                  <p><strong className="text-white">How it works:</strong> <span className="text-gray-300">Uses HTTP/HTTPS to blend in with normal web traffic, connects to attacker's server</span></p>
                  <p><strong className="text-white">Damage:</strong> <span className="text-cyan-300">📡 Ongoing control, steal data gradually, deploy additional tools, coordinate multi-machine attacks</span></p>
                  <p><strong className="text-white">Why it's scary:</strong> <span className="text-gray-300">Attacker can remotely control your computer from anywhere in the world</span></p>
                </div>
              </div>
            </div>

            {/* Attack Chain Summary */}
            <div className="vercel-card mt-8 rounded-xl border-2 border-gray-700 p-6">
              <h3 className="mb-4 text-lg font-bold text-white">🔗 Typical Attack Chain (How These Connect)</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <p className="flex items-start gap-2">
                  <span className="text-red-400">1.</span>
                  <span><strong className="text-white">Initial Access:</strong> Phishing email with malicious PowerShell (T1059.001)</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-orange-400">2.</span>
                  <span><strong className="text-white">Privilege Escalation:</strong> UAC Bypass to get admin rights (T1548.002)</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-purple-400">3.</span>
                  <span><strong className="text-white">Discovery:</strong> Run BloodHound to map network (T1087.002)</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-red-400">4.</span>
                  <span><strong className="text-white">Credential Theft:</strong> Use Mimikatz to dump passwords (T1003.001)</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-indigo-400">5.</span>
                  <span><strong className="text-white">Persistence:</strong> Create registry autorun keys (T1547.001)</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-cyan-400">6.</span>
                  <span><strong className="text-white">Command & Control:</strong> Establish C2 connection (T1071.001)</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-red-600">7.</span>
                  <span><strong className="text-white">Impact:</strong> Delete backups → Deploy ransomware (T1490)</span>
                </p>
              </div>
            </div>
          </section>

          {/* Footer Note */}
          <section className="vercel-card rounded-xl p-6 text-center">
            <p className="text-sm text-gray-400">
              by {" "}
              <a
                href="https://github.com/kishore110804"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:underline"
              >
                Kishore - Aakaash -Shambhavi
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
