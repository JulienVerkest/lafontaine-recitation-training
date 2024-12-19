import React, { KeyboardEvent } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void;
  tabIndex?: number;
}

const Card: React.FC<CardProps> = ({ children, className = '', onKeyDown, tabIndex }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`} onKeyDown={onKeyDown} tabIndex={tabIndex}>
      {children}
    </div>
  );
}
export default Card;
