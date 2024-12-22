import { useState, useEffect } from 'react';
import { Menu as MenuIcon } from 'lucide-react';
import { getRecitedVerses } from '../../utils/localStorage';
import { PoemList } from '../PoemList';
import { Poem } from '../../types/poetry';
import type { Difficulty } from '../recitation-area/DifficultySelector';
import { CollapsibleSection } from './CollapsibleSection';
import { MenuHeader } from './MenuHeader';
import { RecitedVersesList } from './RecitedVersesList';

interface SideMenuProps {
  versesCount: number;
  poems: Poem[];
  onSelectPoem: (poem: Poem) => void;
  selectedPoemId: string | null;
}

export function SideMenu({ versesCount, poems, onSelectPoem, selectedPoemId }: SideMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>('easy');
  const recitedVerses = getRecitedVerses();

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
          <MenuHeader 
            isPinned={isPinned}
            setIsPinned={setIsPinned}
            onClose={() => setIsOpen(false)}
          />

          <div className="flex-1 overflow-y-auto">
            <CollapsibleSection 
              title="Récitez des fables" 
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
              <RecitedVersesList 
                versesCount={versesCount}
                recitedVerses={recitedVerses}
                isPoemCompleted={isPoemCompleted}
              />
            </CollapsibleSection>
          </div>
        </div>
      </div>

      {isPinned && <div className="w-96" />}
    </>
  );
}
