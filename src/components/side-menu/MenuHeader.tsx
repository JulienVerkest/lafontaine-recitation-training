import { Pin, X } from 'lucide-react';
import { MenuLogo } from './MenuLogo';

interface MenuHeaderProps {
  isPinned: boolean;
  setIsPinned: (value: boolean) => void;
  onClose: () => void;
}

export function MenuHeader({ isPinned, setIsPinned, onClose }: MenuHeaderProps) {
  return (
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
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Fermer le menu"
            >
              <X className="w-5 h-5 text-indigo-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
