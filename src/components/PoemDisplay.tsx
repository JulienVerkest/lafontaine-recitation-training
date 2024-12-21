import { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';
import { PoemDisplayProps } from '../types/poetry';
import { compareCharacters } from '../utils/validation';
import Card from './ui/Card';

export function PoemDisplay({ 
  poem, 
  validatedLines = [], 
  currentTypedText = '',
  currentLineIndex = 0 
}: PoemDisplayProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const VERSES_PER_SECTION = 4;

  useEffect(() => {
    const correctLines = validatedLines.filter(Boolean).length;
    const newSection = Math.floor(correctLines / VERSES_PER_SECTION);
    if (newSection !== currentSection && newSection * VERSES_PER_SECTION === correctLines) {
      setCurrentSection(newSection);
      window.dispatchEvent(new CustomEvent('sectionChange', { 
        detail: { section: newSection } 
      }));
    }
  }, [validatedLines, currentSection]);

  const getCurrentVerses = () => {
    const start = currentSection * VERSES_PER_SECTION;
    const end = start + VERSES_PER_SECTION;
    return poem.content.slice(start, end);
  };

  const highlightText = (text: string, absoluteIndex: number) => {
    // Si la ligne est déjà validée ou n'est pas la ligne courante, retourner le texte tel quel
    if (validatedLines[absoluteIndex] || absoluteIndex !== currentLineIndex) {
      return text;
    }

    const charResults = compareCharacters(currentTypedText, text);
    
    return text.split('').map((char, i) => {
      const isCorrect = charResults[i];
      const isPending = i >= charResults.length;

      return (
        <span
          key={i}
          className={`transition-colors ${
            isCorrect 
              ? 'text-green-600 font-medium '
              : isPending 
                ? 'text-gray-400'
                : 'text-red-600'
          }`}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <Card className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <Quote className="w-8 h-8 text-indigo-600" />
        <div>
          <h1 className="text-3xl font-serif text-gray-800">{poem.title}</h1>
          <p className="text-lg text-gray-600">
            Livre {poem.livre}, fable {poem.number}, {poem.year ? `(${poem.year})` : ''}
          </p>
        </div>
      </div>
      <div className="space-y-4 relative min-h-[200px]">
        {getCurrentVerses().map((line, index) => {
          const absoluteIndex = currentSection * VERSES_PER_SECTION + index;
          return (
            <p
              key={absoluteIndex}
              className={`text-xl font-serif leading-relaxed transition-all duration-500 ease-in-out transform ${
                validatedLines[absoluteIndex]
                  ? 'text-gray-800 bg-green-50 scale-[1.02] pl-4 border-l-4 border-green-500'
                  : ''
              }`}
            >
              {highlightText(line, absoluteIndex)}
            </p>
          );
        })}
      </div>
      {currentSection > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Section {currentSection + 1} / {Math.ceil(poem.content.length / VERSES_PER_SECTION)}
        </div>
      )}
    </Card>
  );
}
