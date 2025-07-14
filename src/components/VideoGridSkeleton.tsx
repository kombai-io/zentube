import { VideoSkeleton } from './VideoSkeleton';

interface VideoGridSkeletonProps {
  count?: number;
}

export const VideoGridSkeleton: React.FC<VideoGridSkeletonProps> = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-12 py-6">
      {Array.from({ length: count }).map((_, index) => (
        <VideoSkeleton key={index} />
      ))}
    </div>
  );
};