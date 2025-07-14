import { useState } from 'react';
import { Typography } from './Typography';

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
  variant?: 'base' | 'small' | 'extra-small' | 'large' | 'extra-large' | 'video-title' | 'settings-title' | 'settings-description';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'foreground' | 'muted-foreground' | 'background' | 'primary' | 'destructive';
  className?: string;
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
}

export default function ExpandableText({
  text,
  maxLength = 200,
  variant = 'base',
  weight = 'normal',
  color = 'foreground',
  className,
  as = 'p'
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = text.length > maxLength;
  const displayText = isExpanded || !shouldTruncate 
    ? text 
    : text.slice(0, maxLength) + '...';

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="space-y-2">
      <Typography
        as={as}
        variant={variant}
        weight={weight}
        color={color}
        className={`leading-6 ${className || ''}`}
      >
        {displayText}
      </Typography>
      
      {shouldTruncate && (
        <button
          onClick={toggleExpanded}
          className="hover:text-white transition-colors cursor-pointer"
        >
          <Typography
            variant="base"
            weight="bold"
            color="muted-foreground"
            className="uppercase hover:text-white"
          >
            {isExpanded ? 'SHOW LESS' : 'SHOW MORE'}
          </Typography>
        </button>
      )}
    </div>
  );
}