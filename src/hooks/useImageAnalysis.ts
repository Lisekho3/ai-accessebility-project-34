
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseImageAnalysisReturn {
  analyzing: boolean;
  result: string;
  analyzeImage: (file: File) => Promise<void>;
  captureFromCamera: () => Promise<void>;
  clearResult: () => void;
}

export const useImageAnalysis = (): UseImageAnalysisReturn => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState('');

  const analyzeImageWithOpenAI = async (imageBase64: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-image', {
        body: { imageBase64 }
      });

      if (error) {
        throw error;
      }

      return data.analysis;
    } catch (error) {
      console.error('Image analysis error:', error);
      throw error;
    }
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result?.toString().split(',')[1];
        if (base64) {
          resolve(base64);
        } else {
          reject(new Error('Failed to convert image to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const analyzeImage = useCallback(async (file: File) => {
    setAnalyzing(true);
    try {
      const base64 = await convertImageToBase64(file);
      const analysis = await analyzeImageWithOpenAI(base64);
      setResult(analysis);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setResult('Error: Failed to analyze image. Please check your OpenAI API configuration and try again.');
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const captureFromCamera = useCallback(async () => {
    try {
      setAnalyzing(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      await new Promise(resolve => {
        video.addEventListener('canplay', resolve);
      });
      
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      ctx.drawImage(video, 0, 0);
      
      stream.getTracks().forEach(track => track.stop());
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          await analyzeImage(file);
        }
      }, 'image/jpeg', 0.8);
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      setResult('Error: Could not access camera. Please check permissions and try again.');
      setAnalyzing(false);
    }
  }, [analyzeImage]);

  const clearResult = useCallback(() => {
    setResult('');
  }, []);

  return {
    analyzing,
    result,
    analyzeImage,
    captureFromCamera,
    clearResult,
  };
};
