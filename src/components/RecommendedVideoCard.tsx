import { formatViewCount, formatTimeAgo, formatDuration } from '../utils/videoFormatters';
import { RecommendedVideo } from '../types/video';
import { Typography } from './Typography';
import { useVideoNavigation } from '../hooks/useVideoNavigation';

interface RecommendedVideoCardProps {
  video: RecommendedVideo;
  onClick?: () => void;
}

export default function RecommendedVideoCard({ video, onClick }: RecommendedVideoCardProps) {
  const { navigateToVideo } = useVideoNavigation();

  const handleVideoClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Prepare video data for history storage
      const videoData = {
        title: video.title,
        channelTitle: video.channelTitle,
        thumbnail: video.thumbnail,
        viewCount: video.viewCount,
        description: '' // RecommendedVideo doesn't have description field
      };
      
      navigateToVideo(video.id, videoData);
    }
  };
  return (
    <div 
      className="flex gap-3 cursor-pointer hover:bg-secondary/10 p-2 rounded-lg transition-colors"
      onClick={handleVideoClick}
    >
      <div className="relative flex-shrink-0">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-42 h-24 object-cover rounded-lg"
        />
        <div className="absolute bottom-1 right-1 bg-black/80 text-white px-1 py-0.5 rounded">
          <Typography 
            variant="small" 
            weight="normal" 
            color="foreground"
            style={{ color: 'white' }}
          >
            {formatDuration(video.duration)}
          </Typography>
        </div>
      </div>
      
      <div className="flex-1 space-y-1">
        <Typography 
          as="h3" 
          variant="video-title" 
          weight="normal" 
          color="foreground" 
          className="leading-5 line-clamp-2"
        >
          {video.title}
        </Typography>
        <div className="space-y-0.5">
          <Typography 
            variant="settings-description" 
            weight="normal" 
            color="muted-foreground"
          >
            {video.channelTitle}
          </Typography>
          <Typography 
            variant="settings-description" 
            weight="normal" 
            color="muted-foreground"
          >
            {formatViewCount(video.viewCount)} . {formatTimeAgo(video.publishedAt)}
          </Typography>
        </div>
      </div>
    </div>
  );
}