import React from 'react';
import { VideoCard } from './VideoCard';
import { VideoGridSkeleton } from './VideoGridSkeleton';
import { ErrorState } from './ErrorState';
import { YouTubeVideosResponse } from '../types/youtube';

interface VideoGridWithCategoryProps {
  videosData?: YouTubeVideosResponse;
  isLoading: boolean;
  isError: boolean;
  error?: any;
  selectedCategory: { id: string; title: string };
}

export const VideoGridWithCategory: React.FC<VideoGridWithCategoryProps> = ({ 
  videosData,
  isLoading,
  isError,
  error,
  selectedCategory,
}) => {
  // Extract error message for display
  const getErrorMessage = () => {
    if (!error) return 'Failed to load videos';
    
    if ('data' in error && error.data && typeof error.data === 'object') {
      const apiError = error.data as any;
      if (apiError.error?.message) {
        return apiError.error.message;
      }
    } else if ('message' in error && error.message) {
      return error.message;
    } else if ('error' in error && typeof error.error === 'string') {
      return error.error;
    }
    
    return 'Failed to load videos';
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

  if (!videosData?.items?.length) {
    const isAllCategory = selectedCategory.id === 'all';
    return (
      <ErrorState
        title="No videos available"
        message={
          isAllCategory 
            ? "We couldn't find any videos to display right now. Please check back later."
            : `No videos found in the "${selectedCategory.title}" category. Try selecting a different category.`
        }
        showRetryButton={false}
      />
    );
  }

  return (
    <div className="px-12 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" style={{ gap: '16px' }}>
        {videosData.items.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};