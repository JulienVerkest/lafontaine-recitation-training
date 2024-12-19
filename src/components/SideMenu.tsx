import  { useState } from 'react';
import { Menu, X, BookOpen, ChevronRight } from 'lucide-react';
import { getRecitedVerses } from '../utils/localStorage';
import { Stats } from './Stats';

interface SideMenuProps {
  versesCount: number;
}

export function SideMenu({ versesCount }: SideMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const recitedVerses = getRecitedVerses();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-40 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 hover:bg-gray-50 transition-colors"
        aria-label="Ouvrir le menu"
      >
        <Menu className="w-6 h-6 text-indigo-600" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side Menu */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif text-gray-800">Vers récités</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Fermer le menu"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <Stats versesCount={versesCount} />

          <div className="mt-6 space-y-2 max-h-[calc(100vh-12rem)] overflow-y-auto">
            {Object.entries(recitedVerses).length === 0 ? (
              <p className="text-gray-500 text-center italic">
                Aucun vers récité pour le moment
              </p>
            ) : (
              Object.entries(recitedVerses).map(([poemId, verses]) => (
                <details
                  key={poemId}
                  className="group bg-gray-50 rounded-lg overflow-hidden"
                >
                  <summary className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 transition-colors">
                    <BookOpen className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span className="font-medium text-gray-800 flex-grow">
                      {verses.poemTitle}
                    </span>
                    <span className="text-xs text-gray-500">
                      {verses.lines.length} vers
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="px-4 py-2 space-y-1 border-t border-gray-200">
                    {verses.lines.map((line, index) => (
                      <div 
                        key={index}
                        className="flex items-start gap-2 py-1 text-sm"
                      >
                        <span className="text-indigo-500 font-medium min-w-[1.5rem] text-right">
                          {index + 1}.
                        </span>
                        <p className="text-gray-600 leading-relaxed">
                          {line}
                        </p>
                      </div>
                    ))}
                  </div>
                </details>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
