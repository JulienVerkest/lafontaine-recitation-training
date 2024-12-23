import  { useState, useEffect } from 'react';
import { Menu as MenuIcon, X, ChevronDown, Pin } from 'lucide-react';
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
  emoji: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, emoji, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors group"
      >
        <span className="font-serif text-lg text-indigo-900 flex items-center gap-2">
          <span className="text-xl opacity-80 group-hover:scale-110 transition-transform">
            {emoji}
          </span>
          {title}
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-indigo-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
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

function MenuLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-lg flex items-center justify-center transform -rotate-6 transition-transform group-hover:rotate-0">
          <span className="text-xl">📖</span>
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center shadow-sm transform rotate-12 transition-transform group-hover:rotate-0">
          <span className="text-sm">🪶</span>
        </div>
      </div>
      <div className="flex flex-col">
        <h2 className="text-2xl font-serif font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
          Menu
        </h2>
        <span className="text-xs text-indigo-500 font-medium tracking-wider">
          LA FONTAINE
        </span>
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

  // Fonction pour vérifier si une fable est entièrement récitée
  const isPoemCompleted = (poemId: string) => {
    const poem = poems.find(p => p.id.toString() === poemId);
    const verses = recitedVerses[poemId];
    return poem && verses && verses.lines.length === poem.content.length;
  };

  useEffect(() => {
    const handleResize = () => {
      const isLargeScreen = window.innerWidth >= 1024;
      setIsOpen(isLargeScreen);
      setIsPinned(isLargeScreen);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

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
      {!isPinned && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed left-4 top-4 z-40 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 hover:bg-gray-50 transition-colors ${
            isFocused ? 'opacity-50' : ''
          }`}
          aria-label="Ouvrir le menu"
        >
          <MenuIcon className="w-6 h-6 text-indigo-600" />
        </button>
      )}

      {isOpen && !isPinned && (
        <div
          className={`fixed inset-0 bg-black/20 ${isFocused ? blurAmount : ''} z-40`}
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`fixed top-0 left-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isPinned ? 'translate-x-0' : isOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isFocused ? 'opacity-50' : ''}`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="group cursor-default">
                <MenuLogo />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPinned(!isPinned)}
                  className="hidden lg:flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label={isPinned ? "Détacher le menu" : "Épingler le menu"}
                >
                  <Pin className={`w-5 h-5 text-indigo-600 transition-transform ${isPinned ? 'rotate-45' : ''}`} />
                </button>
                {!isPinned && (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Fermer le menu"
                  >
                    <X className="w-5 h-5 text-indigo-600" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <CollapsibleSection 
              title="Sélection des fables" 
              emoji="📚"
              defaultOpen={true}
            >
              <PoemList
                poems={poems}
                onSelectPoem={(poem) => {
                  onSelectPoem(poem);
                  if (!isPinned) setIsOpen(false);
                }}
                selectedPoemId={selectedPoemId}
              />
            </CollapsibleSection>

            <CollapsibleSection 
              title="Vers récités" 
              emoji="✨"
            >
              <div className="space-y-4">
                <Stats versesCount={versesCount} />
                
                <div className="space-y-2">
                  {Object.entries(recitedVerses).length === 0 ? (
                    <p className="text-gray-500 text-center italic">
                      Aucun vers récité pour le moment
                    </p>
                  ) : (
                    Object.entries(recitedVerses).map(([poemId, verses]) => {
                      const isCompleted = isPoemCompleted(poemId);
                      return (
                        <details
                          key={poemId}
                          className={`group rounded-lg overflow-hidden ${
                            isCompleted ? 'bg-green-50 ring-1 ring-green-200' : 'bg-gray-50'
                          }`}
                        >
                          <summary className="flex items-center gap-3 p-3 cursor-pointer hover:bg-green-100/50 transition-colors">
                            <span className="text-xl">
                              {isCompleted ? '🎭' : '📝'}
                            </span>
                            <span className={`font-medium flex-grow ${isCompleted ? 'text-green-800' : 'text-gray-800'}`}>
                              {verses.poemTitle}
                            </span>
                            <span className="text-xs text-gray-500">
                              {verses.lines.length} vers
                            </span>
                            <ChevronDown className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" />
                          </summary>
                          <div className="px-4 py-2 space-y-1 border-t border-gray-200">
                            {verses.lines.map((line, index) => (
                              <div 
                                key={index}
                                className="flex items-start gap-2 py-1 text-sm"
                              >
                                <span className={`font-medium min-w-[1.5rem] text-right ${
                                  isCompleted ? 'text-green-500' : 'text-indigo-500'
                                }`}>
                                  {index + 1}.
                                </span>
                                <p className="text-gray-600 leading-relaxed">
                                  {line}
                                </p>
                              </div>
                            ))}
                          </div>
                        </details>
                      );
                    })
                  )}
                </div>
              </div>
            </CollapsibleSection>
          </div>
        </div>
      </div>

      {isPinned && <div className="w-96" />}
    </>
  );
}
