import  { useState, useEffect } from 'react';
import { PoemDisplay } from './components/PoemDisplay';
import { RecitationArea } from './components/RecitationArea';
import { SideMenu } from './components/SideMenu';
import { fables } from './data/fables';
import { Poem } from './types/poetry';
import { getVersesCount, incrementVersesCount } from './utils/localStorage';

function App() {
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
  const [validatedLines, setValidatedLines] = useState<boolean[]>([]);
  const [totalVersesCount, setTotalVersesCount] = useState(0);
  const [currentTypedText, setCurrentTypedText] = useState('');
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  useEffect(() => {
    setTotalVersesCount(getVersesCount());
  }, []);

  const handlePoemSelect = (poem: Poem) => {
    setSelectedPoem(poem);
    setValidatedLines([]);
    setCurrentTypedText('');
    setCurrentLineIndex(0);
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

  const handleTextChange = (text: string, lineIndex: number) => {
    setCurrentTypedText(text);
    setCurrentLineIndex(lineIndex);
  };

  return (
    <div className="min-h-screen">
      <div className="background-container" />
      <div className="background-overlay" />
      
      <SideMenu 
        poems={fables}
        onSelectPoem={handlePoemSelect}
        selectedPoemId={selectedPoem?.id.toString() || null}
        versesCount={totalVersesCount}
      />
      <div className="container mx-auto px-4 py-12 lg:pl-[384px] transition-all duration-300">
        <header className="text-center mb-8">
          <h1 className="elegant-title text-5xl mb-4 tracking-wide">
            {"Les Fables de La Fontaine".split('').map((char, i) => (
              <span key={i} className="inline-block mx-[0.01em]">
                {char}
              </span>
            ))}
          </h1>
          <p className="elegant-subtitle text-xl">
            Apprenez et récitez les plus belles fables
          </p>
        </header>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="w-full">
            <RecitationArea 
              poem={selectedPoem} 
              onValidation={handleValidation}
              onTextChange={handleTextChange}
            />
          </div>

          <div className="w-full">
            {selectedPoem ? (
              <PoemDisplay 
                poem={selectedPoem} 
                validatedLines={validatedLines}
                currentTypedText={currentTypedText}
                currentLineIndex={currentLineIndex}
              />
            ) : (
              <div className="bg-white/50 backdrop-blur-sm rounded-lg shadow-lg p-8 text-center">
                <p className="text-xl text-gray-600 font-serif">
                  Sélectionnez une fable pour commencer la lecture
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
