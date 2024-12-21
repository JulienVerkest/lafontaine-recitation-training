import React from 'react';

interface ToolbarButtonProps {
  onClick: () => void;
  title: string;
  icon: React.ReactNode;
}

export function ToolbarButton({ onClick, title, icon }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      className="h-8 px-2 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors rounded-l-lg"
      title={title}
    >
      {icon}
    </button>
  );
}
