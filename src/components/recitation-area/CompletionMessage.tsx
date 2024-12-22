import { Trophy } from 'lucide-react';
import Card from '../ui/Card';

interface CompletionMessageProps {
  poemTitle: string;
  versesCount: number;
}

export function CompletionMessage({ poemTitle, versesCount }: CompletionMessageProps) {
  return (
    <Card className="w-full bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="rounded-full bg-green-100 p-3">
          <Trophy className="w-8 h-8 text-green-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-serif text-green-800">
            Félicitations !
          </h3>
          <p className="text-green-700">
            Vous avez parfaitement récité la fable
          </p>
          <p className="text-lg font-serif text-green-900 font-medium">
            "{poemTitle}"
          </p>
          <p className="text-green-700">
            {versesCount} vers récités avec succès
          </p>
        </div>
      </div>
    </Card>
  );
}
