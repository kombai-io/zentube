import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faHourglassHalf } from '@fortawesome/free-regular-svg-icons';
import { formatWatchTime, formatWatchTimeShort } from '@/utils/formatters';

interface WellbeingStatsProps {
  totalMinutes: number;
  targetMinutes: number;
  remainingMinutes: number;
  isTargetEnabled: boolean;
}

export function WellbeingStats({ 
  totalMinutes, 
  targetMinutes, 
  remainingMinutes, 
  isTargetEnabled 
}: WellbeingStatsProps) {
  const averageDaily = totalMinutes; // This would be calculated over multiple days in a real app
  const weeklyTotal = totalMinutes * 7; // Mock weekly calculation

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Today's Watch Time
          </CardTitle>
          <FontAwesomeIcon 
            icon={faClock} 
            className="h-4 w-4 text-blue-600 dark:text-blue-400" 
          />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {formatWatchTimeShort(totalMinutes)}
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            {formatWatchTime(totalMinutes)}
          </p>
        </CardContent>
      </Card>

      {isTargetEnabled && (
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">
              Remaining Time
            </CardTitle>
            <FontAwesomeIcon 
              icon={faHourglassHalf} 
              className="h-4 w-4 text-green-600 dark:text-green-400" 
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {remainingMinutes > 0 ? formatWatchTimeShort(remainingMinutes) : '0m'}
            </div>
            <p className="text-xs text-green-700 dark:text-green-300">
              {remainingMinutes > 0 ? 'until daily limit' : 'Daily limit reached'}
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">
            Weekly Estimate
          </CardTitle>
          <FontAwesomeIcon 
            icon={faClock} 
            className="h-4 w-4 text-purple-600 dark:text-purple-400" 
          />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {formatWatchTimeShort(weeklyTotal)}
          </div>
          <p className="text-xs text-purple-700 dark:text-purple-300">
            Based on today's usage
          </p>
        </CardContent>
      </Card>
    </div>
  );
}