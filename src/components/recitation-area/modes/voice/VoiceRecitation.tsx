import { useState } from 'react';
import { BaseRecitationProps } from '../../common/types';
import { useRecitation } from '../../common/useRecitation';
import { useVoiceRecognition } from '../../useVoiceRecognition';
import Card from '../../../../components/ui/Card';
import { ProgressBar } from '../../ProgressBar';
import { VerseProgressList } from '../../VerseProgressList';
import { Keyboard, Mic, MicOff } from 'lucide-react';
import { DifficultySelector, type Difficulty } from '../../DifficultySelector';
import { Toolbar } from '../../toolbar/Toolbar';
import { ToolbarButton } from '../../toolbar/ToolbarButton';
import { ToolbarSeparator } from '../../toolbar/ToolbarSeparator';

interface VoiceRecognitionButtonProps {
  isListening: boolean;
  onClick: () => void;
}

function VoiceRecognitionButton({ isListening, onClick }: VoiceRecognitionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-full transition-colors ${
        isListening 
          ? 'bg-red-100 hover:bg-red-200 text-red-600' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
      }`}
      title={isListening ? "Arrêter la dictée" : "Commencer la dictée"}
    >
      {isListening ? (
        <MicOff className="w-8 h-8" />
      ) : (
        <Mic className="w-8 h-8" />
      )}
    </button>
  );
}

export function VoiceRecitation({ poem, onValidation, onTextChange, onModeSwitch }: BaseRecitationProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  const {
    state,
    validateVerse,
    updateRecitation,
    getCurrentSectionLines,
    getOpacity,
    VERSES_PER_SECTION
  } = useRecitation({ poem, onValidation, onTextChange });

  const handleTranscriptUpdate = (transcript: string) => {
    const newText = transcript.trim();
    updateRecitation(newText);
    validateVerse(newText);
  };

  const { isListening, toggleMicrophone } = useVoiceRecognition(handleTranscriptUpdate);

  const progress = (state.correctCount / poem.content.length) * 100;

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
            <h2 className="text-base md:text-2xl font-serif text-gray-800">Récitation Vocale</h2>
            <Toolbar>
              <ToolbarButton
                onClick={onModeSwitch}
                title="Passer en mode texte"
                icon={<Keyboard className="w-4 h-4" />}
              />
              <ToolbarSeparator />
              <DifficultySelector 
                difficulty={difficulty}
                onChange={setDifficulty}
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
            <div 
              className="relative h-48 bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              tabIndex={0}
            >
              <div className="text-center mb-4">
                <p className="text-gray-600 mb-2">
                  {isListening ? 'En écoute...' : 'Cliquez sur le micro pour commencer'}
                </p>
                <p className="text-lg font-serif text-gray-800">
                  {state.recitation || 'Votre récitation apparaîtra ici'}
                </p>
              </div>
              <VoiceRecognitionButton 
                isListening={isListening}
                onClick={toggleMicrophone}
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
