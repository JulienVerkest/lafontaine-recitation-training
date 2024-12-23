import { ChevronDown } from 'lucide-react';
import { Stats } from '../Stats';
import { RecitedVerses } from '../../types/poetry';

interface RecitedVersesListProps {
  versesCount: number;
  recitedVerses: RecitedVerses;
  isPoemCompleted: (poemId: string) => boolean;
}

export function RecitedVersesList({ versesCount, recitedVerses, isPoemCompleted }: RecitedVersesListProps) {
  return (
    <div className="space-y-4">
      <Stats versesCount={versesCount} />
      
      <div className="space-y-2">
        {Object.entries(recitedVerses).length === 0 ? (
          <p className="text-gray-500 text-center italic">
            Aucun vers récité pour le moment
          </p>
        ) : (
          Object.entries(recitedVerses).map(([poemId, verses]) => {
            const isCompleted = isPoemCompleted(poemId);
            return (
              <details
                key={poemId}
                className={`group rounded-lg overflow-hidden ${
                  isCompleted ? 'bg-green-50 ring-1 ring-green-200' : 'bg-gray-50'
                }`}
              >
                <summary className="flex items-center gap-3 p-3 cursor-pointer hover:bg-green-100/50 transition-colors">
                  <span className="text-xl">
                    {isCompleted ? '🎭' : '📝'}
                  </span>
                  <span className={`font-medium flex-grow ${isCompleted ? 'text-green-800' : 'text-gray-800'}`}>
                    {verses.poemTitle as string}
                  </span>
                  <span className="text-xs text-gray-500">
                    {verses.lines.length} vers
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-4 py-2 space-y-1 border-t border-gray-200">
                  {verses.lines.map((line: string, index: number) => (
                    <div 
                      key={index}
                      className="flex items-start gap-2 py-1 text-sm"
                    >
                      <span className={`font-medium min-w-[1.5rem] text-right ${
                        isCompleted ? 'text-green-500' : 'text-indigo-500'
                      }`}>
                        {index + 1}.
                      </span>
                      <p className="text-gray-600 leading-relaxed">
                        {line}
                      </p>
                    </div>
                  ))}
                </div>
              </details>
            );
          })
        )}
      </div>
    </div>
  );
}
