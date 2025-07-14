import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Typography } from './Typography';

interface SearchSuggestionItemProps {
  suggestion: string;
  onClick: (suggestion: string) => void;
}

export default function SearchSuggestionItem({ suggestion, onClick }: SearchSuggestionItemProps) {
  const handleClick = () => {
    onClick(suggestion);
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start px-4 h-auto text-left hover:bg-secondary/50 text-foreground"
      onClick={handleClick}
    >
      <FontAwesomeIcon 
        icon={faSearch} 
        style={{ 
          width: '16px', 
          height: '16px',
          color: 'var(--muted-foreground)',
          marginRight: '12px'
        }}
      />
      <Typography 
        variant="base" 
        color="foreground"
      >
        {suggestion}
      </Typography>
    </Button>
  );
}