import { useState, useEffect } from 'react';
import { BaseRecitationProps } from '../../common/types';
import { useRecitation } from '../../common/useRecitation';
import { useVoiceRecognition } from '../../useVoiceRecognition';
import Card from '../../../../components/ui/Card';
import { ProgressBar } from '../../ProgressBar';
import { VerseProgressList } from '../../VerseProgressList';
import { Keyboard, Mic, MicOff, RotateCcw } from 'lucide-react';
import { DifficultySelector, type Difficulty } from '../../DifficultySelector';
import { Toolbar } from '../../toolbar/Toolbar';
import { ToolbarButton } from '../../toolbar/ToolbarButton';
import { ToolbarSeparator } from '../../toolbar/ToolbarSeparator';
import { CompletionMessage } from '../../CompletionMessage';
import { ConfirmDialog } from '../../../ui/ConfirmDialog';
import { Tooltip } from '../../../ui/Tooltip';

interface VoiceRecognitionButtonProps {
  isListening: boolean;
  onClick: () => void;
}

function VoiceRecognitionButton({ isListening, onClick }: VoiceRecognitionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-full transition-colors ${
        isListening 
          ? 'bg-red-100 hover:bg-red-200 text-red-600' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
      }`}
      title={isListening ? "Arrêter la dictée" : "Commencer la dictée"}
    >
      {isListening ? (
        <MicOff className="w-6 h-6" />
      ) : (
        <Mic className="w-6 h-6" />
      )}
    </button>
  );
}

export function VoiceRecitation({ poem, onValidation, onTextChange, onModeSwitch }: BaseRecitationProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [isCompleted, setIsCompleted] = useState(false);
  const [transcriptHistory, setTranscriptHistory] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'restart' | 'mode-switch' | 'difficulty';
    callback: () => void;
    newDifficulty?: Difficulty;
  } | null>(null);

  // Réinitialiser l'état isCompleted quand la prop poem change
  useEffect(() => {
    setIsCompleted(false);
    setTranscriptHistory([]);
  }, [poem]);

  const {
    state,
    validateVerse,
    updateRecitation,
    getCurrentSectionLines,
    getOpacity,
    VERSES_PER_SECTION,
    restart
  } = useRecitation({ poem, onValidation, onTextChange });

  const handleAction = (
    type: 'restart' | 'mode-switch' | 'difficulty',
    callback: () => void,
    newDifficulty?: Difficulty
  ) => {
    if (isListening) {
      setPendingAction({ type, callback, newDifficulty });
      setShowConfirmDialog(true);
    } else {
      callback();
    }
  };

  const getConfirmDialogContent = () => {
    switch (pendingAction?.type) {
      case 'restart':
        return {
          title: 'Recommencer la récitation ?',
          message: 'Votre progression actuelle sera perdue. Voulez-vous vraiment recommencer ?'
        };
      case 'mode-switch':
        return {
          title: 'Changer de mode de récitation ?',
          message: 'Votre progression actuelle sera perdue. Voulez-vous vraiment changer de mode ?'
        };
      case 'difficulty':
        return {
          title: 'Changer le niveau de difficulté ?',
          message: 'Votre progression actuelle sera perdue. Voulez-vous vraiment changer de niveau ?'
        };
      default:
        return { title: '', message: '' };
    }
  };

  useEffect(() => {
    if (state.correctCount === poem.content.length && state.correctCount > 0) {
      setIsCompleted(true);
      setIsFocused(false);
      if (isListening) {
        toggleMicrophone();
      }
    }
  }, [state.correctCount, poem.content.length]);

  const handleTranscriptUpdate = (transcript: string) => {
    const newText = transcript.trim();
    updateRecitation(newText);
    if (validateVerse(newText)) {
      setTranscriptHistory(prev => [...prev, newText]);
    }
  };

  const { isListening, toggleMicrophone } = useVoiceRecognition(handleTranscriptUpdate);

  const handleRestart = () => {
    restart();
    setIsCompleted(false);
    setTranscriptHistory([]);
    if (isListening) {
      toggleMicrophone();
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
            <h2 className="text-base font-serif text-gray-800">Récitation vocale</h2>
            <Toolbar>
              <Tooltip 
                content={
                  <div className="flex items-center gap-2">
                    <span>Retour au mode texte</span>
                    <span className="px-1.5 py-0.5 text-xs bg-yellow-500 text-black rounded-full">Recommandé</span>
                  </div>
                }
                className="left-full ml-2"
              >
                <ToolbarButton
                  onClick={() => handleAction('mode-switch', onModeSwitch)}
                  title="Passer en mode texte"
                  icon={<Keyboard className="w-4 h-4" />}
                />
              </Tooltip>
              <ToolbarSeparator />
              <DifficultySelector 
                difficulty={difficulty}
                onChange={(newDifficulty) => 
                  handleAction('difficulty', () => setDifficulty(newDifficulty), newDifficulty)
                }
              />
              <ToolbarSeparator />
              <ToolbarButton
                onClick={() => handleAction('restart', handleRestart)}
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
            <div 
              className="relative h-36 bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center"
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
            
            {/* Historique des transcriptions */}
            <div className="mt-4 space-y-2">
              {transcriptHistory.map((transcript, index) => (
                <p key={index} className="text-sm text-gray-500 italic opacity-60">
                  {transcript}
                </p>
              ))}
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

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={() => {
          if (pendingAction) {
            if (pendingAction.type === 'difficulty' && pendingAction.newDifficulty) {
              setDifficulty(pendingAction.newDifficulty);
            } else {
              pendingAction.callback();
            }
          }
        }}
        {...getConfirmDialogContent()}
      />
    </>
  );
}

const blurAmount = {
  easy: 'backdrop-blur-[2px]',
  medium: 'backdrop-blur-[3px]',
  hard: 'backdrop-blur-[4px]'
} as const;
