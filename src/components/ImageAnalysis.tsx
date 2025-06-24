
import React, { useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Camera, Upload, Image, Loader, Trash2 } from 'lucide-react';
import { useImageAnalysis } from '@/hooks/useImageAnalysis';
import { toast } from 'sonner';

interface ImageAnalysisProps {
  highContrast: boolean;
  fontSize: number;
}

export const ImageAnalysis: React.FC<ImageAnalysisProps> = ({
  highContrast,
  fontSize,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { analyzing, result, analyzeImage, captureFromCamera, clearResult } = useImageAnalysis();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        analyzeImage(file);
        toast.success('Image uploaded for analysis');
      } else {
        toast.error('Please select a valid image file');
      }
    }
  };

  const handleCameraCapture = async () => {
    try {
      await captureFromCamera();
      toast.success('Image captured from camera');
    } catch (error) {
      toast.error('Failed to access camera');
    }
  };

  const cardClass = highContrast 
    ? 'bg-gray-900 border-gray-700 text-white' 
    : 'bg-white/80 backdrop-blur-sm border-gray-200';

  return (
    <Card className={`${cardClass} shadow-lg transition-all duration-300`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className={`w-5 h-5 ${
            highContrast ? 'text-purple-400' : 'text-purple-600'
          }`} />
          Image Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Controls */}
        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={analyzing}
            className="flex items-center gap-2"
            variant="outline"
          >
            <Upload className="w-4 h-4" />
            Upload Image
          </Button>
          
          <Button
            onClick={handleCameraCapture}
            disabled={analyzing}
            className="flex items-center gap-2"
            variant="outline"
          >
            <Camera className="w-4 h-4" />
            Capture from Camera
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Analysis Status */}
        {analyzing && (
          <div className="flex items-center gap-2 text-blue-500">
            <Loader className="w-4 h-4 animate-spin" />
            <span className="text-sm">Analyzing image...</span>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Analysis Results</h4>
              <Button
                onClick={clearResult}
                size="sm"
                variant="ghost"
                className="p-1"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <ScrollArea className="h-48 w-full rounded-md border p-3">
              <div 
                className={`whitespace-pre-wrap ${
                  highContrast ? 'text-gray-100' : 'text-gray-800'
                }`}
                style={{ fontSize: `${fontSize}px`, lineHeight: 1.5 }}
              >
                {result}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Help Text */}
        <div className={`p-3 rounded-lg border ${
          highContrast 
            ? 'border-gray-600 bg-gray-800 text-gray-300' 
            : 'border-blue-200 bg-blue-50 text-blue-700'
        }`}>
          <p className="text-xs">
            💡 Upload images or use your camera to get AI-powered analysis and accessibility descriptions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
