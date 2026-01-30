import { useState, useCallback, useRef } from 'react';

interface UseTextToSpeechReturn {
  isPlaying: boolean;
  isSupported: boolean;
  speak: (text: string) => void;
  stop: () => void;
}

export const useTextToSpeech = (): UseTextToSpeechReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const speak = useCallback((text: string) => {
    if (!isSupported) return;

    // Stop any current speech
    window.speechSynthesis.cancel();

    utteranceRef.current = new SpeechSynthesisUtterance(text);
    utteranceRef.current.rate = 0.9;
    utteranceRef.current.pitch = 1;
    utteranceRef.current.volume = 1;
    utteranceRef.current.lang = 'en-US';

    // Get a professional-sounding voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      voice => voice.name.includes('English') && voice.name.includes('Female')
    ) || voices.find(voice => voice.lang.startsWith('en'));
    
    if (preferredVoice) {
      utteranceRef.current.voice = preferredVoice;
    }

    utteranceRef.current.onstart = () => setIsPlaying(true);
    utteranceRef.current.onend = () => setIsPlaying(false);
    utteranceRef.current.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utteranceRef.current);
  }, [isSupported]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, [isSupported]);

  return {
    isPlaying,
    isSupported,
    speak,
    stop,
  };
};
