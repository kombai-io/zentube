import { createSlice } from '@reduxjs/toolkit';
import { getWatchTimeStatus } from '@/utils/localStorage';
import { WatchTimeStatus } from '@/types/watchTime';

const initialState: WatchTimeStatus = getWatchTimeStatus();

const watchTimeSlice = createSlice({
    name: 'watchTime',
    initialState,
    reducers: {
        updateWatchTimeStatus: (state) => {
            const newStatus = getWatchTimeStatus();
            state.totalMinutes = newStatus.totalMinutes;
            state.targetMinutes = newStatus.targetMinutes;
            state.remainingMinutes = newStatus.remainingMinutes;
            state.isTargetEnabled = newStatus.isTargetEnabled;
            state.hasReachedLimit = newStatus.hasReachedLimit;
            state.isNearLimit = newStatus.isNearLimit;
        },
    },
});

export const { updateWatchTimeStatus } = watchTimeSlice.actions;
export default watchTimeSlice.reducer; 