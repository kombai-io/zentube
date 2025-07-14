import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { VideoItemData } from '../types/videoLibrary';
import { formatViewCount, formatTimeAgo, formatDuration } from '../utils/videoLibraryFormatters';
import VideoItemMenu from './VideoItemMenu';
import { useVideoNavigation } from '../hooks/useVideoNavigation';
import { Typography } from './Typography';

interface VideoItemProps {
  video: VideoItemData;
  onDelete: (videoId: string) => void;
}

export default function VideoItem({ video, onDelete }: VideoItemProps) {
  const { navigateToVideo } = useVideoNavigation();

  const handleVideoClick = () => {
    // Prepare video data for history storage
    const videoData = {
      title: video.title,
      channelTitle: video.channelTitle,
      thumbnail: video.thumbnail,
      viewCount: video.viewCount,
      description: video.description || ''
    };
    
    navigateToVideo(video.id, videoData);
  };

  const handleDelete = () => {
    onDelete(video.id);
  };

  return (
    <Card className="bg-transparent border-0 shadow-none p-0">
      <CardContent className="p-0">
        <div className="flex gap-4">
          {/* Video Thumbnail */}
          <div className="flex-shrink-0 cursor-pointer" onClick={handleVideoClick} style={{ width: '320px', height: '180px' }}>
            <div className="bg-muted rounded-lg overflow-hidden w-full h-full">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-full object-cover"
              />
              {/* Duration overlay */}
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                {formatDuration(video.duration)}
              </div>
            </div>
          </div>

          {/* Video Info */}
          <div className="flex-1 min-w-0 cursor-pointer" onClick={handleVideoClick}>
            <Typography 
              as="h3" 
              className="line-clamp-2 mb-1"
              style={{ fontSize: '18px', fontWeight: 'medium', color: 'var(--foreground)' }}
            >
              {video.title}
            </Typography>
            <Typography 
              className="mb-1"
              style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}
            >
              {video.channelTitle}
            </Typography>
            <div className="flex items-center gap-1">
              <Typography 
                style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}
              >
                {formatViewCount(video.viewCount)} views
              </Typography>
            </div>
          </div>

          {/* Three dot menu */}
          <div className="flex-shrink-0 self-start">
            <VideoItemMenu onDelete={handleDelete} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}