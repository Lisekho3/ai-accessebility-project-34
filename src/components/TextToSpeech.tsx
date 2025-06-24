
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Play, Pause, Square, Volume2, Settings } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { toast } from 'sonner';

interface TextToSpeechProps {
  highContrast: boolean;
  fontSize: number;
  themeClasses: any;
}

export const TextToSpeech: React.FC<TextToSpeechProps> = ({
  highContrast,
  fontSize,
  themeClasses,
}) => {
  const [text, setText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  
  const {
    voices,
    selectedVoice,
    isSpeaking,
    rate,
    pitch,
    volume,
    speak,
    stop,
    pause,
    resume,
    setSelectedVoice,
    setRate,
    setPitch,
    setVolume,
  } = useTextToSpeech();

  const handleSpeak = () => {
    if (!text.trim()) {
      toast.error('Please enter some text to speak');
      return;
    }
    speak(text);
    toast.success('Speaking text...');
  };

  const handleStop = () => {
    stop();
    toast.success('Speech stopped');
  };

  const sampleTexts = [
    "Hello, this is a test of the text-to-speech functionality.",
    "The weather today is beautiful with clear skies.",
    "Welcome to our accessibility-focused voice application.",
  ];

  return (
    <Card className={`${themeClasses.card} shadow-lg transition-all duration-300`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className={`w-5 h-5 ${
            highContrast ? 'text-green-400' : 'text-green-600'
          }`} />
          Text to Speech
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Text Input */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Enter text to speak:</Label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your text here..."
            className="min-h-24 resize-none"
            style={{ fontSize: `${fontSize}px` }}
          />
          <div className={`text-xs ${themeClasses.cardText} opacity-70`}>
            Characters: {text.length} | Words: {text.trim().split(/\s+/).filter(Boolean).length}
          </div>
        </div>

        {/* Quick Sample Texts */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Quick samples:</Label>
          <div className="flex flex-wrap gap-2">
            {sampleTexts.map((sample, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setText(sample)}
                className="text-xs"
              >
                Sample {index + 1}
              </Button>
            ))}
          </div>
        </div>

        {/* Voice Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Voice:</Label>
          <Select value={selectedVoice} onValueChange={setSelectedVoice}>
            <SelectTrigger>
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              {voices.map((voice) => (
                <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                  {voice.name} ({voice.lang})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleSpeak}
            disabled={isSpeaking || !text.trim()}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Speak
          </Button>
          
          <Button
            onClick={isSpeaking ? pause : resume}
            disabled={!isSpeaking}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Pause className="w-4 h-4" />
            {isSpeaking ? 'Pause' : 'Resume'}
          </Button>
          
          <Button
            onClick={handleStop}
            disabled={!isSpeaking}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Square className="w-4 h-4" />
            Stop
          </Button>

          <Button
            onClick={() => setShowSettings(!showSettings)}
            variant="ghost"
            size="sm"
            className="ml-auto"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Advanced Settings */}
        {showSettings && (
          <div className="space-y-4 p-4 rounded-lg border">
            <h4 className="font-medium text-sm">Voice Settings</h4>
            
            <div className="space-y-2">
              <Label className="text-sm">Speech Rate: {rate.toFixed(1)}x</Label>
              <Slider
                value={[rate]}
                onValueChange={(value) => setRate(value[0])}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Pitch: {pitch.toFixed(1)}</Label>
              <Slider
                value={[pitch]}
                onValueChange={(value) => setPitch(value[0])}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Volume: {Math.round(volume * 100)}%</Label>
              <Slider
                value={[volume]}
                onValueChange={(value) => setVolume(value[0])}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Status Indicator */}
        {isSpeaking && (
          <div className="flex items-center gap-2 text-green-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm">Speaking...</span>
          </div>
        )}

        {/* Help Text */}
        <div className={`p-3 rounded-lg border ${
          highContrast 
            ? 'border-gray-600 bg-gray-800 text-gray-300' 
            : 'border-green-200 bg-green-50 text-green-700'
        }`}>
          <p className="text-xs">
            💡 Choose different voices and adjust speech settings to find what works best for you.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
