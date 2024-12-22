import React, { useRef, useState, useEffect } from 'react';
import { BaseRecitationProps } from '../../common/types';
import { useRecitation } from '../../common/useRecitation';
import Card from '../../../../components/ui/Card';
import { ProgressBar } from '../../ProgressBar';
import { VerseProgressList } from '../../VerseProgressList';
import { Mic, RotateCcw } from 'lucide-react';
import CustomTextarea from '../../../../components/ui/Textarea';
import { DifficultySelector, type Difficulty } from '../../DifficultySelector';
import { Toolbar } from '../../toolbar/Toolbar';
import { ToolbarButton } from '../../toolbar/ToolbarButton';
import { ToolbarSeparator } from '../../toolbar/ToolbarSeparator';
import { CompletionMessage } from '../../CompletionMessage';

export function TextRecitation({ poem, onValidation, onTextChange, onModeSwitch }: BaseRecitationProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [textareaContent, setTextareaContent] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const event = new CustomEvent('recitationFocusChange', {
      detail: { isFocused, difficulty }
    });
    window.dispatchEvent(event);
  }, [isFocused, difficulty]);

  const {
    state,
    validateVerse,
    updateRecitation,
    getCurrentSectionLines,
    getOpacity,
    VERSES_PER_SECTION,
    restart
  } = useRecitation({ poem, onValidation, onTextChange });

  useEffect(() => {
    if (state.correctCount === poem.content.length && state.correctCount > 0) {
      setIsCompleted(true);
      if (textareaRef.current) {
        textareaRef.current.blur();
      }
      setIsFocused(false);
    }
  }, [state.correctCount, poem.content.length]);

  const handleRecitationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextareaContent(value);
    
    const lines = value.split('\n');
    const currentLine = lines[lines.length - 1];
    
    updateRecitation(currentLine);
    
    if (validateVerse(currentLine) && state.currentLineIndex < poem.content.length) {
      const newValue = value + '\n';
      setTextareaContent(newValue);
      
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.value = newValue;
          textareaRef.current.focus();
          textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
          const length = newValue.length;
          textareaRef.current.setSelectionRange(length, length);
        }
      });
    }
  };

  const handleRestart = () => {
    restart();
    setTextareaContent('');
    setIsCompleted(false);
    if (textareaRef.current) {
      textareaRef.current.value = '';
    }
  };

  const progress = (state.correctCount / poem.content.length) * 100;

  if (isCompleted) {
    return (
      <CompletionMessage 
        poemTitle={poem.title}
        versesCount={poem.content.length}
      />
    );
  }

  return (
    <>
      {isFocused && (
        <div className={`fixed inset-0 bg-black/20 ${blurAmount[difficulty]} transition-all duration-300 ease-in-out z-10`} />
      )}
      <Card className={`w-full transition-all duration-500 relative z-20 shadow-md border border-gray-200 ${
        isFocused ? 'ring-4 ring-indigo-100' : ''
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-base md:text-2xl font-serif text-gray-800">Récitation écrite</h2>
            <Toolbar>
              <ToolbarButton
                onClick={onModeSwitch}
                title="Passer en mode vocal"
                icon={<Mic className="w-4 h-4" />}
              />
              <ToolbarSeparator />
              <DifficultySelector 
                difficulty={difficulty}
                onChange={setDifficulty}
              />
              <ToolbarSeparator />
              <ToolbarButton
                onClick={handleRestart}
                title="Recommencer"
                icon={<RotateCcw className="w-4 h-4" />}
              />
            </Toolbar>
          </div>
          <ProgressBar 
            progress={progress}
            totalVerses={poem.content.length}
            completedVerses={state.correctCount}
          />
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <div className="relative">
              <CustomTextarea
                ref={textareaRef}
                value={textareaContent}
                onChange={handleRecitationChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={`Veuillez, cher ami, réciter le premier vers de la fable de Jean de la Fontaine : ${poem.title}...`}
                className="h-48 font-serif text-lg resize-none w-full pr-12"
                spellCheck={false}
              />
            </div>
          </div>

          <VerseProgressList
            validatedLines={getCurrentSectionLines()}
            currentSection={state.currentSection}
            versesPerSection={VERSES_PER_SECTION}
            getOpacity={getOpacity}
          />
        </div>
      </Card>
    </>
  );
}

const blurAmount = {
  easy: 'backdrop-blur-[2px]',
  medium: 'backdrop-blur-[3px]',
  hard: 'backdrop-blur-[4px]'
} as const;
