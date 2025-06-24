
import { useState, useEffect } from 'react';

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  screenReaderMode: boolean;
  audioFeedback: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 16,
  highContrast: false,
  screenReaderMode: false,
  audioFeedback: true,
};

export const useAccessibility = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);

  // Load settings from localStorage on mount
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

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    
    // Announce changes for screen readers
    if (settings.screenReaderMode) {
      const changes = Object.entries(newSettings)
        .map(([key, value]) => `${key} ${value ? 'enabled' : 'disabled'}`)
        .join(', ');
      
      // Create temporary element for screen reader announcement
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

  return {
    settings,
    updateSettings,
  };
};
