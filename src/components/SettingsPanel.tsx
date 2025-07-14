import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Typography } from './Typography';

interface SettingsPanelProps {
  minimalPlayerMode: boolean;
  zenTineMode: boolean;
  onMinimalPlayerToggle: (enabled: boolean) => void;
  onZenTineToggle: (enabled: boolean) => void;
}

export default function SettingsPanel({ 
  minimalPlayerMode, 
  zenTineMode, 
  onMinimalPlayerToggle, 
  onZenTineToggle 
}: SettingsPanelProps) {
  return (
    <div className="settings-panel-container space-y-4 p-4 bg-card rounded-lg border border-border shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label htmlFor="minimal-player">
            <Typography 
              variant="settings-title" 
              weight="medium" 
              color="foreground"
            >
              Minimal Player Mode
            </Typography>
          </Label>
          <Typography 
            variant="settings-description" 
            weight="normal" 
            color="muted-foreground"
          >
            hides recommendations and comments for focused viewing
          </Typography>
        </div>
        <Switch
          id="minimal-player"
          checked={minimalPlayerMode}
          onCheckedChange={onMinimalPlayerToggle}
          className="cursor-pointer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label htmlFor="zen-tint">
            <Typography 
              variant="settings-title" 
              weight="medium" 
              color="foreground"
            >
              Zen-Tint
            </Typography>
          </Label>
          <Typography 
            variant="settings-description" 
            weight="normal" 
            color="muted-foreground"
          >
            screen turns grayscale + dims by 20% for focus
          </Typography>
        </div>
        <Switch
          id="zen-tint"
          checked={zenTineMode}
          onCheckedChange={onZenTineToggle}
          className="cursor-pointer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
        />
      </div>
    </div>
  );
}