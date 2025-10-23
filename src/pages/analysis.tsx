import { AlertTriangle, CheckCircle, Info, Download, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Analysis() {
  // TODO: Fetch actual analysis data
  const mockData = {
    fileName: 'sysmon_events.csv',
    totalEvents: 1247,
    analyzedAt: new Date().toISOString(),
    detections: [
      {
        id: 1,
        technique: 'T1059.001',
        name: 'PowerShell',
        tactic: 'Execution',
        severity: 'high',
        count: 8,
        description: 'Detected suspicious PowerShell execution with encoded commands',
        indicators: ['encoded_command', 'download_cradle', 'hidden_window']
      },
      {
        id: 2,
        technique: 'T1071.001',
        name: 'Web Protocols',
        tactic: 'Command and Control',
        severity: 'medium',
        count: 3,
        description: 'Suspicious network connections to external domains',
        indicators: ['external_connection', 'webclient_usage']
      },
      {
        id: 3,
        technique: 'T1027',
        name: 'Obfuscated Files or Information',
        tactic: 'Defense Evasion',
        severity: 'medium',
        count: 5,
        description: 'Base64 encoded content detected in command lines',
        indicators: ['base64_encoding', 'string_concatenation']
      },
    ]
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'high': 
        return {
          border: 'border-red-200 dark:border-red-900',
          bg: 'bg-red-50 dark:bg-red-950',
          badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        };
      case 'medium': 
        return {
          border: 'border-yellow-200 dark:border-yellow-900',
          bg: 'bg-yellow-50 dark:bg-yellow-950',
          badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        };
      case 'low': 
        return {
          border: 'border-blue-200 dark:border-blue-900',
          bg: 'bg-blue-50 dark:bg-blue-950',
          badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
        };
      default: 
        return {
          border: 'border-gray-200 dark:border-gray-800',
          bg: 'bg-gray-50 dark:bg-gray-950',
          badge: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        };
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'medium': return <Info className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case 'low': return <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Analysis Results</h1>
            <p className="text-lg text-muted-foreground">
              {mockData.fileName} • {new Date(mockData.analyzedAt).toLocaleString()}
            </p>
          </div>

          {/* Summary Stats - Vercel Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 border rounded-lg bg-white dark:bg-black">
              <p className="text-sm text-muted-foreground mb-2">Total Events</p>
              <p className="text-4xl font-bold">{mockData.totalEvents.toLocaleString()}</p>
            </div>
            <div className="p-6 border rounded-lg bg-white dark:bg-black">
              <p className="text-sm text-muted-foreground mb-2">Techniques Detected</p>
              <p className="text-4xl font-bold">{mockData.detections.length}</p>
            </div>
            <div className="p-6 border rounded-lg bg-white dark:bg-black">
              <p className="text-sm text-muted-foreground mb-2">Total Alerts</p>
              <p className="text-4xl font-bold">
                {mockData.detections.reduce((sum, d) => sum + d.count, 0)}
              </p>
            </div>
          </div>

          {/* Detections */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Detected Techniques</h2>
            <div className="space-y-4">
              {mockData.detections.map((detection) => {
                const styles = getSeverityStyles(detection.severity);
                return (
                  <div
                    key={detection.id}
                    className={`border rounded-lg p-6 ${styles.border} ${styles.bg}`}
                  >
                    <div className="flex items-start gap-4">
                      {getSeverityIcon(detection.severity)}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold">{detection.name}</h3>
                          <span className="px-2 py-1 bg-black dark:bg-white text-white dark:text-black rounded text-xs font-mono">
                            {detection.technique}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${styles.badge}`}>
                            {detection.severity}
                          </span>
                          <span className="text-sm text-muted-foreground">{detection.tactic}</span>
                        </div>
                        <p className="text-muted-foreground mb-3">{detection.description}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {detection.indicators.map((indicator, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-900 rounded text-xs">
                              {indicator}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold text-foreground">{detection.count}</span> matching events
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black rounded-full">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
            <Button size="lg" variant="outline" className="rounded-full border-2">
              <FileJson className="mr-2 h-4 w-4" />
              Export JSON
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
