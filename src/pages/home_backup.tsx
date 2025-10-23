import { useState, useCallback } from 'react';
import { Upload as UploadIcon, FileText, X, AlertTriangle, Info, CheckCircle, Download, FileJson, Activity, Shield, TrendingUp, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Detection {
  id: number;
  technique: string;
  name: string;
  tactic: string;
  severity: 'high' | 'medium' | 'low';
  count: number;
  description: string;
  indicators: string[];
}

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Mock analysis results with more data for visualizations
  const analysisResults = {
    fileName: 'sysmon_events.csv',
    totalEvents: 1247,
    analyzedAt: new Date().toISOString(),
    processingTime: '847ms',
    uniqueProcesses: 89,
    networkConnections: 34,
    fileModifications: 156,
    registryChanges: 67,
    detections: [
      {
        id: 1,
        technique: 'T1059.001',
        name: 'PowerShell',
        tactic: 'Execution',
        severity: 'high' as const,
        count: 8,
        description: 'Detected suspicious PowerShell execution with encoded commands',
        indicators: ['encoded_command', 'download_cradle', 'hidden_window', 'bypass_policy']
      },
      {
        id: 2,
        technique: 'T1071.001',
        name: 'Web Protocols',
        tactic: 'Command and Control',
        severity: 'medium' as const,
        count: 3,
        description: 'Suspicious network connections to external domains',
        indicators: ['external_connection', 'webclient_usage', 'uncommon_port']
      },
      {
        id: 3,
        technique: 'T1027',
        name: 'Obfuscated Files or Information',
        tactic: 'Defense Evasion',
        severity: 'medium' as const,
        count: 5,
        description: 'Base64 encoded content detected in command lines',
        indicators: ['base64_encoding', 'string_concatenation', 'invoke_expression']
      },
    ],
    severityBreakdown: {
      high: 8,
      medium: 8,
      low: 0
    },
    topTactics: [
      { name: 'Execution', count: 8 },
      { name: 'Defense Evasion', count: 5 },
      { name: 'Command and Control', count: 3 }
    ]
  };

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
    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleAnalyze = () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  const handleReset = () => {
    setFile(null);
    setShowResults(false);
    setIsAnalyzing(false);
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

            {!showResults ? (
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
                      <h3 className="text-xl sm:text-2xl font-semibold mb-2">Drop your Sysmon CSV here</h3>
                      <p className="text-sm sm:text-base text-gray-400 mb-8">or click to browse • Max 50MB</p>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload">
                        <Button asChild size="lg" className="cursor-pointer bg-white text-black hover:bg-gray-200 rounded-full text-sm font-medium">
                          <span>Select File</span>
                        </Button>
                      </label>
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
                      <Button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        size="lg"
                        className="bg-white text-black hover:bg-gray-200 rounded-full px-10 text-sm font-medium"
                      >
                        {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
                      </Button>
                    </>
                  )}
                </div>

                {/* Feature Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
              </>
            ) : (
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
                    className="border-white/10 hover:bg-white/5 text-sm self-start sm:self-auto"
                  >
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
                                <span className="text-xs text-gray-500">• {detection.tactic}</span>
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
                  <Button size="lg" className="bg-white text-black hover:bg-gray-200 rounded-full text-sm font-medium">
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 rounded-full text-sm font-medium">
                    <FileJson className="mr-2 h-4 w-4" />
                    Export JSON
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Mock analysis results
