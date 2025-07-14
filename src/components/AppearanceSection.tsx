import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Typography } from './Typography';

interface AppearanceSectionProps {
  currentTheme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
}

export default function AppearanceSection({ currentTheme, onThemeChange }: AppearanceSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Typography weight="semibold" style={{ fontSize: '16px' }}>
            Appearance
          </Typography>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <Typography 
                as="label" 
                weight="medium" 
                style={{ fontSize: '14px' }}
                className="mb-1"
              >
                Theme
              </Typography>
              <Typography 
                color="muted-foreground" 
                style={{ fontSize: '14px' }}
              >
                Choose how ZenTube looks to you
              </Typography>
            </div>
            <Select value={currentTheme} onValueChange={onThemeChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light" className="cursor-pointer">Light</SelectItem>
                <SelectItem value="dark" className="cursor-pointer">Dark</SelectItem>
                <SelectItem value="system" className="cursor-pointer">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}