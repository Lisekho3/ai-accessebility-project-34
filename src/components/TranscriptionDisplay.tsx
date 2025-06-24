
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Loader } from 'lucide-react';

interface TranscriptionDisplayProps {
  transcription: string;
  isProcessing: boolean;
  highContrast: boolean;
  fontSize: number;
}

export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
  transcription,
  isProcessing,
  highContrast,
  fontSize,
}) => {
  const cardClass = highContrast 
    ? 'bg-gray-900 border-gray-700 text-white' 
    : 'bg-white/80 backdrop-blur-sm border-gray-200';

  return (
    <Card className={`${cardClass} shadow-lg transition-all duration-300`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className={`w-5 h-5 ${
            highContrast ? 'text-green-400' : 'text-green-600'
          }`} />
          Live Transcription
          {isProcessing && (
            <Loader className="w-4 h-4 animate-spin text-blue-500" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 w-full rounded-md border p-4">
          <div 
            className={`whitespace-pre-wrap ${
              highContrast ? 'text-gray-100' : 'text-gray-800'
            }`}
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
          >
            {transcription || (
              <span className={`italic ${
                highContrast ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Transcription will appear here as you speak...
              </span>
            )}
          </div>
        </ScrollArea>
        
        {/* Word Count */}
        <div className={`mt-3 text-sm flex justify-between ${
          highContrast ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <span>
            Words: {transcription.trim().split(/\s+/).filter(Boolean).length}
          </span>
          <span>
            Characters: {transcription.length}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
