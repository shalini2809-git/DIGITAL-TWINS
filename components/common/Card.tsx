
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-secondary border border-border-color rounded-lg p-6 ${className}`}>
        {title && <h3 className="text-xl font-semibold text-text-primary mb-4">{title}</h3>}
        {children}
    </div>
  );
};
