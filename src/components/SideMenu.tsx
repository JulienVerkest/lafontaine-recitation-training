import  { useState, useEffect } from 'react';
import { Menu, X, BookOpen, ChevronRight, ChevronDown, Pin } from 'lucide-react';
import { getRecitedVerses } from '../utils/localStorage';
import { Stats } from './Stats';
import { PoemList } from './PoemList';
import { Poem } from '../types/poetry';
import type { Difficulty } from './recitation-area/DifficultySelector';

interface SideMenuProps {
  versesCount: number;
  poems: Poem[];
  onSelectPoem: (poem: Poem) => void;
  selectedPoemId: string | null;
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <span className="font-serif text-lg text-gray-800">{title}</span>
        <ChevronDown 
          className={`w-5 h-5 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px]' : 'max-h-0'}`}>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export function SideMenu({ versesCount, poems, onSelectPoem, selectedPoemId }: SideMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>('easy');
  const recitedVerses = getRecitedVerses();

  useEffect(() => {
    const handleResize = () => {
      const isLargeScreen = window.innerWidth >= 1024;
      setIsOpen(isLargeScreen);
      setIsPinned(isLargeScreen);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Écouter les changements de focus de la récitation
    const handleFocusChange = (event: CustomEvent) => {
      setIsFocused(event.detail.isFocused);
      setCurrentDifficulty(event.detail.difficulty);
    };

    window.addEventListener('recitationFocusChange', handleFocusChange as EventListener);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('recitationFocusChange', handleFocusChange as EventListener);
    };
  }, []);

  const blurAmount = {
    easy: 'backdrop-blur-[2px]',
    medium: 'backdrop-blur-[3px]',
    hard: 'backdrop-blur-[4px]'
  }[currentDifficulty];

  return (
    <>
      {/* Bouton du menu (visible seulement si non épinglé) */}
      {!isPinned && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed left-4 top-4 z-40 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 hover:bg-gray-50 transition-colors ${
            isFocused ? 'opacity-50' : ''
          }`}
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-6 h-6 text-indigo-600" />
        </button>
      )}

      {/* Overlay (visible seulement si le menu est ouvert et non épinglé) */}
      {isOpen && !isPinned && (
        <div
          className={`fixed inset-0 bg-black/20 ${isFocused ? blurAmount : ''} z-40`}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side Menu */}
      <div className={`fixed top-0 left-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isPinned ? 'translate-x-0' : isOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isFocused ? 'opacity-50' : ''}`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif text-gray-800">Menu</h2>
              <div className="flex items-center gap-2">
                {/* Bouton pour épingler (visible seulement sur grands écrans) */}
                <button
                  onClick={() => setIsPinned(!isPinned)}
                  className="hidden lg:flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label={isPinned ? "Détacher le menu" : "Épingler le menu"}
                >
                  <Pin className={`w-5 h-5 text-gray-600 transition-transform ${isPinned ? 'rotate-45' : ''}`} />
                </button>
                {/* Bouton fermer (visible seulement si non épinglé) */}
                {!isPinned && (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Fermer le menu"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <CollapsibleSection title="Sélection des fables" defaultOpen={true}>
              <PoemList
                poems={poems}
                onSelectPoem={(poem) => {
                  onSelectPoem(poem);
                  if (!isPinned) setIsOpen(false);
                }}
                selectedPoemId={selectedPoemId}
              />
            </CollapsibleSection>

            <CollapsibleSection title="Vers récités">
              <div className="space-y-4">
                <Stats versesCount={versesCount} />
                
                <div className="space-y-2">
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
            </CollapsibleSection>
          </div>
        </div>
      </div>

      {/* Ajustement du contenu principal quand le menu est épinglé */}
      {isPinned && <div className="w-96" />}
    </>
  );
}
