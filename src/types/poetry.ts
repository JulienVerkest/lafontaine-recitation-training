export interface Poem {
  id: string;
  title: string;
  author: string;
  content: string[];
  year?: number;
}

export interface PoemDisplayProps {
  poem: Poem;
  validatedLines?: boolean[];
}

export interface PoemListProps {
  poems: Poem[];
  onSelectPoem: (poem: Poem) => void;
  selectedPoemId: string | null;
}

export interface RecitationProps {
  poem: Poem | null;
  onValidation: (validatedLines: boolean[]) => void;
}

export interface ValidationResult {
  correctLines: number;
  totalLines: number;
  validatedLines: boolean[];
}
