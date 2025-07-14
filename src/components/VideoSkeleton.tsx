import { Skeleton } from './ui/skeleton';

export const VideoSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-3">
      {/* Thumbnail skeleton */}
      <Skeleton className="w-full aspect-video rounded-lg bg-muted" />
      
      {/* Content skeleton */}
      <div className="flex gap-3">
        {/* Avatar skeleton */}
        <Skeleton className="w-8 h-8 rounded-full flex-shrink-0 bg-muted" />
        
        {/* Text content skeleton */}
        <div className="flex flex-col gap-2 flex-1">
          {/* Title skeleton - 2 lines */}
          <Skeleton className="h-4 w-full bg-muted" />
          <Skeleton className="h-4 w-3/4 bg-muted" />
          
          {/* Channel name skeleton */}
          <Skeleton className="h-3 w-1/2 bg-muted" />
          
          {/* Metadata skeleton */}
          <Skeleton className="h-3 w-2/3 bg-muted" />
        </div>
      </div>
    </div>
  );
};