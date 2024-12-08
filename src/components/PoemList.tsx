import React, { useState } from 'react';
import { BookOpen, ChevronUp, ChevronDown, Search, Filter } from 'lucide-react';
import { PoemListProps } from '../types/poetry';
import { Card } from './ui/Card';

export function PoemList({ poems, onSelectPoem, selectedPoemId }: PoemListProps) {
  const [startIndex, setStartIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'length'>('title');
  const visibleCount = 3;

  const filteredAndSortedPoems = poems
    .filter(poem => 
      poem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poem.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'length') {
        return b.content.length - a.content.length;
      }
      return a.title.localeCompare(b.title);
    });

  const maxStartIndex = Math.max(0, filteredAndSortedPoems.length - visibleCount);
  const visiblePoems = filteredAndSortedPoems.slice(startIndex, startIndex + visibleCount);

  const handleScrollUp = () => {
    setStartIndex(Math.max(0, startIndex - 1));
  };

  const handleScrollDown = () => {
    setStartIndex(Math.min(maxStartIndex, startIndex + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleScrollUp();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleScrollDown();
    }
  };

  return (
    <Card className="w-full max-w-md relative" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="mb-6">
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une fable..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setStartIndex(0);
              }}
              className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={() => setSortBy(sortBy === 'title' ? 'length' : 'title')}
              className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Trier par {sortBy === 'title' ? 'longueur' : 'titre'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="relative">
        {startIndex > 0 && (
          <button
            onClick={handleScrollUp}
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors z-10 border border-gray-100"
            aria-label="Voir les fables précédentes"
          >
            <ChevronUp className="w-5 h-5 text-gray-600" />
          </button>
        )}

        <div className="space-y-4 relative">
          {visiblePoems.map((poem) => (
            <button
              key={poem.id}
              onClick={() => onSelectPoem(poem)}
              className={`w-full text-left p-4 rounded-lg transition-all ${
                selectedPoemId === poem.id
                  ? 'bg-indigo-50 border-2 border-indigo-500'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <div className="flex-grow">
                  <h3 className="font-serif text-lg text-gray-800">{poem.title}</h3>
                  <div className="flex justify-between items-center">
                    {/* <p className="text-sm text-gray-600">
                      {poem.author} {poem.year ? `(${poem.year})` : ''}
                    </p> */}
                    <span className="text-xs text-gray-500">
                      {poem.content.length} vers
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {startIndex < maxStartIndex && (
          <button
            onClick={handleScrollDown}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors z-10 border border-gray-100"
            aria-label="Voir les fables suivantes"
          >
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-600">
        {filteredAndSortedPoems.length > 0 ? (
          `${startIndex + 1}-${Math.min(startIndex + visibleCount, filteredAndSortedPoems.length)} sur ${filteredAndSortedPoems.length} fables`
        ) : (
          "Aucune fable trouvée"
        )}
      </div>
    </Card>
  );
}
