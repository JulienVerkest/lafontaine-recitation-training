import { Poem } from '../../../types/poetry';

export type RecitationMode = 'text' | 'voice';

export interface RecitationState {
  recitation: string;
  validatedLines: boolean[];
  correctCount: number;
  currentLineIndex: number;
  currentSection: number;
}

export interface RecitationHandlers {
  onValidation: (validatedLines: boolean[]) => void;
  onTextChange: (text: string, lineIndex: number) => void;
}

export interface BaseRecitationProps extends RecitationHandlers {
  poem: Poem;
  onModeSwitch: () => void;
}

export interface UseRecitationProps {
  poem: Poem | null;
  onValidation: (validatedLines: boolean[]) => void;
  onTextChange: (text: string, lineIndex: number) => void;
}
