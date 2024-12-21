import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  seconds: number;
  onComplete: () => void;
}

export function CountdownTimer({ seconds, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft === 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
      <p className="text-2xl font-serif text-gray-800 mb-4">
        Sélection aléatoire d'une fable dans...
      </p>
      <div className="text-5xl font-bold text-indigo-600 font-serif">
        {timeLeft}
      </div>
      <p className="mt-4 text-gray-600 italic">
        Choisissez une fable maintenant pour annuler le compte à rebours
      </p>
    </div>
  );
}
