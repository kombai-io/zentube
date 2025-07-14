import { Button } from '@/components/ui/button';
import { formatLikeCount } from '../utils/videoFormatters';
import { Typography } from './Typography';
import ThumbsUpIcon from '../assets/icons/thumbs-up.svg';
import ThumbsDownIcon from '../assets/icons/thumbs-down.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useLikedVideos, useWatchLater } from '../hooks/useLocalStorage';
import { toast } from 'sonner';

interface EngagementButtonsProps {
  videoId: string;
  likeCount: number;
  dislikeCount: number;
  videoTitle: string;
  channelTitle: string;
  thumbnail: string;
  viewCount: number;
  description?: string;
}

export default function EngagementButtons({ 
  videoId,
  likeCount, 
  dislikeCount,
  videoTitle,
  channelTitle,
  thumbnail,
  viewCount,
  description = ''
}: EngagementButtonsProps) {
  const { isLiked, toggleVideo: toggleLike } = useLikedVideos();
  const { isInList: isInWatchLater, toggleVideo: toggleWatchLater } = useWatchLater();
  
  const isVideoLiked = isLiked(videoId);
  const isVideoInWatchLater = isInWatchLater(videoId);

  const handleLike = () => {
    const videoData = {
      id: videoId,
      title: videoTitle,
      channelTitle,
      thumbnail,
      viewCount,
      description,
      addedAt: new Date()
    };

    const result = toggleLike(videoId, videoData);
    if (result.success) {
      if (isVideoLiked) {
        toast.success('Removed from liked videos');
      } else {
        toast.success('Added to liked videos');
      }
    } else {
      toast.error('Failed to update liked videos');
    }
  };

  const handleWatchLater = () => {
    const videoData = {
      id: videoId,
      title: videoTitle,
      channelTitle,
      thumbnail,
      viewCount,
      description,
      addedAt: new Date()
    };

    const result = toggleWatchLater(videoId, videoData);
    if (result.success) {
      if (isVideoInWatchLater) {
        toast.success('Removed from watch later');
      } else {
        toast.success('Added to watch later');
      }
    } else {
      toast.error('Failed to update watch later');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        className={`flex items-center gap-2 text-white hover:bg-secondary/20 p-2 cursor-pointer ${
          isVideoLiked ? 'bg-secondary/30' : ''
        }`}
      >
        <ThumbsUpIcon 
          width={18} 
          height={17} 
          color={isVideoLiked ? "#3b82f6" : "var(--foreground)"} 
        />
        <Typography 
          variant="base" 
          weight="bold" 
          color="foreground" 
          className="uppercase"
        >
          {formatLikeCount(likeCount)}
        </Typography>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 text-white hover:bg-secondary/20 p-2 cursor-pointer opacity-50 cursor-not-allowed"
        disabled
      >
        <ThumbsDownIcon width={18} height={17} color="var(--foreground)" />
        <Typography 
          variant="base" 
          weight="bold" 
          color="foreground" 
          className="uppercase"
        >
          {formatLikeCount(dislikeCount)}
        </Typography>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleWatchLater}
        className={`flex items-center gap-2 text-white hover:bg-secondary/20 p-2 cursor-pointer ${
          isVideoInWatchLater ? 'bg-secondary/30' : ''
        }`}
      >
        <FontAwesomeIcon 
          icon={isVideoInWatchLater ? faCheck : faClock}
          style={{ 
            width: '18px', 
            height: '18px', 
            color: isVideoInWatchLater ? "#10b981" : "var(--foreground)" 
          }}
        />
        <Typography 
          variant="base" 
          weight="bold" 
          color="foreground" 
          className="uppercase"
        >
          {isVideoInWatchLater ? 'WATCH LATER' : 'WATCH LATER'}
        </Typography>
      </Button>
    </div>
  );
}