import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGetSearchSuggestionsQuery } from '../services/youtubeApi';
import { debounce } from '../utils/debounce';
import SearchSuggestions from './SearchSuggestions';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.87 17.17L12.28 11.58C13.35 10.35 14 8.75 14 7C14 3.13 10.87 0 7 0C3.13 0 0 3.13 0 7C0 10.87 3.13 14 7 14C8.75 14 10.35 13.35 11.58 12.29L17.17 17.88L17.87 17.17ZM7 13C3.69 13 1 10.31 1 7C1 3.69 3.69 1 7 1C10.31 1 13 3.69 13 7C13 10.31 10.31 13 7 13Z" fill="white"/>
  </svg>
);

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounce the search query
  const debouncedSetQuery = useRef(
    debounce((value: string) => {
      setDebouncedQuery(value);
    }, 300)
  ).current;

  // Fetch suggestions based on debounced query
  const { data: suggestions = [], isLoading } = useGetSearchSuggestionsQuery(debouncedQuery, {
    skip: debouncedQuery.length < 2,
  });

  useEffect(() => {
    debouncedSetQuery(query);
  }, [query, debouncedSetQuery]);

  useEffect(() => {
    setShowSuggestions(query.length >= 2 && suggestions.length > 0);
  }, [query, suggestions]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch?.(suggestion);
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleInputFocus = () => {
    if (query.length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleCloseSuggestions = () => {
    setShowSuggestions(false);
  };

  return (
    <div ref={searchContainerRef} className="max-w-xl mx-auto relative">
      <form onSubmit={handleSubmit}>
        <div className="flex">
          <Input
            type="text"
            placeholder="Search"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className="bg-transparent border border-border text-muted-foreground placeholder:text-muted-foreground focus:ring-0 focus:border-border rounded-l-3xl rounded-r-none px-4 border-r-0 flex-1 h-10"
            style={{ fontSize: 'var(--font-size-base)' }}
          />
          <Button 
            type="submit" 
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-r-3xl rounded-l-none px-4 cursor-pointer border border-primary border-l-0 h-10"
            style={{ paddingInline: '16px' }}
          >
            <SearchIcon />
          </Button>
        </div>
      </form>
      
      <SearchSuggestions
        suggestions={suggestions}
        isVisible={showSuggestions}
        onSuggestionClick={handleSuggestionClick}
        onClose={handleCloseSuggestions}
      />
    </div>
  );
}