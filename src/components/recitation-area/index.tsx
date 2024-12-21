import React, { useState, useEffect, useRef } from 'react';
import { RecitationProps } from '../../types/poetry';
import { validateLine } from '../../utils/validation';
import { addRecitedVerse } from '../../utils/localStorage';
import CustomTextarea from '../ui/Textarea';
import Card from '../ui/Card';
import { ProgressBar } from './ProgressBar';
import { VoiceRecognitionButton } from './VoiceRecognitionButton';
import { VerseProgressList } from './VerseProgressList';
import { useVoiceRecognition } from './useVoiceRecognition';

export function RecitationArea({ poem, onValidation, onTextChange }: RecitationProps) {
  const [recitation, setRecitation] = useState('');
  const [validatedLines, setValidatedLines] = useState<boolean[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const VERSES_PER_SECTION = 4;

  const handleTranscriptUpdate = (transcript: string) => {
    setRecitation(prev => {
      const lines = prev.split('\n');
      lines[lines.length - 1] = transcript;
      return lines.join('\n');
    });
  };

  const { isListening, toggleMicrophone } = useVoiceRecognition(handleTranscriptUpdate);

  useEffect(() => {
    setRecitation('');
    setValidatedLines([]);
    setCorrectCount(0);
    setCurrentLineIndex(0);
    
    if (poem) {
      setIsHighlighted(true);
      setTimeout(() => setIsHighlighted(false), 1000);
    }
  }, [poem]);

  useEffect(() => {
    const handleSectionChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      setRecitation('');
      if (customEvent.detail && customEvent.detail.section !== undefined) {
        const newSection = customEvent.detail.section;
        const newStartIndex = newSection * VERSES_PER_SECTION;
        setCurrentLineIndex(newStartIndex);
      }
    };

    window.addEventListener('sectionChange', handleSectionChange);
    return () => {
      window.removeEventListener('sectionChange', handleSectionChange);
    };
  }, []);

  const handleRecitationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setRecitation(value);
    if (!poem) return;

    const lines = value.split('\n');
    const currentLine = lines[lines.length - 1];
    
    onTextChange?.(currentLine, currentLineIndex);
    
    if (currentLineIndex < poem.content.length) {
      const isCorrect = validateLine(currentLine, poem.content[currentLineIndex]);
      
      if (isCorrect) {
        addRecitedVerse(poem.id.toString(), poem.title, poem.content[currentLineIndex]);

        const newValidatedLines = [...validatedLines];
        newValidatedLines[currentLineIndex] = true;
        setValidatedLines(newValidatedLines);
        onValidation(newValidatedLines);

        const newCorrectCount = newValidatedLines.filter(Boolean).length;
        setCorrectCount(newCorrectCount);

        const nextLineIndex = currentLineIndex + 1;
        setCurrentLineIndex(nextLineIndex);
        
        if (nextLineIndex < poem.content.length) {
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

  const currentSection = Math.floor(currentLineIndex / VERSES_PER_SECTION);
  const progress = (correctCount / poem.content.length) * 100;

  const getCurrentSectionLines = () => {
    const start = currentSection * VERSES_PER_SECTION;
    const end = Math.min(start + VERSES_PER_SECTION, poem.content.length);
    return Array.from({ length: end - start }, (_, i) => validatedLines[start + i] || false);
  };

  const getOpacity = (index: number) => {
    const baseOpacity = 0.3;
    const opacityStep = (1 - baseOpacity) / (VERSES_PER_SECTION - 1);
    return baseOpacity + (opacityStep * (VERSES_PER_SECTION - 1 - index));
  };

  return (
    <>
      {isFocused && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] transition-all duration-300 ease-in-out z-10" />
      )}
      <Card className={`w-full transition-all duration-500 relative z-20 ${
        isHighlighted 
          ? 'shadow-[0_0_15px_rgba(99,102,241,0.5)] border-2 border-indigo-500' 
          : 'shadow-md border border-gray-200'
      } ${isFocused ? 'ring-4 ring-indigo-100' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-serif text-gray-800">Récitation</h2>
          <ProgressBar 
            progress={progress}
            totalVerses={poem.content.length}
            completedVerses={correctCount}
          />
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <div className="relative">
              <CustomTextarea
                ref={textareaRef}
                value={recitation}
                onChange={handleRecitationChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Écrivez votre récitation ici..."
                className="h-48 font-serif text-lg resize-none w-full pr-12"
                spellCheck={false}
              />
              <VoiceRecognitionButton 
                isListening={isListening}
                onClick={toggleMicrophone}
              />
            </div>
          </div>

          <VerseProgressList
            validatedLines={getCurrentSectionLines()}
            currentSection={currentSection}
            versesPerSection={VERSES_PER_SECTION}
            getOpacity={getOpacity}
          />
        </div>
      </Card>
    </>
  );
}
