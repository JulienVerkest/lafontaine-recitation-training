import { useState } from 'react';
import { BookOpen, Search, Filter } from 'lucide-react';
import { PoemListProps } from '../types/poetry';

export function PoemList({ poems, onSelectPoem, selectedPoemId }: PoemListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'length'>('title');

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

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Rechercher une fable..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        
        <button
          onClick={() => setSortBy(sortBy === 'title' ? 'length' : 'title')}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors bg-white rounded-lg border border-gray-200 hover:border-indigo-500"
        >
          <Filter className="w-4 h-4" />
          {sortBy === 'title' ? 'Longueur' : 'Titre'}
        </button>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {filteredAndSortedPoems.map((poem) => (
          <button
            key={poem.id}
            onClick={() => onSelectPoem(poem)}
            className={`w-full text-left p-3 rounded-lg transition-all ${
              selectedPoemId === String(poem.id)
                ? 'bg-indigo-50 border border-indigo-500'
                : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <div className="flex-grow">
                <h3 className="font-serif text-sm text-gray-800 line-clamp-1">{poem.title}</h3>
                <span className="text-xs text-gray-500">
                  {poem.content.length} vers
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="text-center text-sm text-gray-600">
        {filteredAndSortedPoems.length} fable{filteredAndSortedPoems.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
