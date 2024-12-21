import { VerseProgress } from './VerseProgress';

interface VerseProgressListProps {
  validatedLines: boolean[];
  currentSection: number;
  versesPerSection: number;
  getOpacity: (index: number) => number;
}

export function VerseProgressList({ 
  validatedLines, 
  currentSection, 
  versesPerSection,
  getOpacity 
}: VerseProgressListProps) {
  return (
    <div id="progressRecitation" className="hidden md:block w-64 bg-gray-50 rounded-lg p-4">
      <div className="text-sm font-medium text-gray-600 mb-3 hidden">
        Progression de la section {currentSection + 1}
      </div>
      <div className="space-y-2">
        {validatedLines.map((isCorrect, index) => (
          <VerseProgress
            key={index}
            isCorrect={isCorrect}
            verseNumber={currentSection * versesPerSection + index + 1}
            opacity={getOpacity(index)}
          />
        ))}
      </div>
    </div>
  );
}
