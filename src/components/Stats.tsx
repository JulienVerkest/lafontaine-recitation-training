import React from 'react';
import { BookOpen } from 'lucide-react';

interface StatsProps {
  versesCount: number;
}

export function Stats({ versesCount }: StatsProps) {
  return (
    <div className="fixed top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 flex items-center gap-3 z-50 transition-all hover:scale-105">
      <BookOpen className="w-6 h-6 text-indigo-600" />
      <div>
        <div className="text-sm text-gray-600 font-medium">Vers récités</div>
        <div className="text-2xl font-bold text-indigo-600">{versesCount}</div>
      </div>
    </div>
  );
}
