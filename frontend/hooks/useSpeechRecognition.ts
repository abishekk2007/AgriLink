'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface SpeechSearchResult {
  rawTranscript: string;
  matchedCommodity?: string;
  matchedDistrict?: string;
  matchedMarket?: string;
  matchedState?: string;
}

export function useSpeechRecognition(onResult?: (result: SpeechSearchResult) => void) {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setIsSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN'; // Also supports en-US, ta-IN

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          setIsListening(false);
          setError(event.error || 'Speech recognition encountered an error.');
        };

        recognition.onresult = (event: any) => {
          const currentText = event.results[0][0].transcript;
          setTranscript(currentText);

          // Voice parsing logic for agricultural queries (e.g. "Tomato price in Chennai")
          const lower = currentText.toLowerCase();

          // Match commodities
          let matchedCommodity: string | undefined;
          if (lower.includes('tomato') || lower.includes('தக்காளி')) matchedCommodity = 'Tomato';
          else if (lower.includes('onion') || lower.includes('வெங்காயம்')) matchedCommodity = 'Onion';
          else if (lower.includes('potato') || lower.includes('உருளைக்கிழங்கு')) matchedCommodity = 'Potato';
          else if (lower.includes('rice') || lower.includes('paddy') || lower.includes('அரிசி') || lower.includes('நெல்'))
            matchedCommodity = 'Rice (Paddy)';
          else if (lower.includes('wheat') || lower.includes('கோதுமை')) matchedCommodity = 'Wheat';
          else if (lower.includes('chilli') || lower.includes('மிளகாய்')) matchedCommodity = 'Green Chilli';
          else if (lower.includes('maize') || lower.includes('சோளம்')) matchedCommodity = 'Maize';

          // Match districts or markets
          let matchedDistrict: string | undefined;
          let matchedMarket: string | undefined;

          if (lower.includes('chennai') || lower.includes('சென்னை')) {
            matchedDistrict = 'Chennai';
            matchedMarket = 'Koyambedu';
          } else if (lower.includes('koyambedu') || lower.includes('கோயம்பேடு')) {
            matchedDistrict = 'Chennai';
            matchedMarket = 'Koyambedu';
          } else if (lower.includes('madurai') || lower.includes('மதுரை')) {
            matchedDistrict = 'Madurai';
            matchedMarket = 'Madurai';
          } else if (lower.includes('coimbatore') || lower.includes('கோவை') || lower.includes('கோயம்புத்தூர்')) {
            matchedDistrict = 'Coimbatore';
            matchedMarket = 'Coimbatore';
          } else if (lower.includes('salem') || lower.includes('சேலம்')) {
            matchedDistrict = 'Salem';
            matchedMarket = 'Salem';
          } else if (lower.includes('dindigul') || lower.includes('திண்டுக்கல்') || lower.includes('ottanchatram') || lower.includes('ஒட்டன்சத்திரம்')) {
            matchedDistrict = 'Dindigul';
            matchedMarket = 'Ottanchatram (Dindigul)';
          }

          const parsedResult: SpeechSearchResult = {
            rawTranscript: currentText,
            matchedCommodity,
            matchedDistrict,
            matchedMarket,
            matchedState: matchedDistrict ? 'Tamil Nadu' : undefined,
          };

          if (onResult) {
            onResult(parsedResult);
          }
        };

        recognitionRef.current = recognition;
      } else {
        setIsSupported(false);
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onResult]);

  const startListening = useCallback((langCode = 'en-IN') => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.lang = langCode;
      recognitionRef.current.start();
    } catch (e: any) {
      console.warn('SpeechRecognition already started or error:', e);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    error,
    startListening,
    stopListening,
  };
}
