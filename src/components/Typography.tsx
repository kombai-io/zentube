import React from 'react';
import { cn } from '../lib/utils';

interface TypographyProps {
  variant?: 'base' | 'small' | 'extra-small' | 'large' | 'extra-large' | 'video-title' | 'settings-title' | 'settings-description';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'foreground' | 'muted-foreground' | 'background' | 'primary' | 'destructive';
  className?: string;
  children: React.ReactNode;
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
  style?: React.CSSProperties;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'base',
  weight = 'normal',
  color = 'foreground',
  className,
  children,
  as: Component = 'span',
  style,
  ...props
}) => {
  const getFontSize = () => {
    switch (variant) {
      case 'extra-small':
        return 'var(--font-size-extra-small)';
      case 'small':
        return 'var(--font-size-small)';
      case 'base':
        return 'var(--font-size-base)';
      case 'large':
        return 'var(--font-size-large)';
      case 'extra-large':
        return 'var(--font-size-extra-large)';
      case 'video-title':
        return 'var(--font-size-video-title)';
      case 'settings-title':
        return 'var(--font-size-settings-title)';
      case 'settings-description':
        return 'var(--font-size-settings-description)';
      default:
        return 'var(--font-size-base)';
    }
  };

  const getFontWeight = () => {
    switch (weight) {
      case 'normal':
        return '400';
      case 'medium':
        return '500';
      case 'semibold':
        return '600';
      case 'bold':
        return '700';
      default:
        return '400';
    }
  };

  const getColorClass = () => {
    switch (color) {
      case 'foreground':
        return 'text-foreground';
      case 'muted-foreground':
        return 'text-muted-foreground';
      case 'background':
        return 'text-background';
      case 'primary':
        return 'text-primary';
      case 'destructive':
        return 'text-destructive';
      default:
        return 'text-foreground';
    }
  };

  return (
    <Component
      className={cn(getColorClass(), className)}
      style={{
        fontSize: getFontSize(),
        fontWeight: getFontWeight(),
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
};