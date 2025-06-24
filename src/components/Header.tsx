
import React from 'react';
import { Mic, Accessibility, Brain } from 'lucide-react';

export const Header = () => {
  return (
    <header className="text-center mb-8 animate-fade-in">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="relative">
          <Mic className="w-8 h-8 text-blue-600" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        </div>
        <Brain className="w-8 h-8 text-purple-600" />
        <Accessibility className="w-8 h-8 text-indigo-600" />
      </div>
      
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
        VoiceAccess AI
      </h1>
      
      <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
        Transform your voice into accurate text with AI-powered accessibility features designed for everyone
      </p>
      
      <div className="flex flex-wrap justify-center gap-2 mt-4 text-sm text-gray-500">
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Real-time Transcription</span>
        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">AI Enhancement</span>
        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">Accessibility First</span>
      </div>
    </header>
  );
};
