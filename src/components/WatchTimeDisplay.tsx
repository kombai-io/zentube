import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { Typography } from './Typography';
import { getTodayWatchTimeMinutes, getWatchTimeStatus } from '../utils/localStorage';
import { formatWatchTimeShort } from '../utils/formatters';

interface WatchTimeDisplayProps {
  isPlaying?: boolean;
}

export default function WatchTimeDisplay({ isPlaying = false }: WatchTimeDisplayProps) {
  const [watchTime, setWatchTime] = useState(0);
  const [status, setStatus] = useState(() => getWatchTimeStatus());

  // Calculate derived values early
  const isOverLimit = status.hasReachedLimit;
  const displayTime = formatWatchTimeShort(watchTime);
  const targetTime = formatWatchTimeShort(status.targetMinutes);

  useEffect(() => {
    const updateWatchTime = () => {
      const currentTime = getTodayWatchTimeMinutes();
      const currentStatus = getWatchTimeStatus();
      setWatchTime(currentTime);
      setStatus(currentStatus);
    };

    // Update immediately
    updateWatchTime();

    // Update every 10 seconds for more responsive display
    const interval = setInterval(updateWatchTime, 10000);

    // Also listen for storage changes to update immediately when video is paused or settings change
    const handleStorageChange = (event: CustomEvent) => {
      if (event.detail.key === 'zentube_daily_watch_time' || 
          event.detail.key === 'zentube_digital_wellbeing_settings') {
        updateWatchTime();
      }
    };

    // Listen for custom storage events
    window.addEventListener('zentubeStorageChange', handleStorageChange as EventListener);

    return () => {
      clearInterval(interval);
      window.removeEventListener('zentubeStorageChange', handleStorageChange as EventListener);
    };
  }, []);

  // Debug: Log the playing state
  useEffect(() => {
    console.log('WatchTimeDisplay - isPlaying:', isPlaying, 'isOverLimit:', isOverLimit);
  }, [isPlaying, isOverLimit]);

  if (!status.isTargetEnabled) {
    return null; // Don't show timer if no target is set
  }

  // Define colors based on limit status
  const iconColor = isOverLimit ? 'rgb(239 68 68)' : 'rgb(34 197 94)'; // red-500 : green-500
  const textColor = isOverLimit ? 'rgb(239 68 68)' : 'rgb(34 197 94)'; // red-500 : green-500
  
  const containerClasses = isOverLimit 
    ? "flex items-center gap-3 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800"
    : "flex items-center gap-3 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800";

  return (
    <div className={containerClasses}>
      {/* Clock icon */}
      <FontAwesomeIcon 
        icon={faClock} 
        style={{ 
          width: '16px', 
          height: '16px',
          color: iconColor
        }}
      />
      
      {/* Time display */}
      <Typography 
        variant="small"
        weight="medium"
        style={{ 
          fontSize: '14px',
          color: textColor
        }}
      >
        {displayTime} / {targetTime}
      </Typography>
      
      {/* Yellow blinking dot when playing and under target */}
      {isPlaying && !isOverLimit && (
        <div 
          className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" 
          style={{ backgroundColor: '#eab308' }} // Ensure yellow color
        />
      )}
      
      {/* Red blinking dot when over limit (regardless of playing state) */}
      {isOverLimit && (
        <div 
          className="w-2 h-2 bg-red-500 rounded-full animate-pulse"
          style={{ backgroundColor: '#ef4444' }} // Ensure red color
        />
      )}
    </div>
  );
}