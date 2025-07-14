import React from 'react';
import { CategoryPills } from './CategoryPills';
import { VideoGridWithCategory } from './VideoGridWithCategory';
import { useVideoCategory } from '../hooks/useVideoCategory';
import { useDocumentTitle, getPageTitle } from '../hooks/useDocumentTitle';

interface VideoContainerProps {
  regionCode?: string;
}

export const VideoContainer: React.FC<VideoContainerProps> = ({ 
  regionCode = 'US' 
}) => {
  // Set document title for home page
  useDocumentTitle(getPageTitle('home'));
  const {
    selectedCategory,
    handleCategoryChange,
    videosData,
    isLoading,
    isError,
    error,
  } = useVideoCategory(regionCode);

  return (
    <div className="flex flex-col">
      <CategoryPills 
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      <VideoGridWithCategory
        videosData={videosData}
        isLoading={isLoading}
        isError={isError}
        error={error}
        selectedCategory={selectedCategory}
      />
    </div>
  );
};