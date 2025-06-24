
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Loader, Mic } from 'lucide-react';

interface TranscriptionDisplayProps {
  transcription: string;
  isProcessing: boolean;
  highContrast: boolean;
  fontSize: number;
  themeClasses: any;
  confidence?: number;
  interimText?: string;
  isRecording?: boolean;
}

export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
  transcription,
  isProcessing,
  highContrast,
  fontSize,
  themeClasses,
  confidence = 0,
  interimText = '',
  isRecording = false,
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
          {isRecording && (
            <Mic className="w-4 h-4 text-red-500 animate-pulse" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 w-full rounded-md border p-4">
          <div 
            className={`whitespace-pre-wrap ${themeClasses.cardText}`}
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
          >
            {transcription}
            {interimText && (
              <span className="text-gray-500 italic">
                {interimText}
              </span>
            )}
            {!transcription && !interimText && (
              <span className="italic opacity-60">
                Transcription will appear here as you speak...
              </span>
            )}
          </div>
        </ScrollArea>
        
        <div className={`mt-3 text-sm flex justify-between opacity-70`}>
          <div className="flex gap-4">
            <span>
              Words: {transcription.trim().split(/\s+/).filter(Boolean).length}
            </span>
            <span>
              Characters: {transcription.length}
            </span>
          </div>
          {confidence > 0 && (
            <span className={`px-2 py-1 rounded text-xs ${
              confidence > 0.8 
                ? 'bg-green-100 text-green-700' 
                : confidence > 0.6 
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}>
              Confidence: {Math.round(confidence * 100)}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
