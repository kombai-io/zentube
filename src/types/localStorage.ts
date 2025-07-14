// Local storage data types

export interface UserBio {
  name: string;
  lastActiveAt: Date;
}

export interface StoredVideoData {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  viewCount: number;
  description: string;
  addedAt: Date;
}

export interface VideoLevelSettings {
  // Reserved for future video-specific settings
}

export interface CommentInteraction {
  commentId: string;
  type: 'like' | 'dislike';
  timestamp: Date;
}

export interface VideoCommentInteractions {
  [videoId: string]: CommentInteraction[];
}

export interface ChannelData {
  id: string;
  title: string;
  thumbnail: string;
  subscribedAt: Date;
}

export interface DailyWatchTimeData {
  date: string; // YYYY-MM-DD format
  totalMinutesWatched: number;
  lastUpdated: Date;
}

export interface DigitalWellbeingSettings {
  dailyWatchTimeTarget: {
    enabled: boolean;
    hours: number;
    minutes: number;
  };
  takeABreak: {
    enabled: boolean;
    intervalMinutes: number;
  };
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  autoplay: boolean;
  defaultQuality: 'auto' | '144p' | '240p' | '360p' | '480p' | '720p' | '1080p';
  volume: number; // 0-100
  playbackSpeed: number; // 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2
  subtitles: boolean;
  notifications: boolean;
  minimalPlayerMode: boolean;
  zenTint: boolean;
}

// Local storage structure
export interface LocalStorageData {
  userBio: UserBio | null;
  history: StoredVideoData[]; // Array of video objects
  watchLater: StoredVideoData[]; // Array of video objects
  likedVideos: StoredVideoData[]; // Array of video objects
  subscribedChannels: ChannelData[]; // Array of channel data objects
  commentInteractions: VideoCommentInteractions; // videoId -> comment interactions
  videoSettings: Record<string, VideoLevelSettings>; // videoId -> settings
  appSettings: AppSettings;
  digitalWellbeingSettings: DigitalWellbeingSettings;
  dailyWatchTime: DailyWatchTimeData;
}

// Local storage keys
export const LOCAL_STORAGE_KEYS = {
  USER_BIO: 'zentube_user_bio',
  HISTORY: 'zentube_history',
  WATCH_LATER: 'zentube_watch_later',
  LIKED_VIDEOS: 'zentube_liked_videos',
  SUBSCRIBED_CHANNELS: 'zentube_subscribed_channels',
  COMMENT_INTERACTIONS: 'zentube_comment_interactions',
  VIDEO_SETTINGS: 'zentube_video_settings',
  APP_SETTINGS: 'zentube_app_settings',
  DIGITAL_WELLBEING_SETTINGS: 'zentube_digital_wellbeing_settings',
  DAILY_WATCH_TIME: 'zentube_daily_watch_time',
} as const;

// Default values
export const DEFAULT_USER_BIO: UserBio = {
  name: 'Guest User',
  lastActiveAt: new Date(),
};

export const DEFAULT_VIDEO_SETTINGS: VideoLevelSettings = {
  // Reserved for future video-specific settings
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  theme: 'system',
  autoplay: true,
  defaultQuality: 'auto',
  volume: 100,
  playbackSpeed: 1,
  subtitles: false,
  notifications: true,
  minimalPlayerMode: false,
  zenTint: false,
};

export const DEFAULT_DIGITAL_WELLBEING_SETTINGS: DigitalWellbeingSettings = {
  dailyWatchTimeTarget: {
    enabled: false,
    hours: 2,
    minutes: 0,
  },
  takeABreak: {
    enabled: false,
    intervalMinutes: 30,
  },
};

export const DEFAULT_DAILY_WATCH_TIME: DailyWatchTimeData = {
  date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD
  totalMinutesWatched: 0,
  lastUpdated: new Date(),
};

// Storage operation result types
export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Storage event types for cross-tab synchronization
export interface StorageEventData {
  key: string;
  oldValue: any;
  newValue: any;
  timestamp: number;
}