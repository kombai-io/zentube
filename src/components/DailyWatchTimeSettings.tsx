import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Typography } from './Typography';
import TimeInput from './TimeInput';
import { WatchTimeToasts } from './WatchTimeToast';
import { 
  getDigitalWellbeingSettings, 
  updateDailyWatchTimeTarget 
} from '../utils/localStorage';

export default function DailyWatchTimeSettings() {
  const [settings, setSettings] = useState(() => getDigitalWellbeingSettings());
  const [isLoading, setIsLoading] = useState(false);

  const { enabled, hours, minutes } = settings.dailyWatchTimeTarget;

  const handleEnabledChange = async (newEnabled: boolean) => {
    setIsLoading(true);
    const result = updateDailyWatchTimeTarget(newEnabled, hours, minutes);
    
    if (result.success) {
      setSettings(prev => ({
        ...prev,
        dailyWatchTimeTarget: {
          ...prev.dailyWatchTimeTarget,
          enabled: newEnabled,
        },
      }));
      if (newEnabled) {
        WatchTimeToasts.targetSet(hours, minutes);
      } else {
        WatchTimeToasts.targetDisabled();
      }
    } else {
      WatchTimeToasts.nearLimit(0); // Use as error fallback
    }
    setIsLoading(false);
  };

  const handleTimeChange = async (newHours: number, newMinutes: number) => {
    // Update the local state immediately without showing toast
    setSettings(prev => ({
      ...prev,
      dailyWatchTimeTarget: {
        ...prev.dailyWatchTimeTarget,
        hours: newHours,
        minutes: newMinutes,
      },
    }));
    
    // Update localStorage without showing toast
    updateDailyWatchTimeTarget(enabled, newHours, newMinutes);
  };

  const handleTimeBlur = async (newHours: number, newMinutes: number) => {
    setIsLoading(true);
    const result = updateDailyWatchTimeTarget(enabled, newHours, newMinutes);
    
    if (result.success) {
      // Show success toast only on blur when target time is updated
      if (enabled) {
        const totalMinutes = newHours * 60 + newMinutes;
        if (totalMinutes > 0) {
          WatchTimeToasts.targetSet(newHours, newMinutes);
        }
      }
    } else {
      WatchTimeToasts.nearLimit(0); // Use as error fallback
    }
    setIsLoading(false);
  };

  const formatTargetTime = () => {
    if (hours === 0 && minutes === 0) return 'No limit set';
    if (hours === 0) return `${minutes} minutes`;
    if (minutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <Typography 
            as="label" 
            weight="medium" 
            style={{ fontSize: '14px' }}
            className="mb-1"
          >
            Daily Watch Time Target
          </Typography>
          <Typography 
            color="muted-foreground" 
            style={{ fontSize: '14px' }}
          >
            Set a daily limit to help manage your viewing time
          </Typography>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={handleEnabledChange}
          disabled={isLoading}
        />
      </div>

      {enabled && (
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <Typography 
                weight="medium" 
                style={{ fontSize: '14px' }}
                className="mb-1"
              >
                Target time per day
              </Typography>
              <Typography 
                color="muted-foreground" 
                style={{ fontSize: '14px' }}
              >
                Current target: {formatTargetTime()}
              </Typography>
            </div>
            <TimeInput
              hours={hours}
              minutes={minutes}
              onTimeChange={handleTimeChange}
              onTimeBlur={handleTimeBlur}
              disabled={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}