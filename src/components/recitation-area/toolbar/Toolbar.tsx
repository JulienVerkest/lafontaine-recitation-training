import React from 'react';

interface ToolbarProps {
  children: React.ReactNode;
}

export function Toolbar({ children }: ToolbarProps) {
  return (
    <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm">
      {children}
    </div>
  );
}
