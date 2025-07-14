import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Typography } from './Typography';
import { getDigitalWellbeingSettings, updateTakeABreakSetting } from '@/utils/localStorage';
import { toast } from 'sonner';

const BREAK_INTERVALS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
];

export function TakeABreakSetting() {
  const [settings, setSettings] = useState(() => {
    const currentSettings = getDigitalWellbeingSettings();
    return currentSettings.takeABreak || { enabled: false, intervalMinutes: 30 };
  });

  const handleToggle = (newEnabled: boolean) => {
    const result = updateTakeABreakSetting(newEnabled, settings.intervalMinutes);
    
    if (result.success) {
      setSettings(prev => ({ ...prev, enabled: newEnabled }));
      toast.success(newEnabled ? 'Take a break reminders enabled' : 'Take a break reminders disabled');
    } else {
      toast.error('Failed to update take a break setting');
    }
  };

  const handleIntervalChange = (value: string) => {
    const intervalMinutes = parseInt(value);
    const result = updateTakeABreakSetting(settings.enabled, intervalMinutes);
    
    if (result.success) {
      setSettings(prev => ({ ...prev, intervalMinutes }));
      toast.success('Break interval updated');
    } else {
      toast.error('Failed to update break interval');
    }
  };

  const formatCurrentInterval = () => {
    const interval = BREAK_INTERVALS.find(i => i.value === settings.intervalMinutes);
    return interval ? interval.label : `${settings.intervalMinutes} minutes`;
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
            Take a Break
          </Typography>
          <Typography 
            color="muted-foreground" 
            style={{ fontSize: '14px' }}
          >
            Get reminded to take regular breaks while watching videos to maintain healthy viewing habits
          </Typography>
        </div>
        <Switch
          checked={settings.enabled}
          onCheckedChange={handleToggle}
        />
      </div>

      {settings.enabled && (
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <Typography 
                weight="medium" 
                style={{ fontSize: '14px' }}
                className="mb-1"
              >
                Break interval
              </Typography>
              <Typography 
                color="muted-foreground" 
                style={{ fontSize: '14px' }}
              >
                Current interval: {formatCurrentInterval()}
              </Typography>
            </div>
            <Select
              value={settings.intervalMinutes.toString()}
              onValueChange={handleIntervalChange}
            >
              <SelectTrigger className="w-32 cursor-pointer">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                {BREAK_INTERVALS.map((interval) => (
                  <SelectItem key={interval.value} value={interval.value.toString()} className="cursor-pointer">
                    {interval.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}