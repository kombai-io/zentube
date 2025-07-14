export const formatViewCount = (viewCount: string): string => {
  const count = parseInt(viewCount);
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)} M views`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(0)}K views`;
  }
  return `${count} views`;
};

export const formatTimeAgo = (publishedAt: string): string => {
  const now = new Date();
  const published = new Date(publishedAt);
  const diffInMs = now.getTime() - published.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInYears = Math.floor(diffInDays / 365);
  
  if (diffInYears >= 1) {
    return `${diffInYears} years ago`;
  } else if (diffInDays >= 1) {
    return `${diffInDays} days ago`;
  } else {
    return 'Today';
  }
};

export const formatDuration = (duration: string): string => {
  // Parse ISO 8601 duration format (PT4M13S)
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '';
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const formatLastActiveTime = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
};

export const formatWatchTime = (minutes: number): string => {
  const flooredMinutes = Math.floor(minutes);
  
  if (flooredMinutes === 0) {
    return 'less than a minute';
  } else if (flooredMinutes === 1) {
    return '1 minute';
  } else if (flooredMinutes < 60) {
    return `${flooredMinutes} minutes`;
  } else {
    const hours = Math.floor(flooredMinutes / 60);
    const remainingMinutes = flooredMinutes % 60;
    
    if (remainingMinutes === 0) {
      return hours === 1 ? '1 hour' : `${hours} hours`;
    } else {
      const hourText = hours === 1 ? '1 hour' : `${hours} hours`;
      const minuteText = remainingMinutes === 1 ? '1 minute' : `${remainingMinutes} minutes`;
      return `${hourText} and ${minuteText}`;
    }
  }
};

export const formatWatchTimeShort = (minutes: number): string => {
  const flooredMinutes = Math.floor(minutes);
  
  if (flooredMinutes === 0) {
    return '0 mins';
  } else if (flooredMinutes < 60) {
    return `${flooredMinutes} mins`;
  } else {
    const hours = Math.floor(flooredMinutes / 60);
    const remainingMinutes = flooredMinutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} hrs`;
    } else {
      return `${hours} hrs ${remainingMinutes} mins`;
    }
  }
};