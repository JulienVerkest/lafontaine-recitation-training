import { Mic, MicOff } from 'lucide-react';

interface VoiceRecognitionButtonProps {
  isListening: boolean;
  onClick: () => void;
}

export function VoiceRecognitionButton({ isListening, onClick }: VoiceRecognitionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`absolute right-2 bottom-2 p-2 rounded-full transition-colors ${
        isListening 
          ? 'bg-red-100 hover:bg-red-200 text-red-600' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
      }`}
      title={isListening ? "Arrêter la dictée" : "Commencer la dictée"}
    >
      {isListening ? (
        <MicOff className="w-5 h-5" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </button>
  );
}
