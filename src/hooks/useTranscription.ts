
import { useState, useRef, useCallback } from 'react';

interface UseTranscriptionReturn {
  transcription: string;
  isRecording: boolean;
  isProcessing: boolean;
  confidence: number;
  interimText: string;
  startRecording: () => void;
  stopRecording: () => void;
  clearTranscription: () => void;
  exportTranscription: (format: 'txt' | 'pdf') => void;
}

export const useTranscription = (): UseTranscriptionReturn => {
  const [transcription, setTranscription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [interimText, setInterimText] = useState('');
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
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsRecording(true);
          setIsProcessing(false);
          setInterimText('');
        };

        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          let interim = '';

          for (let i = 0; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            const conf = event.results[i][0].confidence;
            
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
              setConfidence(conf || 0);
            } else {
              interim += transcript;
            }
          }

          setInterimText(interim);

          if (finalTranscript) {
            setTranscription(prev => prev + finalTranscript);
            setInterimText('');
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
          setIsProcessing(false);
          setInterimText('');
          
          if (event.error === 'not-allowed') {
            alert('Microphone access denied. Please allow microphone access and try again.');
          }
        };

        recognition.onend = () => {
          setIsRecording(false);
          setIsProcessing(false);
          setInterimText('');
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
    setInterimText('');
  }, []);

  const clearTranscription = useCallback(() => {
    setTranscription('');
    setInterimText('');
    setConfidence(0);
  }, []);

  const exportTranscription = useCallback((format: 'txt' | 'pdf') => {
    if (!transcription.trim()) return;

    const timestamp = new Date().toISOString().slice(0, 10);
    
    if (format === 'txt') {
      const blob = new Blob([transcription], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transcription-${timestamp}.txt`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      // Create a proper PDF export using browser's print functionality
      const printContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Voice Transcription - ${timestamp}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 40px; 
                line-height: 1.6; 
                color: #333;
              }
              .header { 
                border-bottom: 2px solid #333; 
                padding-bottom: 20px; 
                margin-bottom: 30px; 
              }
              .date { 
                color: #666; 
                font-size: 14px; 
              }
              .content { 
                white-space: pre-wrap; 
                font-size: 16px;
                line-height: 1.8;
              }
              @media print {
                body { margin: 20px; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Voice Transcription</h1>
              <div class="date">Generated on: ${new Date().toLocaleDateString()}</div>
            </div>
            <div class="content">${transcription.replace(/\n/g, '<br>')}</div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(() => window.close(), 1000);
              }
            </script>
          </body>
        </html>
      `;
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
      }
    }
  }, [transcription]);

  return {
    transcription,
    isRecording,
    isProcessing,
    confidence,
    interimText,
    startRecording,
    stopRecording,
    clearTranscription,
    exportTranscription,
  };
};
