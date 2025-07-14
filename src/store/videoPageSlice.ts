import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SortOrder, VideoPageState } from '../types/video';

const initialState: VideoPageState = {
  currentVideoId: null,
  sortOrder: SortOrder.NEWEST,
  minimalPlayerMode: false,
  zenTineMode: false,
  commentsCount: 0,
};

const videoPageSlice = createSlice({
  name: 'videoPage',
  initialState,
  reducers: {
    setCurrentVideoId: (state, action: PayloadAction<string>) => {
      state.currentVideoId = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<SortOrder>) => {
      state.sortOrder = action.payload;
    },
    setMinimalPlayerMode: (state, action: PayloadAction<boolean>) => {
      state.minimalPlayerMode = action.payload;
    },
    setZenTineMode: (state, action: PayloadAction<boolean>) => {
      state.zenTineMode = action.payload;
    },
    setCommentsCount: (state, action: PayloadAction<number>) => {
      state.commentsCount = action.payload;
    },
  },
});

export const {
  setCurrentVideoId,
  setSortOrder,
  setMinimalPlayerMode,
  setZenTineMode,
  setCommentsCount,
} = videoPageSlice.actions;

export default videoPageSlice.reducer;