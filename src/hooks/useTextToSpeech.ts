
import { useState, useEffect, useCallback } from 'react';

interface Voice {
  name: string;
  lang: string;
  voiceURI: string;
}

interface UseTextToSpeechReturn {
  voices: Voice[];
  selectedVoice: string;
  isSpeaking: boolean;
  rate: number;
  pitch: number;
  volume: number;
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  setSelectedVoice: (voiceURI: string) => void;
  setRate: (rate: number) => void;
  setPitch: (pitch: number) => void;
  setVolume: (volume: number) => void;
}

export const useTextToSpeech = (): UseTextToSpeechReturn => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices().map(voice => ({
        name: voice.name,
        lang: voice.lang,
        voiceURI: voice.voiceURI
      }));
      setVoices(availableVoices);
      
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0].voiceURI);
      }
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [selectedVoice]);

  const speak = useCallback((text: string) => {
    if (!text.trim()) return;

    // Stop any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = speechSynthesis.getVoices().find(v => v.voiceURI === selectedVoice);
    
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  }, [selectedVoice, rate, pitch, volume]);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const pause = useCallback(() => {
    speechSynthesis.pause();
  }, []);

  const resume = useCallback(() => {
    speechSynthesis.resume();
  }, []);

  return {
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
  };
};
