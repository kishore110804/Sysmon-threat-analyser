import { useState, useCallback } from 'react';
import { Upload as UploadIcon, FileText, X, AlertTriangle, Info, CheckCircle, Download, FileJson, Activity, Shield, TrendingUp, BarChart3, Loader2, Sparkles, Code2, FileCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { analyzeSysmonFile, validateSysmonFile } from '@/lib/analyzer';
import { AnalysisResult } from '@/types/sysmon';
import { downloadSampleCSV } from '@/lib/sample-data-generator';

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showFormatGuide, setShowFormatGuide] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    const validExtensions = ['.csv', '.txt', '.log'];
    const hasValidExtension = validExtensions.some(ext => droppedFile?.name.toLowerCase().endsWith(ext));
    
    if (droppedFile && hasValidExtension) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Please drop a valid CSV, TXT, or LOG file');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    // Validate file
    const validation = validateSysmonFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setShowResults(false); // Ensure we're not showing results yet
    setAnalysisProgress('Starting analysis...');

    try {
      // Run real analysis
      const result = await analyzeSysmonFile(file, {
        onProgress: (stage, progress) => {
          setAnalysisProgress(`${stage} (${Math.round(progress)}%)`);
        },
      });

      console.log('Analysis complete! Results:', result);
      console.log('Total detections:', result.detections.length);
      console.log('Detections:', result.detections.map(d => ({
        id: d.id,
        name: d.name,
        technique: d.technique,
        tactic: d.tactic,
        severity: d.severity,
        count: d.count
      })));

      setAnalysisResults(result);
      setIsAnalyzing(false); // Stop analyzing before showing results
      setShowResults(true); // Now show results
      setAnalysisProgress('');
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
      setIsAnalyzing(false);
      setShowResults(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setShowResults(false);
    setIsAnalyzing(false);
    setAnalysisResults(null);
    setError(null);
    setAnalysisProgress('');
  };

  const handleDownloadReport = () => {
    if (!analysisResults) return;
    
    // Create a formatted text report
    let report = `SYSMON THREAT ANALYSIS REPORT\n`;
    report += `${'='.repeat(80)}\n\n`;
    report += `File: ${analysisResults.fileName}\n`;
    report += `Analysis Date: ${new Date(analysisResults.analyzedAt).toLocaleString()}\n`;
    report += `Processing Time: ${analysisResults.processingTime}\n\n`;
    
    report += `SUMMARY\n`;
    report += `${'-'.repeat(80)}\n`;
    report += `Total Events: ${analysisResults.totalEvents.toLocaleString()}\n`;
    report += `Threats Detected: ${analysisResults.detections.length}\n`;
    report += `Total Alerts: ${analysisResults.detections.reduce((sum, d) => sum + d.count, 0)}\n`;
    report += `Unique Processes: ${analysisResults.uniqueProcesses}\n`;
    report += `Network Connections: ${analysisResults.networkConnections}\n`;
    report += `File Modifications: ${analysisResults.fileModifications}\n`;
    report += `Registry Changes: ${analysisResults.registryChanges}\n\n`;
    
    report += `SEVERITY BREAKDOWN\n`;
    report += `${'-'.repeat(80)}\n`;
    report += `High: ${analysisResults.severityBreakdown.high}\n`;
    report += `Medium: ${analysisResults.severityBreakdown.medium}\n`;
    report += `Low: ${analysisResults.severityBreakdown.low}\n\n`;
    
    report += `TOP MITRE ATT&CK TACTICS\n`;
    report += `${'-'.repeat(80)}\n`;
    analysisResults.topTactics.forEach((tactic, index) => {
      report += `${index + 1}. ${tactic.name} (${tactic.count} detections)\n`;
    });
    report += `\n`;
    
    report += `THREAT DETECTIONS\n`;
    report += `${'-'.repeat(80)}\n\n`;
    analysisResults.detections.forEach((detection, index) => {
      report += `[${index + 1}] ${detection.name}\n`;
      report += `    MITRE ATT&CK: ${detection.technique}\n`;
      if (detection.mitre) {
        report += `    MITRE ID: ${detection.mitre.id} - ${detection.mitre.name}\n`;
      }
      report += `    Tactic: ${detection.tactic}\n`;
      report += `    Severity: ${detection.severity.toUpperCase()}\n`;
      report += `    Confidence: ${detection.confidence}%\n`;
      report += `    Occurrences: ${detection.count}\n`;
      report += `    Description: ${detection.description}\n`;
      report += `    Indicators: ${detection.indicators.join(', ')}\n`;
      report += `\n`;
    });
    
    report += `${'-'.repeat(80)}\n`;
    report += `End of Report\n`;
    
    // Create and download the file
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sysmon-analysis-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    if (!analysisResults) return;
    
    // Create JSON export
    const jsonData = JSON.stringify(analysisResults, null, 2);
    
    // Create and download the file
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sysmon-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'high': 
        return {
          border: 'border-red-500/20',
          bg: 'bg-red-500/5',
          badge: 'bg-red-500/10 text-red-400 border border-red-500/30',
          glow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]'
        };
      case 'medium': 
        return {
          border: 'border-yellow-500/20',
          bg: 'bg-yellow-500/5',
          badge: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
          glow: 'shadow-[0_0_15px_rgba(234,179,8,0.15)]'
        };
      case 'low': 
        return {
          border: 'border-blue-500/20',
          bg: 'bg-blue-500/5',
          badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
          glow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]'
        };
      default: 
        return {
          border: 'border-gray-500/20',
          bg: 'bg-gray-500/5',
          badge: 'bg-gray-500/10 text-gray-400',
          glow: ''
        };
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'medium': return <Info className="w-4 h-4 text-yellow-400" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-blue-400" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <div className="gradient-bg">
        <div className="container px-4 sm:px-6 py-12 sm:py-20">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-16 text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight">
                Sysmon Threat Analyzer
              </h1>
              <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
                Upload Sysmon logs and instantly detect threats mapped to MITRE ATT&CK
              </p>
            </div>

            {/* Show Loading State while analyzing */}
            {isAnalyzing ? (
              <div className="vercel-card rounded-2xl p-16 text-center">
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <Loader2 className="w-16 h-16 animate-spin text-blue-400" />
                    <div className="absolute inset-0 blur-xl bg-blue-400/30 animate-pulse"></div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Analyzing Your Data</h3>
                    <p className="text-gray-400">{analysisProgress || 'Processing...'}</p>
                  </div>
                  <div className="w-full max-w-md h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            ) : !showResults ? (
              <>
                {/* Upload Section */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                    vercel-card relative rounded-2xl p-12 sm:p-16 text-center transition-all duration-200 mb-12
                    ${isDragging ? 'border-white/20 bg-white/[0.08]' : ''}
                    ${file ? 'bg-white/[0.04]' : ''}
                  `}
                >
                  {!file ? (
                    <>
                      <UploadIcon className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-6 text-gray-500" />
                      <h3 className="text-xl sm:text-2xl font-semibold mb-2">Drop your Sysmon file here</h3>
                      <p className="text-sm sm:text-base text-gray-400 mb-2">CSV, TXT, or LOG format</p>
                      <p className="text-xs text-gray-500 mb-8">Max 50MB</p>
                      <input
                        type="file"
                        accept=".csv,.txt,.log"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload">
                        <Button asChild size="lg" className="cursor-pointer bg-white text-black hover:bg-gray-200 rounded-full text-sm font-medium">
                          <span>Select File</span>
                        </Button>
                      </label>
                      <p className="mt-6 text-sm text-gray-500">or</p>
                      <Button
                        onClick={downloadSampleCSV}
                        variant="outline"
                        size="sm"
                        className="mt-3 border-white/40 hover:border-white/60 hover:bg-white/20 bg-white/5 text-sm text-white font-medium shadow-lg transition-all"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Download Sample Data
                      </Button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleReset}
                        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <FileText className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-6 text-white" />
                      <h3 className="text-xl sm:text-2xl font-semibold mb-2">{file.name}</h3>
                      <p className="text-sm sm:text-base text-gray-400 mb-10">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                      {error && (
                        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                          <p className="text-sm text-red-400">{error}</p>
                        </div>
                      )}
                      <Button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        size="lg"
                        className="bg-white text-black hover:bg-gray-200 rounded-full px-10 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Start Analysis
                      </Button>
                    </>
                  )}
                </div>

                {/* Feature Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                  <div className="vercel-card p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <Activity className="w-5 h-5 text-blue-400" />
                      <h4 className="text-sm font-semibold">Instant Analysis</h4>
                    </div>
                    <p className="text-sm text-gray-400">Results in under 1 second</p>
                  </div>
                  <div className="vercel-card p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="w-5 h-5 text-purple-400" />
                      <h4 className="text-sm font-semibold">MITRE ATT&CK</h4>
                    </div>
                    <p className="text-sm text-gray-400">Mapped to official techniques</p>
                  </div>
                  <div className="vercel-card p-6 rounded-xl sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      <h4 className="text-sm font-semibold">Export Ready</h4>
                    </div>
                    <p className="text-sm text-gray-400">Download reports as PDF or JSON</p>
                  </div>
                </div>

                {/* Format Guide Section */}
                <div className="vercel-card rounded-xl p-6 sm:p-8">
                  <button 
                    onClick={() => setShowFormatGuide(!showFormatGuide)}
                    className="w-full flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <FileCode className="w-5 h-5 text-blue-400" />
                      <h3 className="text-lg font-semibold">Supported File Formats</h3>
                    </div>
                    <div className={`transform transition-transform ${showFormatGuide ? 'rotate-180' : ''}`}>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {showFormatGuide && (
                    <div className="mt-6 space-y-6">
                      {/* CSV Format */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-md">
                            <span className="text-xs font-mono text-green-400">CSV</span>
                          </div>
                          <h4 className="text-sm font-semibold">CSV Format (Recommended)</h4>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">
                          Export Sysmon logs using <code className="px-2 py-0.5 bg-white/5 rounded text-xs font-mono">wevtutil</code> or Event Viewer with headers:
                        </p>
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-4 overflow-x-auto">
                          <pre className="text-xs font-mono text-gray-300">
<span className="text-blue-400">TimeCreated</span>,<span className="text-blue-400">EventID</span>,<span className="text-blue-400">Computer</span>,<span className="text-blue-400">Image</span>,<span className="text-blue-400">CommandLine</span>,<span className="text-blue-400">User</span>,...{'\n'}
2024-11-08 10:23:45,1,DESKTOP-ABC,C:\Windows\System32\cmd.exe,cmd /c whoami,SYSTEM{'\n'}
2024-11-08 10:24:12,3,DESKTOP-ABC,C:\Windows\explorer.exe,"explorer.exe",User1
                          </pre>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          💡 Must include: TimeCreated, EventID, Computer, and at least one process field (Image/CommandLine)
                        </p>
                      </div>

                      {/* PowerShell Text Format */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-md">
                            <span className="text-xs font-mono text-purple-400">TXT/LOG</span>
                          </div>
                          <h4 className="text-sm font-semibold">PowerShell Get-WinEvent Format</h4>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">
                          Use PowerShell command to export logs:
                        </p>
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-4 overflow-x-auto mb-3">
                          <pre className="text-xs font-mono text-gray-300">
<span className="text-green-400">Get-WinEvent</span> -LogName <span className="text-yellow-400">"Microsoft-Windows-Sysmon/Operational"</span> | {'\n'}
  <span className="text-green-400">Select-Object</span> TimeCreated, Id, Message | {'\n'}
  <span className="text-green-400">Out-File</span> sysmon.txt
                          </pre>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">Expected output format:</p>
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-4 overflow-x-auto">
                          <pre className="text-xs font-mono text-gray-300">
<span className="text-blue-400">TimeCreated</span> : 11/8/2024 10:23:45 AM{'\n'}
<span className="text-blue-400">Id</span>          : 1{'\n'}
<span className="text-blue-400">Message</span>     : Process Create:{'\n'}
                RuleName: -{'\n'}
                UtcTime: 2024-11-08 10:23:45.123{'\n'}
                ProcessGuid: {'{'}abc123{'}'}{'\n'}
                ProcessId: 1234{'\n'}
                Image: C:\Windows\System32\cmd.exe{'\n'}
                CommandLine: cmd /c whoami{'\n'}
                User: NT AUTHORITY\SYSTEM
                          </pre>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          💡 Parser automatically extracts fields from Message content
                        </p>
                      </div>

                      {/* Quick Export Commands */}
                      <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <Code2 className="w-4 h-4 text-blue-400" />
                          Quick Export Commands
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-gray-400 mb-1">PowerShell (Text):</p>
                            <code className="block text-xs font-mono bg-[#0A0A0A] p-2 rounded text-gray-300 overflow-x-auto">
                              Get-WinEvent -LogName "Microsoft-Windows-Sysmon/Operational" -MaxEvents 1000 | Out-File sysmon.txt
                            </code>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Event Viewer (CSV):</p>
                            <code className="block text-xs font-mono bg-[#0A0A0A] p-2 rounded text-gray-300 overflow-x-auto">
                              Event Viewer → Sysmon Logs → Save All Events As... → CSV Format
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : analysisResults ? (
              <>
                {/* Results Header */}
                <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2">Analysis Complete</h2>
                    <p className="text-sm text-gray-400">
                      {analysisResults.fileName} • {analysisResults.processingTime} • {new Date(analysisResults.analyzedAt).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="lg"
                    className="border-white/40 hover:border-white/60 hover:bg-white/20 bg-white/5 rounded-full text-sm font-medium self-start sm:self-auto text-white shadow-lg transition-all"
                  >
                    <UploadIcon className="mr-2 h-4 w-4" />
                    New Analysis
                  </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
                  <div className="vercel-card p-5 sm:p-6 rounded-xl relative overflow-hidden group">
                    <div className="shimmer absolute inset-0 pointer-events-none"></div>
                    <p className="text-xs sm:text-sm text-gray-400 mb-2 font-medium">Total Events</p>
                    <p className="text-3xl sm:text-4xl font-bold tabular-nums">{analysisResults.totalEvents.toLocaleString()}</p>
                  </div>
                  <div className="vercel-card p-5 sm:p-6 rounded-xl relative overflow-hidden group">
                    <div className="shimmer absolute inset-0 pointer-events-none"></div>
                    <p className="text-xs sm:text-sm text-gray-400 mb-2 font-medium">Threats Detected</p>
                    <p className="text-3xl sm:text-4xl font-bold text-red-400 tabular-nums">{analysisResults.detections.length}</p>
                  </div>
                  <div className="vercel-card p-5 sm:p-6 rounded-xl relative overflow-hidden group">
                    <div className="shimmer absolute inset-0 pointer-events-none"></div>
                    <p className="text-xs sm:text-sm text-gray-400 mb-2 font-medium">Total Alerts</p>
                    <p className="text-3xl sm:text-4xl font-bold tabular-nums">
                      {analysisResults.detections.reduce((sum, d) => sum + d.count, 0)}
                    </p>
                  </div>
                  <div className="vercel-card p-5 sm:p-6 rounded-xl relative overflow-hidden group">
                    <div className="shimmer absolute inset-0 pointer-events-none"></div>
                    <p className="text-xs sm:text-sm text-gray-400 mb-2 font-medium">Unique Processes</p>
                    <p className="text-3xl sm:text-4xl font-bold tabular-nums">{analysisResults.uniqueProcesses}</p>
                  </div>
                </div>

                {/* Severity & Tactics Charts */}
                <div className="grid lg:grid-cols-2 gap-6 mb-12">
                  {/* Severity Breakdown */}
                  <div className="vercel-card p-6 sm:p-8 rounded-xl">
                    <div className="flex items-center gap-2 mb-6">
                      <BarChart3 className="w-5 h-5 text-gray-400" />
                      <h3 className="text-lg font-semibold">Severity Distribution</h3>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-300">High</span>
                          <span className="text-sm font-mono text-gray-400">{analysisResults.severityBreakdown.high}</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-1000" 
                            style={{ width: `${(analysisResults.severityBreakdown.high / 16) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-300">Medium</span>
                          <span className="text-sm font-mono text-gray-400">{analysisResults.severityBreakdown.medium}</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all duration-1000" 
                            style={{ width: `${(analysisResults.severityBreakdown.medium / 16) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-300">Low</span>
                          <span className="text-sm font-mono text-gray-400">{analysisResults.severityBreakdown.low}</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-1000" 
                            style={{ width: `${(analysisResults.severityBreakdown.low / 16) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Top Tactics */}
                  <div className="vercel-card p-6 sm:p-8 rounded-xl">
                    <div className="flex items-center gap-2 mb-6">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <h3 className="text-lg font-semibold">Top Tactics</h3>
                    </div>
                    <div className="space-y-5">
                      {analysisResults.topTactics.map((tactic, idx) => (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-300">{tactic.name}</span>
                            <span className="text-sm font-mono text-gray-400">{tactic.count}</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-blue-400 rounded-full transition-all duration-1000" 
                              style={{ width: `${(tactic.count / 8) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Detections */}
                <div className="mb-12">
                  <h3 className="text-xl sm:text-2xl font-bold mb-6">Detected Techniques</h3>
                  <div className="space-y-4">
                    {analysisResults.detections.map((detection) => {
                      const styles = getSeverityStyles(detection.severity);
                      return (
                        <div
                          key={detection.id}
                          className={`vercel-card border rounded-xl p-5 sm:p-6 ${styles.border} ${styles.bg} ${styles.glow}`}
                        >
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="mt-0.5">
                              {getSeverityIcon(detection.severity)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                <h4 className="text-base sm:text-lg font-semibold">{detection.name}</h4>
                                <span className="px-2.5 py-0.5 bg-white/10 rounded-full text-xs font-mono">
                                  {detection.technique}
                                </span>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${styles.badge}`}>
                                  {detection.severity}
                                </span>
                                <span className="text-xs text-gray-500">â€¢ {detection.tactic}</span>
                              </div>
                              <p className="text-sm text-gray-300 mb-4">{detection.description}</p>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {detection.indicators.map((indicator, idx) => (
                                  <span key={idx} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-xs font-mono">
                                    {indicator}
                                  </span>
                                ))}
                              </div>
                              <p className="text-xs sm:text-sm text-gray-400">
                                <span className="font-semibold text-white tabular-nums">{detection.count}</span> matching events
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Export Actions */}
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <Button 
                    onClick={handleDownloadReport}
                    size="lg" 
                    className="bg-white text-black hover:bg-gray-100 hover:scale-105 rounded-full text-sm font-medium shadow-lg transition-all"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </Button>
                  <Button 
                    onClick={handleExportJSON}
                    size="lg" 
                    variant="outline" 
                    className="border-white/40 hover:border-white/60 hover:bg-white/20 bg-white/5 rounded-full text-sm font-medium text-white shadow-lg transition-all"
                  >
                    <FileJson className="mr-2 h-4 w-4" />
                    Export JSON
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
