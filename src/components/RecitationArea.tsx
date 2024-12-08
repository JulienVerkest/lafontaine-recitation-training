import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { RecitationProps } from '../types/poetry';
import { validateLine } from '../utils/validation';
import { addRecitedVerse } from '../utils/localStorage';
import CustomTextarea from './ui/Textarea';
import Card  from './ui/Card';

export function RecitationArea({ poem, onValidation }: RecitationProps) {
  const [recitation, setRecitation] = useState('');
  const [validatedLines, setValidatedLines] = useState<boolean[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const VERSES_PER_SECTION = 7;

  useEffect(() => {
    setRecitation('');
    setValidatedLines([]);
    setCorrectCount(0);
    setCurrentLineIndex(0);
  }, [poem]);

  useEffect(() => {
    const handleSectionChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      setRecitation('');
      if (customEvent.detail) {
        const newIndex = customEvent.detail.startIndex;
        setCurrentLineIndex(newIndex);
        
        // Ensure validatedLines array is properly sized
        const newValidatedLines = [...validatedLines];
        while (newValidatedLines.length < newIndex) {
          newValidatedLines.push(true);
        }
        setValidatedLines(newValidatedLines);
        setCorrectCount(newValidatedLines.filter(Boolean).length);
      }
    };

    window.addEventListener('sectionChange', handleSectionChange);
    return () => {
      window.removeEventListener('sectionChange', handleSectionChange);
    };
  }, [validatedLines]);

  const handleRecitationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setRecitation(value);
    if (!poem) return;

    const lines = value.split('\n');
    const currentLine = lines[lines.length - 1];
    
    if (currentLineIndex < poem.content.length) {
      const isCorrect = validateLine(currentLine, poem.content[currentLineIndex]);
      
      if (isCorrect) {
        // Store the recited verse
        addRecitedVerse(poem.id.toString(), poem.title, poem.content[currentLineIndex]);

        // Update validated lines
        const newValidatedLines = [...validatedLines];
        newValidatedLines[currentLineIndex] = true;
        setValidatedLines(newValidatedLines);
        onValidation(newValidatedLines);

        // Update correct count
        const newCorrectCount = newValidatedLines.filter(Boolean).length;
        setCorrectCount(newCorrectCount);

        // Move to next line
        const nextLineIndex = currentLineIndex + 1;
        setCurrentLineIndex(nextLineIndex);
        
        // Add new line to textarea if not at the end
        if (nextLineIndex < poem.content.length) {
          // Remove any extra newlines and add just one
          const cleanedLines = lines.slice(0, -1).concat([currentLine]);
          const newValue = cleanedLines.join('\n') + '\n';
          
          requestAnimationFrame(() => {
            setRecitation(newValue);
            if (textareaRef.current) {
              textareaRef.current.focus();
              textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
              const length = newValue.length;
              textareaRef.current.setSelectionRange(length, length);
            }
          });
        }
      }
    }
  };

  if (!poem) return null;

  const currentSection = Math.floor(correctCount / VERSES_PER_SECTION);
  const progress = (correctCount / poem.content.length) * 100;

  return (
    <Card className="w-full max-w-4xl mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-serif text-gray-800">Récitation</h2>
        <div className="flex items-center gap-4">
          <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-lg font-serif text-gray-600">
            {correctCount}/{poem.content.length}
          </span>
        </div>
      </div>

      <CustomTextarea
        ref={textareaRef}
        value={recitation}
        onChange={handleRecitationChange}
        placeholder="Écrivez votre récitation ici..."
        className="h-48 font-serif text-lg resize-none mb-4"
        spellCheck={false}
      />

      <div className="space-y-2">
        {validatedLines
          .slice(currentSection * VERSES_PER_SECTION, (currentSection + 1) * VERSES_PER_SECTION)
          .map((isCorrect, index) => (
            <div key={index} className="flex items-center gap-2">
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span className={`font-serif ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                Vers {currentSection * VERSES_PER_SECTION + index + 1}
              </span>
            </div>
          ))}
      </div>
    </Card>
  );
}
