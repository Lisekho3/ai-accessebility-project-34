
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Loader } from 'lucide-react';

interface TranscriptionDisplayProps {
  transcription: string;
  isProcessing: boolean;
  highContrast: boolean;
  fontSize: number;
  themeClasses: any;
}

export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
  transcription,
  isProcessing,
  highContrast,
  fontSize,
  themeClasses,
}) => {
  return (
    <Card className={`${themeClasses.card} shadow-lg transition-all duration-300`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-green-600" />
          Live Transcription
          {isProcessing && (
            <Loader className="w-4 h-4 animate-spin text-blue-500" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 w-full rounded-md border p-4">
          <div 
            className={`whitespace-pre-wrap ${themeClasses.cardText}`}
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
          >
            {transcription || (
              <span className="italic opacity-60">
                Transcription will appear here as you speak...
              </span>
            )}
          </div>
        </ScrollArea>
        
        <div className={`mt-3 text-sm flex justify-between opacity-70`}>
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
