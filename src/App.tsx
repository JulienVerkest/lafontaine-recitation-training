import  { useState, useEffect } from 'react';
import { PoemList } from './components/PoemList';
import { PoemDisplay } from './components/PoemDisplay';
import { RecitationArea } from './components/RecitationArea';
import { Stats } from './components/Stats';
import { SideMenu } from './components/SideMenu';
import { fables } from './data/fables';
import { Poem } from './types/poetry';
import { getVersesCount, incrementVersesCount } from './utils/localStorage';

function App() {
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
  const [validatedLines, setValidatedLines] = useState<boolean[]>([]);
  const [totalVersesCount, setTotalVersesCount] = useState(0);

  useEffect(() => {
    setTotalVersesCount(getVersesCount());
  }, []);

  const handlePoemSelect = (poem: Poem) => {
    setSelectedPoem(poem);
    setValidatedLines([]);
  };

  const handleValidation = (newValidatedLines: boolean[]) => {
    const previousCorrectCount = validatedLines.filter(Boolean).length;
    const newCorrectCount = newValidatedLines.filter(Boolean).length;
    const newlyValidatedCount = newCorrectCount - previousCorrectCount;
    
    if (newlyValidatedCount > 0) {
      const newTotal = incrementVersesCount(newlyValidatedCount);
      setTotalVersesCount(newTotal);
    }
    
    setValidatedLines(newValidatedLines);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Stats versesCount={totalVersesCount} />
      <SideMenu />
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-serif text-gray-800 mb-2">
            Les Fables de La Fontaine
          </h1>
          <p className="text-gray-600">
            Apprenez et récitez les plus belles fables
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
          <PoemList
            poems={fables}
            onSelectPoem={handlePoemSelect}
            selectedPoemId={selectedPoem?.id.toString() || null}
          />
          
          {selectedPoem ? (
            <PoemDisplay poem={selectedPoem} validatedLines={validatedLines} />
          ) : (
            <div className="w-full max-w-2xl bg-white/50 backdrop-blur-sm rounded-lg shadow-lg p-8 text-center">
              <p className="text-xl text-gray-600 font-serif">
                Sélectionnez une fable pour commencer la lecture
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
          <RecitationArea 
            poem={selectedPoem} 
            onValidation={handleValidation}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
