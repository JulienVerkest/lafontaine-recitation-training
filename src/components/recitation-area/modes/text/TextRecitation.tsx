import React, { useRef, useState } from 'react';
import { BaseRecitationProps } from '../../common/types';
import { useRecitation } from '../../common/useRecitation';
import Card from '../../../../components/ui/Card';
import { ProgressBar } from '../../ProgressBar';
import { VerseProgressList } from '../../VerseProgressList';
import { Mic } from 'lucide-react';
import CustomTextarea from '../../../../components/ui/Textarea';

export function TextRecitation({ poem, onValidation, onTextChange, onModeSwitch }: BaseRecitationProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    state,
    validateVerse,
    updateRecitation,
    getCurrentSectionLines,
    getOpacity,
    VERSES_PER_SECTION
  } = useRecitation({ poem, onValidation, onTextChange });

  const handleRecitationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const lines = value.split('\n');
    const currentLine = lines[lines.length - 1];
    
    updateRecitation(value);
    
    if (validateVerse(currentLine) && state.currentLineIndex < poem.content.length) {
      const cleanedLines = lines.slice(0, -1).concat([currentLine]);
      const newValue = cleanedLines.join('\n') + '\n';
      
      requestAnimationFrame(() => {
        updateRecitation(newValue);
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
          const length = newValue.length;
          textareaRef.current.setSelectionRange(length, length);
        }
      });
    }
  };

  const progress = (state.correctCount / poem.content.length) * 100;

  return (
    <>
      {isFocused && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] transition-all duration-300 ease-in-out z-10" />
      )}
      <Card className={`w-full transition-all duration-500 relative z-20 shadow-md border border-gray-200 ${
        isFocused ? 'ring-4 ring-indigo-100' : ''
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-serif text-gray-800">Récitation écrite</h2>
            <button
              onClick={onModeSwitch}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Passer en mode vocal"
            >
              <Mic className="w-5 h-5 text-gray-600" />
            </button>
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
                value={state.recitation}
                onChange={handleRecitationChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Écrivez votre récitation ici..."
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
