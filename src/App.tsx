import { useState, useEffect } from 'react';
import { PoemDisplay } from './components/PoemDisplay';
import { RecitationArea } from './components/recitation-area';
import { SideMenu } from './components/side-menu';
import { CountdownTimer } from './components/CountdownTimer';
import { fables } from './data/fables';
import { Poem } from './types/poetry';
import { 
  getVersesCount, 
  incrementVersesCount, 
  saveLastSelectedPoem,
  getLastSelectedPoem,
  hasVisitedBefore
} from './utils/localStorage';

function App() {
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
  const [validatedLines, setValidatedLines] = useState<boolean[]>([]);
  const [totalVersesCount, setTotalVersesCount] = useState(0);
  const [currentTypedText, setCurrentTypedText] = useState('');
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showCountdown, setShowCountdown] = useState(false);

  useEffect(() => {
    setTotalVersesCount(getVersesCount());
    
    const lastPoemId = getLastSelectedPoem();
    if (lastPoemId) {
      const lastPoem = fables.find(poem => poem.id === lastPoemId);
      if (lastPoem) {
        setSelectedPoem(lastPoem);
      }
    } else if (!hasVisitedBefore()) {
      setShowCountdown(true);
    }
  }, []);

  const handlePoemSelect = (poem: Poem) => {
    setSelectedPoem(poem);
    setValidatedLines([]);
    setCurrentTypedText('');
    setCurrentLineIndex(0);
    setShowCountdown(false);
    saveLastSelectedPoem(poem.id);
  };

  const handleRandomSelection = () => {
    const randomIndex = Math.floor(Math.random() * fables.length);
    const randomPoem = fables[randomIndex];
    handlePoemSelect(randomPoem);
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
        <header className="text-center mb-2">
          <h1 className="elegant-title text-xl md:text-4xl ">
            {"Les Fables de La Fontaine".split('').map((char, i) => (
              <span 
                key={i} 
                className="inline-block mx-[0.02em]"
                style={{ '--char-index': i } as React.CSSProperties}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>
          {/* <p className="elegant-subtitle text-lg hidden md:block">
            Récitez les plus belles fables
          </p> */}
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
            ) : showCountdown ? (
              <CountdownTimer 
                seconds={7} 
                onComplete={handleRandomSelection} 
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
