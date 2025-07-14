import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Typography } from './Typography';

interface TimeInputProps {
  hours: number;
  minutes: number;
  onTimeChange: (hours: number, minutes: number) => void;
  onTimeBlur?: (hours: number, minutes: number) => void;
  disabled?: boolean;
  className?: string;
}

export default function TimeInput({ 
  hours, 
  minutes, 
  onTimeChange, 
  onTimeBlur,
  disabled = false,
  className = '' 
}: TimeInputProps) {
  const [hoursValue, setHoursValue] = useState(hours.toString());
  const [minutesValue, setMinutesValue] = useState(minutes.toString());

  // Update local state when props change
  useEffect(() => {
    setHoursValue(hours.toString());
    setMinutesValue(minutes.toString());
  }, [hours, minutes]);

  const handleHoursChange = (value: string) => {
    setHoursValue(value);
    const numericValue = parseInt(value) || 0;
    const clampedValue = Math.max(0, Math.min(23, numericValue));
    onTimeChange(clampedValue, minutes);
  };

  const handleMinutesChange = (value: string) => {
    setMinutesValue(value);
    const numericValue = parseInt(value) || 0;
    const clampedValue = Math.max(0, Math.min(59, numericValue));
    onTimeChange(hours, clampedValue);
  };

  const handleHoursBlur = () => {
    const numericValue = parseInt(hoursValue) || 0;
    const clampedValue = Math.max(0, Math.min(23, numericValue));
    setHoursValue(clampedValue.toString());
    
    // Call onTimeBlur if provided
    if (onTimeBlur) {
      onTimeBlur(clampedValue, minutes);
    }
  };

  const handleMinutesBlur = () => {
    const numericValue = parseInt(minutesValue) || 0;
    const clampedValue = Math.max(0, Math.min(59, numericValue));
    setMinutesValue(clampedValue.toString());
    
    // Call onTimeBlur if provided
    if (onTimeBlur) {
      onTimeBlur(hours, clampedValue);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        <Input
          type="number"
          min="0"
          max="23"
          value={hoursValue}
          onChange={(e) => handleHoursChange(e.target.value)}
          onBlur={handleHoursBlur}
          disabled={disabled}
          className="w-14 text-center text-sm"
          placeholder="0"
        />
        <Typography 
          variant="small"
          color="muted-foreground"
          style={{ fontSize: '12px' }}
        >
          h
        </Typography>
      </div>
      
      <div className="flex items-center gap-1">
        <Input
          type="number"
          min="0"
          max="59"
          value={minutesValue}
          onChange={(e) => handleMinutesChange(e.target.value)}
          onBlur={handleMinutesBlur}
          disabled={disabled}
          className="w-14 text-center text-sm"
          placeholder="0"
        />
        <Typography 
          variant="small"
          color="muted-foreground"
          style={{ fontSize: '12px' }}
        >
          m
        </Typography>
      </div>
    </div>
  );
}