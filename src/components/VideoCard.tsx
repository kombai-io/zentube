import React from 'react';
import { Card } from './ui/card';
import { ChannelAvatar } from './ChannelAvatar';
import { Typography } from './Typography';
import { formatViewCount, formatTimeAgo } from '../utils/formatters';
import { YouTubeVideo } from '../types/youtube';
import { useVideoNavigation } from '../hooks/useVideoNavigation';
import VerificationBadgeIcon from './icons/VerificationBadge.svg';
import DotSeparatorIcon from './icons/DotSeparator.svg';

interface VideoCardProps {
  video: YouTubeVideo;
  isPlaylist?: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, isPlaylist = false }) => {
  const { snippet, statistics } = video;
  const { navigateToVideo } = useVideoNavigation();
  
  // Generate avatar URL using a service like pravatar.cc based on channel ID
  const getAvatarUrl = (channelId: string) => {
    // Use a hash of the channel ID to get consistent avatars
    const hash = channelId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const avatarId = Math.abs(hash) % 70 + 1; // pravatar has 70 different avatars
    return `https://i.pravatar.cc/150?img=${avatarId}`;
  };

  // Check if channel is verified (in real app, this would come from API)
  // For now, we'll use a simple heuristic based on subscriber count or channel features
  const isVerified = parseInt(statistics.viewCount) > 100000; // Channels with high view counts are likely verified

  const handleVideoClick = () => {
    // Prepare video data for history storage
    const videoData = {
      title: snippet.title,
      channelTitle: snippet.channelTitle,
      thumbnail: snippet.thumbnails.high?.url || snippet.thumbnails.medium.url,
      viewCount: parseInt(statistics.viewCount),
      description: snippet.description || ''
    };
    
    navigateToVideo(video.id, videoData);
  };

  return (
    <Card 
      className="bg-transparent border-none shadow-none p-0 cursor-pointer hover:bg-muted/5 transition-colors duration-200"
      onClick={handleVideoClick}
    >
      <div className="flex flex-col gap-3">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <img
            src={snippet.thumbnails.high?.url || snippet.thumbnails.medium.url}
            alt={snippet.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex gap-3">
          {/* Channel Avatar */}
          <ChannelAvatar
            channelTitle={snippet.channelTitle}
            avatarUrl={getAvatarUrl(snippet.channelId)}
            size="sm"
          />

          {/* Video Info */}
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            {/* Title */}
            <Typography 
              as="h3" 
              variant="video-title" 
              weight="semibold" 
              className="line-clamp-2 leading-tight"
            >
              {snippet.title}
            </Typography>

            {/* Channel Name with Verification */}
            <div className="flex items-center gap-1">
              <Typography 
                variant="base" 
                color="muted-foreground" 
                className="truncate"
              >
                {snippet.channelTitle}
              </Typography>
              {isVerified && (
                <VerificationBadgeIcon 
                  width={10} 
                  height={10} 
                  className="text-muted-foreground flex-shrink-0"
                />
              )}
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-1">
              <Typography variant="base" color="muted-foreground">
                {formatViewCount(statistics.viewCount)}
              </Typography>
              <DotSeparatorIcon 
                width={3} 
                height={3} 
                className="text-muted-foreground"
              />
              <Typography variant="base" color="muted-foreground">
                {formatTimeAgo(snippet.publishedAt)}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};