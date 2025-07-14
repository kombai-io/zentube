import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { Typography } from './Typography';
import { 
  getDigitalWellbeingSettings, 
  setDigitalWellbeingSettings 
} from '../utils/localStorage';

export default function TakeABreakSettings() {
  const [settings, setSettings] = useState(() => getDigitalWellbeingSettings());
  const [isLoading, setIsLoading] = useState(false);

  // Provide fallback values if takeABreakReminder is undefined (for backward compatibility)
  const takeABreakSettings = settings.takeABreakReminder || {
    enabled: false,
    intervalMinutes: 30,
  };
  
  const { enabled, intervalMinutes } = takeABreakSettings;

  const handleEnabledChange = async (newEnabled: boolean) => {
    setIsLoading(true);
    
    const newSettings = {
      ...settings,
      takeABreakReminder: {
        ...takeABreakSettings,
        enabled: newEnabled,
      },
    };

    const result = setDigitalWellbeingSettings(newSettings);
    
    if (result.success) {
      setSettings(newSettings);
    }
    
    setIsLoading(false);
  };

  const handleIntervalChange = async (newInterval: string) => {
    setIsLoading(true);
    
    const newSettings = {
      ...settings,
      takeABreakReminder: {
        ...takeABreakSettings,
        intervalMinutes: parseInt(newInterval, 10),
      },
    };

    const result = setDigitalWellbeingSettings(newSettings);
    
    if (result.success) {
      setSettings(newSettings);
    }
    
    setIsLoading(false);
  };

  const intervalOptions = [
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '1 hour' },
    { value: '90', label: '1.5 hours' },
    { value: '120', label: '2 hours' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label htmlFor="take-a-break-enabled" className="flex items-center gap-2">
            <FontAwesomeIcon 
              icon={faClock} 
              style={{ fontSize: '16px', color: 'var(--foreground)' }}
            />
            <Typography 
              variant="settings-title" 
              weight="medium"
            >
              Take-a-break reminder
            </Typography>
          </Label>
          <Typography 
            variant="settings-description" 
            color="muted-foreground"
          >
            Get reminded to take breaks while watching videos
          </Typography>
        </div>
        <Switch
          id="take-a-break-enabled"
          checked={enabled}
          onCheckedChange={handleEnabledChange}
          disabled={isLoading}
        />
      </div>

      {enabled && (
        <div className="ml-6 space-y-2">
          <Label htmlFor="break-interval">
            <Typography 
              variant="settings-description" 
              weight="medium"
            >
              Reminder interval
            </Typography>
          </Label>
          <Select
            value={intervalMinutes?.toString() || '30'}
            onValueChange={handleIntervalChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent>
              {intervalOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}