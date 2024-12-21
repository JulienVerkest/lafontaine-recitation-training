import { useEffect, useRef, useState } from 'react';

export function useVoiceRecognition(onTranscriptUpdate: (transcript: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const resultsRef = useRef<string[]>([]);

  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'fr-FR';

      recognitionRef.current.onresult = (event) => {
        const results = Array.from(event.results);
        const lastResult = results[results.length - 1];
        const transcript = lastResult[0].transcript;

        // Ne mettre à jour que si la transcription a changé
        if (!resultsRef.current.includes(transcript)) {
          resultsRef.current = [transcript];
          onTranscriptUpdate(transcript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        resultsRef.current = [];
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      resultsRef.current = [];
    };
  }, [onTranscriptUpdate]);

  const toggleMicrophone = () => {
    if (!recognitionRef.current) {
      alert("La reconnaissance vocale n'est pas supportée par votre navigateur.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      resultsRef.current = [];
    } else {
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };

  return {
    isListening,
    toggleMicrophone
  };
}
