export interface WatchTimeStatus {
    totalMinutes: number;
    targetMinutes: number;
    remainingMinutes: number;
    isTargetEnabled: boolean;
    hasReachedLimit: boolean;
    isNearLimit: boolean;
} 