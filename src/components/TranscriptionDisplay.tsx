
import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Loader, FileText } from 'lucide-react';

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
  fontSize
}) => {
  const textRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new text is added
  useEffect(() => {
    if (textRef.current) {
      textRef.current.scrollTop = textRef.current.scrollHeight;
    }
  }, [transcription]);

  const cardClass = highContrast 
    ? 'bg-gray-900 border-gray-700 text-white' 
    : 'bg-white/80 backdrop-blur-sm border-gray-200';

  return (
    <Card className={`${cardClass} shadow-lg transition-all duration-300`}>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className={`w-5 h-5 ${highContrast ? 'text-blue-400' : 'text-blue-600'}`} />
          <h3 className="text-xl font-semibold">Live Transcription</h3>
          {isProcessing && (
            <Loader className="w-4 h-4 animate-spin text-blue-500" />
          )}
        </div>

        <div 
          ref={textRef}
          className={`min-h-[300px] max-h-[500px] overflow-y-auto p-4 rounded-lg border-2 border-dashed transition-all duration-300 ${
            highContrast 
              ? 'border-gray-600 bg-gray-800' 
              : 'border-gray-300 bg-gray-50'
          } ${transcription ? 'border-solid' : ''}`}
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
        >
          {transcription ? (
            <div 
              className="space-y-2 animate-fade-in"
              role="log" 
              aria-live="polite" 
              aria-label="Live transcription output"
            >
              {transcription.split('\n').map((line, index) => (
                <p key={index} className="leading-relaxed">
                  {line || '\u00A0'}
                </p>
              ))}
            </div>
          ) : (
            <div className={`text-center py-16 ${
              highContrast ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Your transcription will appear here</p>
              <p className="text-sm mt-2">Start recording to see real-time text conversion</p>
            </div>
          )}

          {isProcessing && transcription && (
            <div className="flex items-center gap-2 mt-4 text-blue-500">
              <Loader className="w-4 h-4 animate-spin" />
              <span className="text-sm">Processing audio...</span>
            </div>
          )}
        </div>

        {transcription && (
          <div className={`mt-4 text-sm ${
            highContrast ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <p>Words: {transcription.trim().split(/\s+/).filter(Boolean).length}</p>
            <p>Characters: {transcription.length}</p>
          </div>
        )}
      </div>
    </Card>
  );
};
