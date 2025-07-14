import { toast } from 'sonner';
import { formatWatchTime, formatWatchTimeShort } from '../utils/formatters';

export type ToastVariant = 'success' | 'warning' | 'danger';

interface WatchTimeToastOptions {
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
}

export const showWatchTimeToast = ({ 
  variant, 
  title, 
  description, 
  duration = 4000 
}: WatchTimeToastOptions) => {
  const toastOptions = {
    duration,
    description,
  };

  switch (variant) {
    case 'success':
      return toast.success(title, toastOptions);
    case 'warning':
      return toast.warning(title, toastOptions);
    case 'danger':
      return toast.error(title, toastOptions);
    default:
      return toast(title, toastOptions);
  }
};

// Predefined toast messages for watch time scenarios
export const WatchTimeToasts = {
  nearLimit: (remainingMinutes: number) => 
    showWatchTimeToast({
      variant: 'warning',
      title: `You have ${formatWatchTime(remainingMinutes)} of watchtime left today`,
      description: 'Consider taking a break soon to stay within your daily target.',
      duration: 6000,
    }),

  limitReached: () => 
    showWatchTimeToast({
      variant: 'danger',
      title: 'Daily watch time limit reached',
      description: 'You\'ve reached your daily viewing target. Video has been paused.',
      duration: 8000,
    }),

  overLimitWarning: (overLimitMinutes: number) => 
    showWatchTimeToast({
      variant: 'danger',
      title: 'You\'ve exceeded your daily limit',
      description: `You've watched ${formatWatchTime(overLimitMinutes)} more than your target. Consider taking a break.`,
      duration: 10000,
    }),

  targetSet: (hours: number, minutes: number) => {
    const totalMinutes = (hours * 60) + minutes;
    const timeString = formatWatchTimeShort(totalMinutes);
    return showWatchTimeToast({
      variant: 'success',
      title: `Daily target set to ${timeString}`,
      description: 'Your watch time will be tracked throughout the day.',
    });
  },

  targetDisabled: () => 
    showWatchTimeToast({
      variant: 'success',
      title: 'Daily watch time target disabled',
      description: 'Your viewing time will no longer be limited.',
    }),

  dailyReset: () => 
    showWatchTimeToast({
      variant: 'success',
      title: 'Daily watch time reset',
      description: 'Your watch time counter has been reset for today.',
      duration: 3000,
    }),
};