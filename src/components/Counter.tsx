import { BookOpen } from 'lucide-react';

interface CounterProps {
  count: number;
}

export function Counter({ count }: CounterProps) {
  return (
    <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 flex items-center gap-3">
      <BookOpen className="w-5 h-5 text-indigo-600" />
      <div>
        <div className="text-sm text-gray-600">Vers récités</div>
        <div className="text-2xl font-bold text-indigo-600">{count}</div>
      </div>
    </div>
  );
}
