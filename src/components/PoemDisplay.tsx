import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';
import { PoemDisplayProps } from '../types/poetry';
import { Card } from './ui/Card';

export function PoemDisplay({ poem, validatedLines = [] }: PoemDisplayProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const VERSES_PER_SECTION = 7;

  useEffect(() => {
    const correctLines = validatedLines.filter(Boolean).length;
    const newSection = Math.floor(correctLines / VERSES_PER_SECTION);
    if (newSection !== currentSection && newSection * VERSES_PER_SECTION === correctLines) {
      setCurrentSection(newSection);
      // Dispatch a custom event when the section changes
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

  return (
    <Card className="w-full max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Quote className="w-8 h-8 text-indigo-600" />
        <div>
          <h1 className="text-3xl font-serif text-gray-800">{poem.title}</h1>
          <p className="text-lg text-gray-600">
            {poem.author} {poem.year ? `(${poem.year})` : ''}
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
                  : 'text-gray-400'
              }`}
            >
              {line}
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
