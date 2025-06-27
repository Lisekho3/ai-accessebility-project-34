import React, { useRef, useState } from 'react';
import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, Camera, Loader, Volume2, Pause, Play, StopCircle, Brain } from 'lucide-react';

interface GeminiImageAnalyzerProps {
    highContrast: boolean;
    fontSize: number;
    themeClasses: any;
}

const GeminiImageAnalyzer:React.FC<GeminiImageAnalyzerProps> = ({
    highContrast,
    fontSize,
    themeClasses
}) => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setResult(null);
    setError(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    try {
      // Convert image file to base64
      const toBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1]; // strip `data:image/...;base64,`
            resolve(base64);
          };
          reader.onerror = reject;
        });

      const base64Image = await toBase64(file);

      const payload = {
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: file.type,
                  data: base64Image,
                },
              },
              {
                text: "What does this image show?",
              },
            ],
          },
        ]
      };

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        /* setResult(data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini'); */
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        setResult(text);
      } else {
        setError(data.error?.message || 'Gemini API error');
      }
    } catch (err: any) {
      setError("Image analysis failed");
      console.error(err);
    }

    setLoading(false);


  };
    //readaloud function
    const handleReadAloud = () => {
        if (!result) return;

        //stop any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(result);
        utteranceRef.current = utterance;

        utterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
        }

        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
        setIsPaused(false);
    }

        const handlePause = () => {
            window.speechSynthesis.pause();
            setIsPaused(true);
        }

        const handleResume = () => {
            window.speechSynthesis.resume();
            setIsPaused(false);
        }

        const handleStop = () => {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            setIsPaused(false);
        }
  

  return (
    <Card className={`${themeClasses.card} shadow-lg transition-all duration-300`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className={`w-5 h-5 ${highContrast ? 'text-yellow-400' : 'text-yellow-600'}`} />
          Gemini Image Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Camera capture */}
        <input 
            type='file'
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
            ref={cameraInputRef}
            style={{ display: 'none' }}    
        />
        {/* Upload Buttons */}
        <div className="grid grid-cols-1 gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={uploadInputRef}
            className="hidden"
          />
         

          <Button
            onClick={() => uploadInputRef.current?.click()}
            disabled={loading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Image
          </Button>
          <Button
            onClick={() => cameraInputRef.current?.click()}
            /* disabled={loading} */
            variant="outline"
            className="flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            Take Photo
          </Button>

          
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center gap-2 text-blue-500">
            <Loader className="w-4 h-4 animate-spin" />
            <span className="text-sm">Analyzing image with Gemini...</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-sm text-red-500">{error}</div>
        )}

        {/* Result + Voice Controls */}
        {result && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Gemini's Response</h4>
            </div>
            <ScrollArea className="h-48 w-full rounded-md border p-3">
              <div
                className={`whitespace-pre-wrap ${themeClasses.cardText}`}
                style={{ fontSize: `${fontSize}px`, lineHeight: 1.5 }}
              >
                {result}
              </div>
            </ScrollArea>

            {/* Voice Buttons */}
            <div className="flex gap-2 flex-wrap mt-2">
              {!isSpeaking && (
                <Button onClick={handleReadAloud} className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Read Aloud
                </Button>
              )}
              {isSpeaking && !isPaused && (
                <Button onClick={handlePause} variant="secondary" className="flex items-center gap-2">
                  <Pause className="w-4 h-4" />
                  Pause
                </Button>
              )}
              {isSpeaking && isPaused && (
                <Button onClick={handleResume} variant="secondary" className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Resume
                </Button>
              )}
              {isSpeaking && (
                <Button onClick={handleStop} variant="destructive" className="flex items-center gap-2">
                  <StopCircle className="w-4 h-4" />
                  Stop
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Help Note */}
        <div className={`p-3 rounded-lg border ${
          highContrast 
            ? 'border-gray-600 bg-gray-800 text-gray-300' 
            : 'border-yellow-200 bg-yellow-50 text-yellow-700'
        }`}>
          <p className="text-xs">
            💡 Upload or capture an image to get AI-generated visual descriptions using Gemini.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeminiImageAnalyzer;
