import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { Typography } from './Typography';

interface BreakReminderToastProps {
  onDismiss: () => void;
  onSnooze: () => void;
}

export default function BreakReminderToast({ onDismiss, onSnooze }: BreakReminderToastProps) {
  return (
    <div className="flex items-start gap-3 p-4 bg-card border border-border rounded-lg shadow-lg max-w-sm">
      <div className="flex-shrink-0 mt-0.5">
        <FontAwesomeIcon 
          icon={faClock} 
          style={{ fontSize: '20px', color: 'var(--primary)' }}
        />
      </div>
      
      <div className="flex-1 space-y-2">
        <Typography 
          variant="settings-title" 
          weight="semibold"
        >
          Time for a break!
        </Typography>
        
        <Typography 
          variant="settings-description" 
          color="muted-foreground"
        >
          You've been watching for a while. Consider taking a short break to rest your eyes.
        </Typography>
        
        <div className="flex gap-2 pt-2">
          <Button 
            variant="default" 
            size="sm" 
            onClick={onDismiss}
            className="flex-1"
          >
            OK
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSnooze}
            className="flex-1"
          >
            Snooze 5min
          </Button>
        </div>
      </div>
    </div>
  );
}