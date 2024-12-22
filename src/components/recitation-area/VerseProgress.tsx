import { CheckCircle2, XCircle } from 'lucide-react';

interface VerseProgressProps {
  isCorrect: boolean;
  verseNumber: number;
  opacity: number;
}

export function VerseProgress({ isCorrect, verseNumber, opacity }: VerseProgressProps) {
  return (
    <div 
      className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
        isCorrect ? 'bg-green-50' : 'bg-white'
      }`}
      style={{ opacity: isCorrect ? 1 : opacity }}
    >
      {isCorrect ? (
        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
      ) : (
        <XCircle className="w-4 h-4 text-gray-300 flex-shrink-0" />
      )}
      <span className={`font-serif text-xs ${
        isCorrect ? 'text-green-600' : 'text-gray-600'
      }`}>
        Vers {verseNumber}
      </span>
    </div>
  );
}
