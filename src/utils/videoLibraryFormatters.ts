import { VideoLibraryType } from '../types/videoLibrary';

export const formatViewCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const years = Math.floor(diffInSeconds / (365 * 24 * 3600));
  const months = Math.floor(diffInSeconds / (30 * 24 * 3600));
  const days = Math.floor(diffInSeconds / (24 * 3600));
  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor(diffInSeconds / 60);
  
  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};

export const formatDuration = (duration: string): string => {
  // Convert ISO 8601 duration (PT23M45S) to readable format (23:45)
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const getPageTitle = (type: VideoLibraryType): string => {
  switch (type) {
    case VideoLibraryType.HISTORY:
      return 'History';
    case VideoLibraryType.WATCH_LATER:
      return 'Watch Later';
    case VideoLibraryType.LIKED_VIDEOS:
      return 'Liked videos';
    default:
      return 'Videos';
  }
};

export const getEmptyStateMessage = (type: VideoLibraryType): { title: string; description: string } => {
  switch (type) {
    case VideoLibraryType.HISTORY:
      return {
        title: 'No videos in your history',
        description: 'Videos you watch will appear here'
      };
    case VideoLibraryType.WATCH_LATER:
      return {
        title: 'No videos saved to watch later',
        description: 'Save videos to watch them later'
      };
    case VideoLibraryType.LIKED_VIDEOS:
      return {
        title: 'No liked videos yet',
        description: 'Videos you like will appear here'
      };
    default:
      return {
        title: 'No videos found',
        description: 'Start exploring to build your collection'
      };
  }
};