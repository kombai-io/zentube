import React from 'react';
import { Button } from './ui/button';
import { Typography } from './Typography';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetryButton?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "We're having trouble loading the content. Please try again.",
  onRetry,
  showRetryButton = true
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-12">
      <div className="text-center max-w-md">
        {/* Error Illustration */}
        <div className="mb-6">
          <img
            src="https://images.unsplash.com/photo-1544985562-128e7b377a21?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwzfHx3aWZpJTIwbmV0d29yayUyMGNvbm5lY3Rpb24lMjBlcnJvciUyMGJyb2tlbnxlbnwwfDJ8fHwxNzUxOTg0Mzc1fDA&ixlib=rb-4.1.0&q=85"
            alt="Network connection error - Quaritsch Photography on Unsplash"
            className="w-32 h-32 mx-auto object-cover rounded-lg opacity-60"
            style={{ width: '128px', height: '128px' }}
          />
        </div>

        {/* Error Content */}
        <Typography 
          as="h3" 
          variant="extra-large" 
          weight="semibold" 
          className="mb-3"
        >
          {title}
        </Typography>
        <Typography 
          as="p" 
          variant="base" 
          color="muted-foreground" 
          className="mb-6 leading-relaxed"
        >
          {message}
        </Typography>

        {/* Retry Button */}
        {showRetryButton && onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline"
            className="px-6"
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};