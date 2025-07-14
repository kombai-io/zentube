import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faClock, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useLikedVideos, useWatchLater } from '../hooks/useLocalStorage';
import { toast } from 'sonner';
import type { StoredVideoData } from '../types/localStorage';

interface VideoActionMenuProps {
  videoId: string;
  videoData: StoredVideoData;
}

export default function VideoActionMenu({ videoId, videoData }: VideoActionMenuProps) {
  const { isLiked, toggleVideo: toggleLike } = useLikedVideos();
  const { isInList: isInWatchLater, toggleVideo: toggleWatchLater } = useWatchLater();

  const isVideoLiked = isLiked(videoId);
  const isVideoInWatchLater = isInWatchLater(videoId);

  const handleAddToWatchLater = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleAddToLikedVideos = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 h-8 w-8 hover:bg-secondary/50"
            onClick={(e) => e.stopPropagation()}
          >
            <FontAwesomeIcon 
              icon={faEllipsisV} 
              style={{ 
                width: '12px', 
                height: '12px',
                color: 'var(--muted-foreground)'
              }}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem onClick={handleAddToWatchLater} className="cursor-pointer">
            <FontAwesomeIcon 
              icon={faClock} 
              style={{ 
                width: '14px', 
                height: '14px',
                marginRight: '8px',
                color: isVideoInWatchLater ? '#10b981' : 'var(--foreground)'
              }}
            />
            {isVideoInWatchLater ? 'Remove from Watch Later' : 'Add to Watch Later'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleAddToLikedVideos} className="cursor-pointer">
            <FontAwesomeIcon 
              icon={faHeart} 
              style={{ 
                width: '14px', 
                height: '14px',
                marginRight: '8px',
                color: isVideoLiked ? '#ef4444' : 'var(--foreground)'
              }}
            />
            {isVideoLiked ? 'Remove from Liked Videos' : 'Add to Liked Videos'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}