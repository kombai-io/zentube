import React, { useState, useEffect } from 'react';
import { useGetVideoCategoriesQuery } from '../services/youtubeApi';
import { CategoryPill } from './CategoryPill';
import { toast } from 'sonner';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';

interface CategoryPillsProps {
  selectedCategory: { id: string; title: string };
  onCategoryChange: (categoryId: string, title: string) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [api, setApi] = useState<any>();
  
  const {
    data: categoriesResponse,
    isLoading,
    isError,
    error,
  } = useGetVideoCategoriesQuery({ regionCode: 'US' });

  // Create categories array with "All" as first item
  const categories = React.useMemo(() => {
    const allCategory = { id: 'all', title: 'All' };
    const youtubeCategories = categoriesResponse?.items?.map(category => ({
      id: category.id,
      title: category.snippet.title,
    })) || [];
    
    return [allCategory, ...youtubeCategories];
  }, [categoriesResponse]);

  // Update scroll button visibility based on carousel state
  useEffect(() => {
    if (!api) return;

    const updateScrollButtons = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    updateScrollButtons();
    api.on('select', updateScrollButtons);
    api.on('reInit', updateScrollButtons);

    return () => {
      api.off('select', updateScrollButtons);
      api.off('reInit', updateScrollButtons);
    };
  }, [api]);

  // Show error toast when API fails
  useEffect(() => {
    if (isError && error) {
      let errorMessage = 'Failed to load video categories';
      
      // Extract specific error message from API response
      if ('data' in error && error.data && typeof error.data === 'object') {
        const apiError = error.data as any;
        if (apiError.error?.message) {
          errorMessage = apiError.error.message;
        }
      } else if ('message' in error && error.message) {
        errorMessage = error.message;
      }
      
      toast.error('YouTube API Error', {
        description: errorMessage,
        duration: 5000,
      });
    }
  }, [isError, error]);

  const handleCategoryClick = (categoryId: string, title: string) => {
    onCategoryChange(categoryId, title);
  };

  if (isLoading) {
    return (
      <div className="sticky top-0 z-20 bg-background py-3 max-w-full box-border">
        <div className="px-12">
          <div className="flex gap-2">
            {/* Loading skeleton pills with varied widths */}
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className={`h-[34px] bg-muted/50 animate-pulse rounded-full ${
                  index === 0 ? 'w-12' : 
                  index === 1 ? 'w-24' :
                  index === 2 ? 'w-20' :
                  index === 3 ? 'w-16' :
                  index === 4 ? 'w-18' :
                  index === 5 ? 'w-22' :
                  index === 6 ? 'w-14' : 'w-28'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If error or no categories, don't render anything (error toast will show)
  if (isError || categories.length <= 1) {
    return null;
  }

  return (
    <div className="sticky top-0 z-20 bg-background relative py-3 max-w-full box-border">
      <div className="px-12">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            dragFree: true,
            containScroll: "trimSnaps",
            watchDrag: true,
            watchResize: true,
            skipSnaps: false,
            duration: 10,
            slidesToScroll: 3,
          }}
          className="w-full max-w-full"
        >
          <CarouselContent className="-ml-2 max-w-full box-border">
            {categories.map((category) => (
              <CarouselItem key={category.id} className="pl-2 basis-auto flex-shrink-0 min-w-0">
                <CategoryPill
                  title={category.title}
                  isActive={selectedCategory.title === category.title}
                  onClick={() => handleCategoryClick(category.id, category.title)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="w-[30px] h-[30px] ml-2 cursor-pointer text-foreground" />
          <CarouselNext className="w-[30px] h-[30px] mr-2 cursor-pointer text-foreground" />
        </Carousel>
      </div>
    </div>
  );
};