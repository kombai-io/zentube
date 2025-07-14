import React from 'react';
import { cn } from '@/lib/utils';
import { Typography } from './Typography';

interface CategoryPillProps {
  title: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const CategoryPill: React.FC<CategoryPillProps> = ({
  title,
  isActive = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer",
        "border border-transparent",
        isActive
          ? "bg-foreground"
          : "bg-muted hover:bg-muted/50"
      )}
    >
      <Typography 
        variant="base" 
        weight="normal"
        color={isActive ? "background" : "foreground"}
      >
        {title}
      </Typography>
    </button>
  );
};