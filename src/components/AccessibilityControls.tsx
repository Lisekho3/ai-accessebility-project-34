
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Accessibility, Type, Contrast, Volume2 } from 'lucide-react';

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  screenReaderMode: boolean;
  audioFeedback: boolean;
}

interface AccessibilityControlsProps {
  settings: AccessibilitySettings;
  onUpdateSettings: (settings: Partial<AccessibilitySettings>) => void;
}

export const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
  settings,
  onUpdateSettings
}) => {
  const cardClass = settings.highContrast 
    ? 'bg-gray-900 border-gray-700 text-white' 
    : 'bg-white/80 backdrop-blur-sm border-gray-200';

  return (
    <Card className={`${cardClass} shadow-lg transition-all duration-300`}>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Accessibility className={`w-5 h-5 ${
            settings.highContrast ? 'text-green-400' : 'text-green-600'
          }`} />
          <h3 className="text-xl font-semibold">Accessibility</h3>
        </div>

        <div className="space-y-6">
          {/* Font Size Control */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              <Label htmlFor="font-size">Font Size: {settings.fontSize}px</Label>
            </div>
            <Slider
              id="font-size"
              min={12}
              max={24}
              step={1}
              value={[settings.fontSize]}
              onValueChange={(value) => onUpdateSettings({ fontSize: value[0] })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Small</span>
              <span>Large</span>
            </div>
          </div>

          {/* High Contrast Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Contrast className="w-4 h-4" />
              <Label htmlFor="high-contrast">High Contrast Mode</Label>
            </div>
            <Switch
              id="high-contrast"
              checked={settings.highContrast}
              onCheckedChange={(checked) => onUpdateSettings({ highContrast: checked })}
            />
          </div>

          {/* Screen Reader Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Accessibility className="w-4 h-4" />
              <Label htmlFor="screen-reader">Screen Reader Mode</Label>
            </div>
            <Switch
              id="screen-reader"
              checked={settings.screenReaderMode}
              onCheckedChange={(checked) => onUpdateSettings({ screenReaderMode: checked })}
            />
          </div>

          {/* Audio Feedback */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              <Label htmlFor="audio-feedback">Audio Feedback</Label>
            </div>
            <Switch
              id="audio-feedback"
              checked={settings.audioFeedback}
              onCheckedChange={(checked) => onUpdateSettings({ audioFeedback: checked })}
            />
          </div>

          {/* Quick Access Buttons */}
          <div className="border-t pt-4 mt-6">
            <h4 className="font-medium mb-3">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateSettings({ fontSize: 16, highContrast: false })}
                className={settings.highContrast ? 'border-gray-600 hover:bg-gray-800' : ''}
              >
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateSettings({ fontSize: 20, highContrast: true })}
                className={settings.highContrast ? 'border-gray-600 hover:bg-gray-800' : ''}
              >
                Max Access
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
