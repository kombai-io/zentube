import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from './Typography';
import DailyWatchTimeSettings from './DailyWatchTimeSettings';
import { TakeABreakSetting } from './TakeABreakSetting';

export default function DigitalWellbeingSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Typography weight="semibold" style={{ fontSize: '16px' }}>
            Digital Wellbeing
          </Typography>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <DailyWatchTimeSettings />
        <div className="border-t pt-6">
          <TakeABreakSetting />
        </div>
      </CardContent>
    </Card>
  );
}