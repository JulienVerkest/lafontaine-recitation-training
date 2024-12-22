import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  emoji: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function CollapsibleSection({ title, emoji, children, defaultOpen = false }: CollapsibleSectionProps) {
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
