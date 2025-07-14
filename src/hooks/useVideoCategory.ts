import { useState, useCallback, useEffect, useRef } from 'react';
import { useGet200VideosByCategoryQuery, useGetPopularVideosMultipleQuery } from '../services/youtubeApi';

export interface CategoryState {
  id: string;
  title: string;
}

export const useVideoCategory = (regionCode: string = 'US') => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryState>({
    id: 'all',
    title: 'All'
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const previousCategoryRef = useRef<string>('all');

  // Use different queries based on category selection
  const isAllCategory = selectedCategory.id === 'all';
  
  // Query for all popular videos (when "All" is selected)
  const allVideosQuery = useGetPopularVideosMultipleQuery({
    maxResults: 200,
    regionCode,
  }, { skip: !isAllCategory });

  // Query for specific category videos
  const categoryVideosQuery = useGet200VideosByCategoryQuery({
    categoryId: selectedCategory.id,
    regionCode,
  }, { skip: isAllCategory });

  // Get the appropriate query result
  const activeQuery = isAllCategory ? allVideosQuery : categoryVideosQuery;

  // Handle transition state based on category changes and query status
  useEffect(() => {
    const currentCategoryId = selectedCategory.id;
    const previousCategoryId = previousCategoryRef.current;
    
    // If category changed, we're transitioning
    if (currentCategoryId !== previousCategoryId) {
      setIsTransitioning(true);
      previousCategoryRef.current = currentCategoryId;
    }
    
    // If we have data or an error, transition is complete
    if (activeQuery.data || activeQuery.isError) {
      setIsTransitioning(false);
    }
  }, [selectedCategory.id, activeQuery.data, activeQuery.isError]);

  const handleCategoryChange = useCallback((categoryId: string, title: string) => {
    setSelectedCategory({ id: categoryId, title });
  }, []);

  // Show loading if query is loading OR we're transitioning between categories
  const isLoading = activeQuery.isLoading || (isTransitioning && !activeQuery.data);

  return {
    selectedCategory,
    handleCategoryChange,
    videosData: activeQuery.data,
    isLoading,
    isError: activeQuery.isError,
    error: activeQuery.error,
  };
};