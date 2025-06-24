
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Eye, Volume2, Type, Palette } from 'lucide-react';

interface AccessibilitySettings {
  fontSize: number;
  fontFamily: 'default' | 'dyslexia' | 'large-print' | 'mono';
  highContrast: boolean;
  colorTheme: 'default' | 'dark' | 'yellow-black' | 'blue-white' | 'green-black';
  screenReaderMode: boolean;
  audioFeedback: boolean;
}

interface AccessibilityControlsProps {
  settings: AccessibilitySettings;
  onUpdateSettings: (settings: Partial<AccessibilitySettings>) => void;
  themeClasses: any;
}

export const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
  settings,
  onUpdateSettings,
  themeClasses,
}) => {
  return (
    <Card className={`${themeClasses.card} shadow-lg transition-all duration-300`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          Accessibility Settings
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
            max={32}
            step={1}
            className="w-full"
          />
        </div>

        {/* Font Family Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Font Family for Vision Support</Label>
          <Select 
            value={settings.fontFamily} 
            onValueChange={(value: any) => onUpdateSettings({ fontFamily: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default (System)</SelectItem>
              <SelectItem value="dyslexia">Dyslexia Friendly</SelectItem>
              <SelectItem value="large-print">Large Print (Bold)</SelectItem>
              <SelectItem value="mono">Monospace (Clear)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Color Theme Selection */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Palette className="w-4 h-4" />
            Color Theme for Eye Conditions
          </Label>
          <Select 
            value={settings.colorTheme} 
            onValueChange={(value: any) => onUpdateSettings({ colorTheme: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="dark">Dark Mode</SelectItem>
              <SelectItem value="yellow-black">Yellow on Black (Contrast)</SelectItem>
              <SelectItem value="blue-white">Blue on White (Calm)</SelectItem>
              <SelectItem value="green-black">Green on Black (Easy)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* High Contrast Toggle */}
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Eye className="w-4 h-4" />
            High Contrast Mode
          </Label>
          <Switch
            checked={settings.highContrast}
            onCheckedChange={(checked) => onUpdateSettings({ highContrast: checked })}
          />
        </div>

        {/* Screen Reader Mode */}
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            Screen Reader Announcements
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
            fontFamily: 'default',
            highContrast: false,
            colorTheme: 'default',
            screenReaderMode: false,
            audioFeedback: true,
          })}
          className="w-full"
        >
          Reset to Defaults
        </Button>

        {/* Accessibility Info */}
        <div className="p-3 rounded-lg border border-blue-200 bg-blue-50">
          <h4 className="font-medium text-sm mb-2 text-blue-700">
            🌟 Vision Support Features
          </h4>
          <ul className="text-xs space-y-1 text-blue-600">
            <li>• Dyslexia-friendly fonts available</li>
            <li>• Color themes for different eye conditions</li>
            <li>• Large font sizes up to 32px</li>
            <li>• High contrast modes for low vision</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
