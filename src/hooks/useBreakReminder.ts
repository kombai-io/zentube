import { useEffect, useRef, useCallback, createElement } from 'react';
import { toast } from 'sonner';
import { getDigitalWellbeingSettings } from '../utils/localStorage';
import BreakReminderToast from '../components/BreakReminderToast';

interface UseBreakReminderProps {
  isPlaying: boolean;
  onPauseVideo: () => void;
}

export const useBreakReminder = ({ isPlaying, onPauseVideo }: UseBreakReminderProps) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastBreakTimeRef = useRef<number>(Date.now());
  const snoozeTimeRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const showBreakReminder = useCallback(() => {
    // Pause the video
    onPauseVideo();

    const handleDismiss = () => {
      lastBreakTimeRef.current = Date.now();
      snoozeTimeRef.current = null;
      toast.dismiss();
    };

    const handleSnooze = () => {
      snoozeTimeRef.current = Date.now() + (5 * 60 * 1000); // 5 minutes from now
      toast.dismiss();
    };

    // Show the break reminder toast
    toast.custom(
      () => createElement(BreakReminderToast, {
        onDismiss: handleDismiss,
        onSnooze: handleSnooze,
      }),
      {
        duration: Infinity, // Keep it open until user interacts
        position: 'top-center',
      }
    );
  }, [onPauseVideo]);

  const startTimer = useCallback(() => {
    const settings = getDigitalWellbeingSettings();
    
    if (!settings.takeABreakReminder.enabled) {
      return;
    }

    clearTimer();

    const intervalMs = settings.takeABreakReminder.intervalMinutes * 60 * 1000;
    const now = Date.now();
    
    // Check if we're in snooze period
    if (snoozeTimeRef.current && now < snoozeTimeRef.current) {
      const remainingSnoozeTime = snoozeTimeRef.current - now;
      timerRef.current = setTimeout(() => {
        snoozeTimeRef.current = null;
        startTimer();
      }, remainingSnoozeTime);
      return;
    }

    // Calculate time since last break
    const timeSinceLastBreak = now - lastBreakTimeRef.current;
    
    if (timeSinceLastBreak >= intervalMs) {
      // Show reminder immediately if enough time has passed
      showBreakReminder();
    } else {
      // Set timer for remaining time
      const remainingTime = intervalMs - timeSinceLastBreak;
      timerRef.current = setTimeout(showBreakReminder, remainingTime);
    }
  }, [clearTimer, showBreakReminder]);

  // Start/stop timer based on playing state
  useEffect(() => {
    if (isPlaying) {
      startTimer();
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [isPlaying, startTimer, clearTimer]);

  // Listen for settings changes
  useEffect(() => {
    const handleStorageChange = (event: CustomEvent) => {
      if (event.detail.key === 'zentube_digital_wellbeing_settings') {
        if (isPlaying) {
          startTimer();
        }
      }
    };

    window.addEventListener('zentubeStorageChange', handleStorageChange as EventListener);
    
    return () => {
      window.removeEventListener('zentubeStorageChange', handleStorageChange as EventListener);
    };
  }, [isPlaying, startTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);
};