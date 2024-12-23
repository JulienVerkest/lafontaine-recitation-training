export interface Poem {
  id: number;
  title: string;
  author: string;
  content: string[];
  year?: string;
  status: string;
  livre: number;
  cover: string | null;
  sort: number;
  prev: number | null;
  next: number | null;
  Slug: string;
  learnt: boolean;
  number: number;
}

export interface PoemDisplayProps {
  poem: Poem;
  validatedLines?: boolean[];
  currentTypedText?: string; // Ajout de la nouvelle prop
  currentLineIndex?: number; // Ajout de la nouvelle prop
}

export interface PoemListProps {
  poems: Poem[];
  onSelectPoem: (poem: Poem) => void;
  selectedPoemId: string | null;
}

export interface RecitationProps {
  poem: Poem | null;
  onValidation: (validatedLines: boolean[]) => void;
  onTextChange?: (text: string, lineIndex: number) => void; // Ajout de la nouvelle prop
}

export interface ValidationResult {
  correctLines: number;
  totalLines: number;
  validatedLines: boolean[];
}

export interface RecitedVerses {
  poemeTitle: string;
  lines: string[];
}
