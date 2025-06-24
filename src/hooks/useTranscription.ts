
import { useState, useRef, useCallback } from 'react';

interface UseTranscriptionReturn {
  transcription: string;
  isRecording: boolean;
  isProcessing: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  clearTranscription: () => void;
  exportTranscription: (format: 'txt' | 'pdf') => void;
}

export const useTranscription = (): UseTranscriptionReturn => {
  const [transcription, setTranscription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);

  const startRecording = useCallback(async () => {
    try {
      // Check if browser supports Web Speech API
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsRecording(true);
          setIsProcessing(false);
        };

        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = 0; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          setTranscription(prev => {
            const lines = prev.split('\n');
            if (interimTranscript) {
              // Update the last line with interim results
              lines[lines.length - 1] = finalTranscript + interimTranscript;
            } else if (finalTranscript) {
              // Add final transcript
              if (lines[lines.length - 1] === '') {
                lines[lines.length - 1] = finalTranscript.trim();
              } else {
                lines[lines.length - 1] += finalTranscript.trim();
              }
            }
            return lines.join('\n');
          });
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
          setIsProcessing(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
          setIsProcessing(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } else {
        // Fallback for browsers without Web Speech API
        console.warn('Web Speech API not supported, using fallback');
        setIsRecording(true);
        
        // Simulate transcription for demo purposes
        setTimeout(() => {
          setTranscription(prev => prev + 'Demo transcription text... ');
          setIsRecording(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
      setIsProcessing(false);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    setIsProcessing(false);
  }, []);

  const clearTranscription = useCallback(() => {
    setTranscription('');
  }, []);

  const exportTranscription = useCallback((format: 'txt' | 'pdf') => {
    if (!transcription.trim()) return;

    if (format === 'txt') {
      const blob = new Blob([transcription], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transcription-${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      // For PDF export, we'll create a simple HTML-to-PDF solution
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Transcription</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
                h1 { color: #333; }
                .content { white-space: pre-wrap; }
              </style>
            </head>
            <body>
              <h1>Voice Transcription</h1>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              <div class="content">${transcription}</div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  }, [transcription]);

  return {
    transcription,
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
    clearTranscription,
    exportTranscription,
  };
};
