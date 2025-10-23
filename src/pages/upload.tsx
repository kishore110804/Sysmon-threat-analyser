import { useState, useCallback } from 'react';
import { Upload as UploadIcon, FileText, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Upload() {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

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
      setUploadStatus('idle');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploadStatus('uploading');
    
    // TODO: Implement actual upload and analysis
    setTimeout(() => {
      setUploadStatus('success');
      setTimeout(() => navigate('/analysis'), 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen">
      <div className="container px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Upload Sysmon Logs</h1>
            <p className="text-lg text-muted-foreground">
              Drag and drop your CSV files or click to browse
            </p>
          </div>

          {/* Upload Area - Vercel Style */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200
              ${isDragging ? 'border-black bg-gray-50 dark:border-white dark:bg-gray-900' : 'border-gray-300 dark:border-gray-700'}
              ${file ? 'bg-gray-50 dark:bg-gray-900' : 'hover:border-gray-400 dark:hover:border-gray-600'}
            `}
          >
            {!file ? (
              <>
                <UploadIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">Choose a file or drag & drop it here</h3>
                <p className="text-muted-foreground mb-6">CSV format, up to 50MB</p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button asChild size="lg" className="cursor-pointer bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black rounded-full">
                    <span>Browse Files</span>
                  </Button>
                </label>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setFile(null);
                    setUploadStatus('idle');
                  }}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <FileText className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{file.name}</h3>
                <p className="text-muted-foreground mb-6">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
                <Button
                  onClick={handleUpload}
                  disabled={uploadStatus === 'uploading'}
                  size="lg"
                  className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black rounded-full"
                >
                  {uploadStatus === 'uploading' ? 'Analyzing...' : 'Start Analysis'}
                </Button>
              </>
            )}
          </div>

          {/* Status Messages */}
          {uploadStatus === 'success' && (
            <div className="mt-6 p-4 border rounded-lg bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900 flex items-center">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
              <div>
                <p className="font-medium">Analysis Complete!</p>
                <p className="text-sm text-muted-foreground">Redirecting to results...</p>
              </div>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="mt-6 p-4 border rounded-lg bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3" />
              <div>
                <p className="font-medium">Upload Failed</p>
                <p className="text-sm text-muted-foreground">Please check your file and try again</p>
              </div>
            </div>
          )}

          {/* File Requirements */}
          <div className="mt-12 p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Requirements</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ CSV format from Sysmon event logs</li>
              <li>✓ Standard fields: RecordId, EventID, Message</li>
              <li>✓ Maximum file size: 50 MB</li>
              <li>✓ Event IDs: 1, 3, 7, 10, 11, 13, 15, 22</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
