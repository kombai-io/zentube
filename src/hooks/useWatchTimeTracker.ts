import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  addWatchTime, 
  getWatchTimeStatus,
  getDailyWatchTime 
} from '../utils/localStorage';
import { WatchTimeToasts } from '../components/WatchTimeToast';

interface UseWatchTimeTrackerProps {
  isPlaying: boolean;
  onPauseVideo?: () => void;
}

interface WatchTimeStatus {
  totalMinutes: number;
  targetMinutes: number;
  remainingMinutes: number;
  isTargetEnabled: boolean;
  hasReachedLimit: boolean;
  isNearLimit: boolean;
}

export const useWatchTimeTracker = ({ 
  isPlaying, 
  onPauseVideo 
}: UseWatchTimeTrackerProps) => {
  const [watchTimeStatus, setWatchTimeStatus] = useState<WatchTimeStatus>(() => 
    getWatchTimeStatus()
  );
  
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const overLimitIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasShownNearLimitWarning = useRef(false);
  const hasShownLimitReached = useRef(false);
  const lastOverLimitWarningTime = useRef<number>(0);

  // Update watch time status
  const updateStatus = useCallback(() => {
    const newStatus = getWatchTimeStatus();
    setWatchTimeStatus(newStatus);
    return newStatus;
  }, []);

  // Add watch time and check limits
  const addTimeAndCheckLimits = useCallback((minutesToAdd: number) => {
    if (minutesToAdd <= 0) return false;

    // Add the watch time immediately
    const result = addWatchTime(minutesToAdd);
    
    if (!result.success) {
      console.error('Failed to save watch time:', result.error);
      return false;
    }
    
    // Get updated status
    const status = updateStatus();
    
    // Check for warnings and limits
    if (status.isTargetEnabled) {
      // Show near limit warning only when exactly 1 minute remaining (only once per day)
      if (status.remainingMinutes <= 1 && status.remainingMinutes > 0 && !hasShownNearLimitWarning.current) {
        WatchTimeToasts.nearLimit(status.remainingMinutes);
        hasShownNearLimitWarning.current = true;
      }
      
      // Check if limit reached for the first time
      if (status.hasReachedLimit && !hasShownLimitReached.current) {
        WatchTimeToasts.limitReached();
        hasShownLimitReached.current = true;
        lastOverLimitWarningTime.current = Date.now();
        
        // Don't pause automatically, just show the warning
        return true; // Indicate that limit was reached
      }
    }
    
    return false;
  }, [updateStatus]);

  // Calculate and store elapsed time immediately
  const calculateAndStoreElapsedTime = useCallback(() => {
    if (startTimeRef.current) {
      const currentTime = Date.now();
      const elapsedMinutes = (currentTime - startTimeRef.current) / (1000 * 60);
      
      if (elapsedMinutes >= 0.05) { // Only track if at least 3 seconds have passed
        addTimeAndCheckLimits(elapsedMinutes);
        startTimeRef.current = currentTime; // Reset start time
      }
    }
  }, [addTimeAndCheckLimits]);

  // Check for over-limit warnings
  const checkOverLimitWarning = useCallback(() => {
    const status = getWatchTimeStatus();
    if (status.isTargetEnabled && status.hasReachedLimit && status.totalMinutes > status.targetMinutes) {
      const overLimitMinutes = status.totalMinutes - status.targetMinutes;
      const currentTime = Date.now();
      
      // Show warning every minute (60000ms) after exceeding limit, but only when playing
      if (isPlaying && currentTime - lastOverLimitWarningTime.current >= 60000) {
        console.log('Showing over-limit warning:', overLimitMinutes, 'minutes over');
        WatchTimeToasts.overLimitWarning(overLimitMinutes);
        lastOverLimitWarningTime.current = currentTime;
      }
    }
  }, [isPlaying]);

  // Handle play/pause state changes
  useEffect(() => {
    if (isPlaying) {
      // Check if already at limit before starting
      const currentStatus = getWatchTimeStatus();
      if (currentStatus.isTargetEnabled && currentStatus.hasReachedLimit) {
        // Show initial warning if not shown
        if (!hasShownLimitReached.current) {
          WatchTimeToasts.limitReached();
          hasShownLimitReached.current = true;
          lastOverLimitWarningTime.current = Date.now();
        }
      }

      // Start tracking time
      startTimeRef.current = Date.now();
      
      // Set up interval to track time every 10 seconds
      intervalRef.current = setInterval(() => {
        calculateAndStoreElapsedTime();
      }, 10000); // Check every 10 seconds
      
    } else {
      // Video paused or stopped - immediately record any remaining time
      if (startTimeRef.current) {
        const currentTime = Date.now();
        const elapsedMinutes = (currentTime - startTimeRef.current) / (1000 * 60);
        
        if (elapsedMinutes >= 0.05) { // Track even small amounts when pausing (3+ seconds)
          addTimeAndCheckLimits(elapsedMinutes);
        }
        
        startTimeRef.current = null;
      }
      
      // Clear tracking interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, calculateAndStoreElapsedTime, addTimeAndCheckLimits]);

  // Separate interval for over-limit warnings (runs only when playing)
  useEffect(() => {
    if (isPlaying) {
      // Set up interval for over-limit warnings every minute, but only when playing
      overLimitIntervalRef.current = setInterval(() => {
        console.log('Checking for over-limit warning while playing...');
        checkOverLimitWarning();
      }, 60000); // Check every minute
    } else {
      // Clear over-limit interval when not playing
      if (overLimitIntervalRef.current) {
        clearInterval(overLimitIntervalRef.current);
        overLimitIntervalRef.current = null;
      }
    }

    return () => {
      if (overLimitIntervalRef.current) {
        clearInterval(overLimitIntervalRef.current);
      }
    };
  }, [isPlaying, checkOverLimitWarning]);

  // Reset daily flags when date changes
  useEffect(() => {
    const checkDailyReset = () => {
      const currentData = getDailyWatchTime();
      const today = new Date().toISOString().split('T')[0];
      
      if (currentData.date === today) {
        // Reset warning flags for new day
        hasShownNearLimitWarning.current = false;
        hasShownLimitReached.current = false;
        lastOverLimitWarningTime.current = 0;
        updateStatus();
      }
    };

    // Check immediately
    checkDailyReset();
    
    // Set up interval to check for date change every minute
    const dateCheckInterval = setInterval(checkDailyReset, 60000);
    
    return () => clearInterval(dateCheckInterval);
  }, [updateStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      if (overLimitIntervalRef.current) {
        clearInterval(overLimitIntervalRef.current);
      }
      
      // Record any remaining time when component unmounts
      if (startTimeRef.current && isPlaying) {
        const currentTime = Date.now();
        const elapsedMinutes = (currentTime - startTimeRef.current) / (1000 * 60);
        
        if (elapsedMinutes >= 0.05) {
          addWatchTime(elapsedMinutes);
        }
      }
    };
  }, [isPlaying]);

  return {
    watchTimeStatus,
    updateStatus,
    isPlaying, // Expose playing state for UI indicators
  };
};