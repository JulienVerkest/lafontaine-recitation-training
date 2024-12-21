import { useState } from 'react';
import { RecitationProps } from '../../types/poetry';
import { RecitationMode } from './common/types';
import { TextRecitation } from './modes/text/TextRecitation';
import { VoiceRecitation } from './modes/voice/VoiceRecitation';

export function RecitationArea({ poem, onValidation, onTextChange }: RecitationProps) {
  const [mode, setMode] = useState<RecitationMode>('text');

  if (!poem) return null;

  const toggleMode = () => {
    setMode(prev => prev === 'text' ? 'voice' : 'text');
  };

  return mode === 'text' ? (
    <TextRecitation
      poem={poem}
      onValidation={onValidation}
      onTextChange={onTextChange || (() => {})}
      onModeSwitch={toggleMode}
    />
  ) : (
    <VoiceRecitation
      poem={poem}
      onValidation={onValidation}
      onTextChange={onTextChange || (() => {})}
      onModeSwitch={toggleMode}
    />
  );
}
