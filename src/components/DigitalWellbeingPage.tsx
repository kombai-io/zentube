import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CircularProgress } from './CircularProgress';
import { WellbeingStats } from './WellbeingStats';
import { TakeABreakSetting } from './TakeABreakSetting';
import { formatWatchTime, formatWatchTimeShort } from '@/utils/formatters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';

export function DigitalWellbeingPage() {
  const navigate = useNavigate();
  const watchTimeStatus = useSelector((state: RootState) => state.watchTime);
  const { 
    totalMinutes, 
    targetMinutes, 
    remainingMinutes, 
    isTargetEnabled, 
    hasReachedLimit,
    isNearLimit 
  } = watchTimeStatus;

  const progressPercentage = isTargetEnabled ? (totalMinutes / targetMinutes) * 100 : 0;
  const displayPercentage = Math.min(progressPercentage, 100);

  const getProgressColor = () => {
    if (!isTargetEnabled) return 'text-primary';
    if (hasReachedLimit) return 'text-destructive';
    if (isNearLimit) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusMessage = () => {
    if (!isTargetEnabled) {
      return "No daily limit set";
    }
    if (hasReachedLimit) {
      return "Daily limit reached";
    }
    if (isNearLimit) {
      return "Approaching daily limit";
    }
    return "Within healthy limits";
  };

  return (
    <div className="flex-1 p-8 max-w-6xl mx-auto">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            Digital Wellbeing
          </h1>
          <p className="text-lg text-muted-foreground">
            Track your daily watch time and maintain healthy viewing habits
          </p>
        </div>

        {/* Main Progress Section */}
        <Card className="bg-gradient-to-br from-card to-muted/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Today's Watch Time</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            {/* Circular Progress */}
            <div className="relative">
              <CircularProgress
                value={totalMinutes}
                max={isTargetEnabled ? targetMinutes : Math.max(totalMinutes, 60)}
                size={280}
                strokeWidth={12}
                color={
                  !isTargetEnabled ? 'rgb(59 130 246)' : // blue-500 for primary
                  hasReachedLimit ? 'rgb(239 68 68)' : // red-500 for destructive
                  isNearLimit ? 'rgb(234 179 8)' : // yellow-500
                  'rgb(34 197 94)' // green-500
                }
                backgroundColor="rgb(229 231 235)" // gray-200
              >
                <div className="text-center space-y-3">
                  <div className="text-4xl font-bold text-foreground">
                    {formatWatchTimeShort(totalMinutes)}
                  </div>
                  {isTargetEnabled && (
                    <>
                      {/* Progress percentage indicator - now centered with improved styling */}
                      <div className={`inline-block text-xl font-bold px-4 py-2 rounded-full border ${
                        hasReachedLimit 
                          ? 'bg-destructive/15 text-destructive border-destructive/20' 
                          : isNearLimit 
                            ? 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/20'
                            : 'bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20'
                      }`}>
                        {displayPercentage.toFixed(0)}%
                      </div>
                    </>
                  )}
                </div>
              </CircularProgress>
            </div>

            {/* Status Message */}
            <div className="text-center space-y-2">
              <p className={`text-lg font-medium ${
                hasReachedLimit 
                  ? 'text-destructive' 
                  : isNearLimit 
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-green-600 dark:text-green-400'
              }`}>
                {getStatusMessage()}
              </p>
              
              {isTargetEnabled && remainingMinutes > 0 && (
                <p className="text-sm text-muted-foreground">
                  {formatWatchTime(remainingMinutes)} remaining today
                </p>
              )}
            </div>

            {/* Linear Progress Bar */}
            {isTargetEnabled && (
              <div className="w-full max-w-md space-y-2">
                <Progress 
                  value={displayPercentage} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0m</span>
                  <span>{formatWatchTimeShort(targetMinutes)}</span>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex gap-4">
              <Button variant="outline" size="sm">
                <FontAwesomeIcon icon={faClock} className="mr-2 h-4 w-4" />
                View History
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/account')}
              >
                Adjust Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <WellbeingStats
          totalMinutes={totalMinutes}
          targetMinutes={targetMinutes}
          remainingMinutes={remainingMinutes}
          isTargetEnabled={isTargetEnabled}
        />

        {/* Take a Break Setting */}
        <TakeABreakSetting />

        {/* Tips Section */}
        <Card>
          <CardHeader>
            <CardTitle>Healthy Viewing Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Take Regular Breaks</h4>
                <p className="text-sm text-muted-foreground">
                  Follow the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Set Daily Limits</h4>
                <p className="text-sm text-muted-foreground">
                  Establish healthy boundaries by setting daily watch time targets that work for your lifestyle.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Quality Over Quantity</h4>
                <p className="text-sm text-muted-foreground">
                  Focus on watching content that adds value rather than mindless scrolling.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Evening Wind-down</h4>
                <p className="text-sm text-muted-foreground">
                  Avoid screens 1-2 hours before bedtime to improve sleep quality.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}