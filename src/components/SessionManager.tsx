
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Trash2, Save, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface SessionManagerProps {
  transcription: string;
  onClear: () => void;
  onExport: (format: 'txt' | 'pdf') => void;
  highContrast: boolean;
  themeClasses: any;
}

export const SessionManager: React.FC<SessionManagerProps> = ({
  transcription,
  onClear,
  onExport,
  highContrast,
  themeClasses
}) => {
  const handleClear = () => {
    if (transcription && window.confirm('Are you sure you want to clear the transcription?')) {
      onClear();
      toast.success('Transcription cleared');
    }
  };

  const handleExport = (format: 'txt' | 'pdf') => {
    if (!transcription.trim()) {
      toast.error('No transcription to export');
      return;
    }
    onExport(format);
    toast.success(`Exported as ${format.toUpperCase()}`);
  };

  return (
    <Card className={`${themeClasses.card} shadow-lg transition-all duration-300`}>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Save className={`w-5 h-5 ${
            highContrast ? 'text-purple-400' : 'text-purple-600'
          }`} />
          <h3 className="text-xl font-semibold">Session Manager</h3>
        </div>

        <div className="space-y-4">
          {/* Session Info */}
          <div className={`p-3 rounded-lg ${
            highContrast ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            <div className="flex items-center justify-between text-sm">
              <span>Current Session</span>
              <span className={`px-2 py-1 rounded ${
                transcription 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {transcription ? 'Active' : 'Empty'}
              </span>
            </div>
            {transcription && (
              <div className={`mt-2 text-xs ${
                highContrast ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <p>Words: {transcription.trim().split(/\s+/).filter(Boolean).length}</p>
                <p>Started: {new Date().toLocaleTimeString()}</p>
              </div>
            )}
          </div>

          {/* Export Options */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Export Options</h4>
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('txt')}
                disabled={!transcription.trim()}
                className={`flex items-center gap-2 ${
                  highContrast ? 'border-gray-600 hover:bg-gray-800' : ''
                }`}
              >
                <FileText className="w-4 h-4" />
                Export as TXT
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('pdf')}
                disabled={!transcription.trim()}
                className={`flex items-center gap-2 ${
                  highContrast ? 'border-gray-600 hover:bg-gray-800' : ''
                }`}
              >
                <Download className="w-4 h-4" />
                Export as PDF
              </Button>
            </div>
          </div>

          {/* Session Actions */}
          <div className="border-t pt-4 space-y-2">
            <h4 className="font-medium text-sm">Session Actions</h4>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClear}
              disabled={!transcription.trim()}
              className="w-full flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear Session
            </Button>
          </div>

          {/* Tips */}
          <div className={`p-3 rounded-lg border ${
            highContrast 
              ? 'border-gray-600 bg-gray-800' 
              : 'border-blue-200 bg-blue-50'
          }`}>
            <h4 className={`font-medium text-sm mb-2 ${
              highContrast ? 'text-blue-400' : 'text-blue-700'
            }`}>
              💡 Pro Tips
            </h4>
            <ul className={`text-xs space-y-1 ${
              highContrast ? 'text-gray-300' : 'text-blue-600'
            }`}>
              <li>• Speak clearly for better accuracy</li>
              <li>• Export regularly to save your work</li>
              <li>• Use punctuation commands like "period" or "comma"</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};
