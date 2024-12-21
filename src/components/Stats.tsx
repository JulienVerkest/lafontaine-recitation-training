import { BookOpen } from 'lucide-react';

interface StatsProps {
  versesCount: number;
}

export function Stats({ versesCount }: StatsProps) {
  return (
    <div className="bg-indigo-50 rounded-lg p-4 flex items-center gap-3">
      <BookOpen className="w-6 h-6 text-indigo-600" />
      <div>
        <div className="text-sm text-gray-600 font-medium">Total des vers récités</div>
        <div className="text-2xl font-bold text-indigo-600">{versesCount}</div>
      </div>
    </div>
  );
}
