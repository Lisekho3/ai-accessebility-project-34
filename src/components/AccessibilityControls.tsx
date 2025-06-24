
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Eye, Volume2, Type } from 'lucide-react';

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
  onUpdateSettings,
}) => {
  const cardClass = settings.highContrast 
    ? 'bg-gray-900 border-gray-700 text-white' 
    : 'bg-white/80 backdrop-blur-sm border-gray-200';

  return (
    <Card className={`${cardClass} shadow-lg transition-all duration-300`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className={`w-5 h-5 ${
            settings.highContrast ? 'text-blue-400' : 'text-blue-600'
          }`} />
          Accessibility
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Font Size Control */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Type className="w-4 h-4" />
            Font Size: {settings.fontSize}px
          </Label>
          <Slider
            value={[settings.fontSize]}
            onValueChange={(value) => onUpdateSettings({ fontSize: value[0] })}
            min={12}
            max={24}
            step={1}
            className="w-full"
          />
        </div>

        {/* High Contrast Toggle */}
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Eye className="w-4 h-4" />
            High Contrast
          </Label>
          <Switch
            checked={settings.highContrast}
            onCheckedChange={(checked) => onUpdateSettings({ highContrast: checked })}
          />
        </div>

        {/* Screen Reader Mode */}
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            Screen Reader Mode
          </Label>
          <Switch
            checked={settings.screenReaderMode}
            onCheckedChange={(checked) => onUpdateSettings({ screenReaderMode: checked })}
          />
        </div>

        {/* Audio Feedback */}
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Volume2 className="w-4 h-4" />
            Audio Feedback
          </Label>
          <Switch
            checked={settings.audioFeedback}
            onCheckedChange={(checked) => onUpdateSettings({ audioFeedback: checked })}
          />
        </div>

        {/* Quick Reset */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdateSettings({
            fontSize: 16,
            highContrast: false,
            screenReaderMode: false,
            audioFeedback: true,
          })}
          className="w-full"
        >
          Reset to Defaults
        </Button>
      </CardContent>
    </Card>
  );
};
