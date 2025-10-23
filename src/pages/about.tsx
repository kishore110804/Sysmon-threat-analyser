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
                    <strong className="text-base">T1059.001 - PowerShell:</strong>{" "}
                    <span className="text-sm text-gray-400">
                      Detection of malicious PowerShell usage including encoded commands, download cradles,
                      and execution policy bypasses
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
                    <strong className="text-base">T1071 - Application Layer Protocol:</strong>{" "}
                    <span className="text-sm text-gray-400">
                      Detection of suspicious network connections and web-based command and control
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-gray-500">▸</span>
                  <div>
                    <strong className="text-base">Custom Rules:</strong>{" "}
                    <span className="text-sm text-gray-400">
                      Extensible rule engine supporting additional detection patterns
                    </span>
                  </div>
                </li>
              </ul>
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

          {/* Footer Note */}
          <section className="vercel-card rounded-xl p-6 text-center">
            <p className="text-sm text-gray-400">
              Built with ❤️ by{" "}
              <a
                href="https://github.com/kishore110804"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:underline"
              >
                kishore110804
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
