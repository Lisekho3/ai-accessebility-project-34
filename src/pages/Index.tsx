
import React from 'react';
import { Header } from '@/components/Header';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { TranscriptionDisplay } from '@/components/TranscriptionDisplay';
import { AccessibilityControls } from '@/components/AccessibilityControls';
import { SessionManager } from '@/components/SessionManager';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useTranscription } from '@/hooks/useTranscription';

const Index = () => {
  const { settings, updateSettings } = useAccessibility();
  const { 
    transcription, 
    isRecording, 
    isProcessing,
    startRecording, 
    stopRecording, 
    clearTranscription,
    exportTranscription 
  } = useTranscription();

  return (
    <div 
      className={`min-h-screen transition-all duration-300 ${
        settings.highContrast 
          ? 'bg-black text-white' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}
      style={{ fontSize: `${settings.fontSize}px` }}
    >
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <VoiceRecorder
              isRecording={isRecording}
              isProcessing={isProcessing}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              highContrast={settings.highContrast}
            />
            
            <TranscriptionDisplay
              transcription={transcription}
              isProcessing={isProcessing}
              highContrast={settings.highContrast}
              fontSize={settings.fontSize}
            />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <AccessibilityControls
              settings={settings}
              onUpdateSettings={updateSettings}
            />
            
            <SessionManager
              transcription={transcription}
              onClear={clearTranscription}
              onExport={exportTranscription}
              highContrast={settings.highContrast}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
