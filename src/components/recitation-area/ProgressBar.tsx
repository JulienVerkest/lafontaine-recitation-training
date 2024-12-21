interface ProgressBarProps {
  progress: number;
  totalVerses: number;
  completedVerses: number;
}

export function ProgressBar({ progress, totalVerses, completedVerses }: ProgressBarProps) {
  return (
    <div className="invisible md:visible md:flex items-center gap-4">
      <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-green-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-lg font-serif text-gray-600">
        {completedVerses}/{totalVerses}
      </span>
    </div>
  );
}
