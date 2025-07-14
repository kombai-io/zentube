import React from 'react';
import { useGetPopularVideosQuery, useGetPopularVideosMultipleQuery } from '../services/youtubeApi';
import { VideoCard } from './VideoCard';
import { VideoGridSkeleton } from './VideoGridSkeleton';
import { ErrorState } from './ErrorState';

interface VideoGridProps {
  maxResults?: number;
  regionCode?: string;
}

export const VideoGrid: React.FC<VideoGridProps> = ({ 
  maxResults = 50, 
  regionCode = 'US' 
}) => {
  // Use different query based on maxResults
  const useMultiplePages = maxResults > 50;
  
  const singlePageQuery = useGetPopularVideosQuery({
    maxResults,
    regionCode,
  }, { skip: useMultiplePages });

  const multiplePageQuery = useGetPopularVideosMultipleQuery({
    maxResults,
    regionCode,
  }, { skip: !useMultiplePages });

  const {
    data: videosResponse,
    isLoading,
    isError,
    error,
  } = useMultiplePages ? multiplePageQuery : singlePageQuery;

  // Extract error message for display
  const getErrorMessage = () => {
    if (!error) return 'Failed to load popular videos';
    
    if ('data' in error && error.data && typeof error.data === 'object') {
      const apiError = error.data as any;
      if (apiError.error?.message) {
        return apiError.error.message;
      }
    } else if ('message' in error && error.message) {
      return error.message;
    }
    
    return 'Failed to load popular videos';
  };

  if (isLoading) {
    return <VideoGridSkeleton count={12} />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load videos"
        message={getErrorMessage()}
        onRetry={() => window.location.reload()}
        showRetryButton={true}
      />
    );
  }

  if (!videosResponse?.items?.length) {
    return (
      <ErrorState
        title="No videos available"
        message="We couldn't find any videos to display right now. Please check back later."
        showRetryButton={false}
      />
    );
  }

  return (
    <div className="px-12 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" style={{ gap: '16px' }}>
        {videosResponse.items.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};