
import React, { useEffect, useState } from 'react';
import { Mic, MicOff, Square, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface VoiceRecorderProps {
  isRecording: boolean;
  isProcessing: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  highContrast: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isRecording,
  isProcessing,
  onStartRecording,
  onStopRecording,
  highContrast
}) => {
  const [audioLevel, setAudioLevel] = useState(0);

  // Simulate audio level animation
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 150);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [isRecording]);

  const cardClass = highContrast 
    ? 'bg-gray-900 border-gray-700 text-white' 
    : 'bg-white/80 backdrop-blur-sm border-gray-200';

  return (
    <Card className={`p-8 ${cardClass} shadow-lg transition-all duration-300 hover:shadow-xl`}>
      <div className="text-center">
        <div className="relative inline-block mb-6">
          {/* Audio visualization rings */}
          {isRecording && (
            <>
              <div 
                className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping"
                style={{ transform: `scale(${1 + audioLevel / 200})` }}
              />
              <div 
                className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping"
                style={{ 
                  transform: `scale(${1.2 + audioLevel / 150})`,
                  animationDelay: '0.2s'
                }}
              />
            </>
          )}
          
          <Button
            onClick={isRecording ? onStopRecording : onStartRecording}
            disabled={isProcessing}
            size="lg"
            className={`w-20 h-20 rounded-full transition-all duration-300 ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : highContrast
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
            } shadow-lg hover:shadow-xl transform hover:scale-105`}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          >
            {isProcessing ? (
              <Loader className="w-8 h-8 animate-spin" />
            ) : isRecording ? (
              <Square className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </Button>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">
            {isRecording ? 'Recording...' : 'Ready to Record'}
          </h2>
          
          <p className={`text-lg ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
            {isRecording 
              ? 'Speak clearly and I\'ll transcribe your words in real-time'
              : 'Click the microphone to start voice recording'
            }
          </p>

          {isRecording && (
            <div className="mt-4">
              <div className={`w-full h-2 rounded-full overflow-hidden ${
                highContrast ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-150"
                  style={{ width: `${audioLevel}%` }}
                />
              </div>
              <p className={`text-sm mt-2 ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                Audio Level: {Math.round(audioLevel)}%
              </p>
            </div>
          )}
        </div>

        {/* Keyboard shortcuts hint */}
        <div className={`mt-6 p-3 rounded-lg ${
          highContrast ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
            <kbd className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs">Space</kbd> 
            {' '}to start/stop recording
          </p>
        </div>
      </div>
    </Card>
  );
};
