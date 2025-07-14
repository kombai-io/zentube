import { configureStore } from '@reduxjs/toolkit';
import sidebarReducer from './sidebarSlice';
import themeReducer from './themeSlice';
import videoPageReducer from './videoPageSlice';
import watchTimeReducer from './watchTimeSlice';
import { youtubeApi } from '../services/youtubeApi';

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    theme: themeReducer,
    videoPage: videoPageReducer,
    watchTime: watchTimeReducer,
    [youtubeApi.reducerPath]: youtubeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(youtubeApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;