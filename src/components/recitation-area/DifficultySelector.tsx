import { ChevronDown } from 'lucide-react';

export type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}

export function DifficultySelector({ difficulty, onChange }: DifficultySelectorProps) {
  return (
    <div className="relative">
      <select
        value={difficulty}
        onChange={(e) => onChange(e.target.value as Difficulty)}
        className="h-8 appearance-none bg-transparent hover:bg-gray-100 text-sm text-gray-700 py-1 pl-3 pr-8 rounded transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="easy">Facile</option>
        <option value="medium">Moyen</option>
        <option value="hard">Difficile</option>
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
    </div>
  );
}
