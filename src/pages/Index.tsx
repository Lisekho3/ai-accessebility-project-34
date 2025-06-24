
import React from 'react';
import { Header } from '@/components/Header';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { TranscriptionDisplay } from '@/components/TranscriptionDisplay';
import { AccessibilityControls } from '@/components/AccessibilityControls';
import { SessionManager } from '@/components/SessionManager';
import { ImageAnalysis } from '@/components/ImageAnalysis';
import { TextToSpeech } from '@/components/TextToSpeech';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useTranscription } from '@/hooks/useTranscription';

const Index = () => {
  const { settings, updateSettings, getThemeClasses } = useAccessibility();
  const { 
    transcription, 
    isRecording, 
    isProcessing,
    confidence,
    interimText,
    startRecording, 
    stopRecording, 
    clearTranscription,
    exportTranscription 
  } = useTranscription();

  const themeClasses = getThemeClasses();

  return (
    <div 
      className={`min-h-screen transition-all duration-300 ${themeClasses.background} ${themeClasses.text}`}
      style={{ 
        fontSize: `${settings.fontSize}px`,
        fontFamily: settings.fontFamily === 'default' ? undefined : settings.fontFamily
      }}
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
              highContrast={settings.highContrast || settings.colorTheme !== 'default'}
            />
            
            <TranscriptionDisplay
              transcription={transcription}
              isProcessing={isProcessing}
              highContrast={settings.highContrast || settings.colorTheme !== 'default'}
              fontSize={settings.fontSize}
              themeClasses={themeClasses}
              confidence={confidence}
              interimText={interimText}
              isRecording={isRecording}
            />

            <TextToSpeech
              highContrast={settings.highContrast || settings.colorTheme !== 'default'}
              fontSize={settings.fontSize}
              themeClasses={themeClasses}
            />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <AccessibilityControls
              settings={settings}
              onUpdateSettings={updateSettings}
              themeClasses={themeClasses}
            />
            
            <ImageAnalysis
              highContrast={settings.highContrast || settings.colorTheme !== 'default'}
              fontSize={settings.fontSize}
              themeClasses={themeClasses}
            />
            
            <SessionManager
              transcription={transcription}
              onClear={clearTranscription}
              onExport={exportTranscription}
              highContrast={settings.highContrast || settings.colorTheme !== 'default'}
              themeClasses={themeClasses}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
