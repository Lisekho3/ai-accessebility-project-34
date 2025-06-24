
import { useState, useEffect } from 'react';

interface AccessibilitySettings {
  fontSize: number;
  fontFamily: 'default' | 'dyslexia' | 'large-print' | 'mono';
  highContrast: boolean;
  colorTheme: 'default' | 'dark' | 'yellow-black' | 'blue-white' | 'green-black';
  screenReaderMode: boolean;
  audioFeedback: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 16,
  fontFamily: 'default',
  highContrast: false,
  colorTheme: 'default',
  screenReaderMode: false,
  audioFeedback: true,
};

const FONT_FAMILIES = {
  default: 'ui-sans-serif, system-ui, sans-serif',
  dyslexia: 'OpenDyslexic, Arial, sans-serif',
  'large-print': 'Arial Black, Arial, sans-serif',
  mono: 'ui-monospace, monospace'
};

const COLOR_THEMES = {
  default: {
    background: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
    text: 'text-gray-900',
    card: 'bg-white/80 backdrop-blur-sm border-gray-200',
    cardText: 'text-gray-800'
  },
  dark: {
    background: 'bg-gray-900',
    text: 'text-gray-100',
    card: 'bg-gray-800 border-gray-700',
    cardText: 'text-gray-100'
  },
  'yellow-black': {
    background: 'bg-yellow-300',
    text: 'text-black',
    card: 'bg-yellow-100 border-yellow-400',
    cardText: 'text-black'
  },
  'blue-white': {
    background: 'bg-blue-100',
    text: 'text-blue-900',
    card: 'bg-white border-blue-300',
    cardText: 'text-blue-900'
  },
  'green-black': {
    background: 'bg-green-200',
    text: 'text-black',
    card: 'bg-green-100 border-green-400',
    cardText: 'text-black'
  }
};

export const useAccessibility = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (error) {
        console.error('Failed to parse accessibility settings:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    
    // Apply font family to document
    document.documentElement.style.fontFamily = FONT_FAMILIES[settings.fontFamily];
  }, [settings]);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    
    if (settings.screenReaderMode) {
      const changes = Object.entries(newSettings)
        .map(([key, value]) => `${key} updated to ${value}`)
        .join(', ');
      
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.style.position = 'absolute';
      announcement.style.left = '-10000px';
      announcement.textContent = `Settings updated: ${changes}`;
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  };

  const getThemeClasses = () => COLOR_THEMES[settings.colorTheme];

  return {
    settings,
    updateSettings,
    getThemeClasses,
    fontFamilies: FONT_FAMILIES,
    colorThemes: COLOR_THEMES,
  };
};
