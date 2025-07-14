import { 
  UserBio, 
  VideoLevelSettings, 
  AppSettings, 
  DigitalWellbeingSettings,
  DailyWatchTimeData,
  CommentInteraction,
  VideoCommentInteractions,
  StoredVideoData,
  ChannelData,
  LOCAL_STORAGE_KEYS, 
  DEFAULT_USER_BIO, 
  DEFAULT_VIDEO_SETTINGS, 
  DEFAULT_APP_SETTINGS,
  DEFAULT_DIGITAL_WELLBEING_SETTINGS,
  DEFAULT_DAILY_WATCH_TIME,
  StorageResult 
} from '../types/localStorage';

/**
 * Generic local storage utility functions
 */
export class LocalStorageManager {
  private static isClient = typeof window !== 'undefined';

  /**
   * Safely get item from localStorage with error handling
   */
  static getItem<T>(key: string, defaultValue: T): T {
    if (!this.isClient) return defaultValue;

    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      
      const parsed = JSON.parse(item);
      
      // Handle Date objects in parsed data
      return this.reviveDates(parsed) as T;
    } catch (error) {
      console.warn(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  }

  /**
   * Safely set item in localStorage with error handling
   */
  static setItem<T>(key: string, value: T): StorageResult<T> {
    if (!this.isClient) {
      return { success: false, error: 'localStorage not available' };
    }

    try {
      const serialized = JSON.stringify(value, this.dateReplacer);
      localStorage.setItem(key, serialized);
      
      // Dispatch custom event for cross-tab synchronization
      this.dispatchStorageEvent(key, value);
      
      return { success: true, data: value };
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Remove item from localStorage
   */
  static removeItem(key: string): StorageResult<null> {
    if (!this.isClient) {
      return { success: false, error: 'localStorage not available' };
    }

    try {
      localStorage.removeItem(key);
      this.dispatchStorageEvent(key, null);
      return { success: true };
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Clear all ZenTube related localStorage data
   */
  static clearAll(): StorageResult<null> {
    if (!this.isClient) {
      return { success: false, error: 'localStorage not available' };
    }

    try {
      Object.values(LOCAL_STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return { success: true };
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get storage usage information
   */
  static getStorageInfo(): { used: number; available: number; percentage: number } {
    if (!this.isClient) {
      return { used: 0, available: 0, percentage: 0 };
    }

    try {
      let used = 0;
      Object.values(LOCAL_STORAGE_KEYS).forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          used += item.length;
        }
      });

      // Estimate available space (most browsers have ~5-10MB limit)
      const estimated = 5 * 1024 * 1024; // 5MB in characters
      const percentage = (used / estimated) * 100;

      return {
        used,
        available: estimated - used,
        percentage: Math.min(percentage, 100)
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return { used: 0, available: 0, percentage: 0 };
    }
  }

  /**
   * Date serialization helper
   */
  private static dateReplacer(key: string, value: any): any {
    if (value instanceof Date) {
      return { __type: 'Date', value: value.toISOString() };
    }
    return value;
  }

  /**
   * Date deserialization helper
   */
  private static reviveDates(obj: any): any {
    if (obj && typeof obj === 'object') {
      if (obj.__type === 'Date') {
        return new Date(obj.value);
      }
      
      if (Array.isArray(obj)) {
        return obj.map(item => this.reviveDates(item));
      }
      
      const result: any = {};
      for (const key in obj) {
        result[key] = this.reviveDates(obj[key]);
      }
      return result;
    }
    return obj;
  }

  /**
   * Dispatch custom storage event for cross-tab synchronization
   */
  private static dispatchStorageEvent(key: string, newValue: any): void {
    if (!this.isClient) return;

    const event = new CustomEvent('zentubeStorageChange', {
      detail: {
        key,
        newValue,
        timestamp: Date.now()
      }
    });
    
    window.dispatchEvent(event);
  }
}

/**
 * Specific storage functions for each data type
 */

// User Bio functions
export const getUserBio = (): UserBio => {
  return LocalStorageManager.getItem(LOCAL_STORAGE_KEYS.USER_BIO, DEFAULT_USER_BIO);
};

export const setUserBio = (userBio: UserBio): StorageResult<UserBio> => {
  return LocalStorageManager.setItem(LOCAL_STORAGE_KEYS.USER_BIO, userBio);
};

export const updateUserLastActive = (): StorageResult<UserBio> => {
  const currentBio = getUserBio();
  const updatedBio = { ...currentBio, lastActiveAt: new Date() };
  return setUserBio(updatedBio);
};

// History functions
export const getHistory = (): StoredVideoData[] => {
  return LocalStorageManager.getItem(LOCAL_STORAGE_KEYS.HISTORY, []);
};

export const addToHistory = (videoData: StoredVideoData): StorageResult<StoredVideoData[]> => {
  const history = getHistory();
  const filteredHistory = history.filter(video => video.id !== videoData.id);
  const newVideoData = { ...videoData, addedAt: new Date() };
  const newHistory = [newVideoData, ...filteredHistory].slice(0, 100); // Keep last 100 videos
  return LocalStorageManager.setItem(LOCAL_STORAGE_KEYS.HISTORY, newHistory);
};

export const removeFromHistory = (videoId: string): StorageResult<StoredVideoData[]> => {
  const history = getHistory();
  const newHistory = history.filter(video => video.id !== videoId);
  return LocalStorageManager.setItem(LOCAL_STORAGE_KEYS.HISTORY, newHistory);
};

export const clearHistory = (): StorageResult<StoredVideoData[]> => {
  return LocalStorageManager.setItem(LOCAL_STORAGE_KEYS.HISTORY, []);
};

// Watch Later functions
export const getWatchLater = (): StoredVideoData[] => {
  return LocalStorageManager.getItem(LOCAL_STORAGE_KEYS.WATCH_LATER, []);
};

export const addToWatchLater = (videoData: StoredVideoData): StorageResult<StoredVideoData[]> => {
  const watchLater = getWatchLater();
  const existingVideo = watchLater.find(video => video.id === videoData.id);
  if (!existingVideo) {
    const newVideoData = { ...videoData, addedAt: new Date() };
    const newWatchLater = [newVideoData, ...watchLater];
    return LocalStorageManager.setItem(LOCAL_STORAGE_KEYS.WATCH_LATER, newWatchLater);
  }
  return { success: true, data: watchLater };
};

export const removeFromWatchLater = (videoId: string): StorageResult<StoredVideoData[]> => {
  const watchLater = getWatchLater();
  const newWatchLater = watchLater.filter(video => video.id !== videoId);
  return LocalStorageManager.setItem(LOCAL_STORAGE_KEYS.WATCH_LATER, newWatchLater);
};

export const isInWatchLater = (videoId: string): boolean => {
  const watchLater = getWatchLater();
  return watchLater.some(video => video.id === videoId);
};

export const clearWatchLater = (): StorageResult<StoredVideoData[]> => {
  return LocalStorageManager.setItem(LOCAL_STORAGE_KEYS.WATCH_LATER, []);
};

// Liked Videos functions
export const getLikedVideos = (): StoredVideoData[] => {
  return LocalStorageManager.getItem(LOCAL_STORAGE_KEYS.LIKED_VIDEOS, []);
};

export const addToLikedVideos = (videoData: StoredVideoData): StorageResult<StoredVideoData[]> => {
  const likedVideos = getLikedVideos();
  const existingVideo = likedVideos.find(video => video.id === videoData.id);
  if (!existingVideo) {
    const newVideoData = { ...videoData, addedAt: new Date() };
    const newLikedVideos = [newVideoData, ...likedVideos];
    return LocalStorageManager.setItem(LOCAL_STORAGE_KEYS.LIKED_VIDEOS, newLikedVideos);
  }
  return { success: true, data: likedVideos };
};

export const removeFromLikedVideos = (videoId: string): StorageResult<StoredVideoData[]> => {
  const likedVideos = getLikedVideos();
  const newLikedVideos = likedVideos.filter(video => video.id !== videoId);
  return LocalStorageManager.setItem(LOCAL_STORAGE_KEYS.LIKED_VIDEOS, newLikedVideos);
};

export const isLikedVideo = (videoId: string): boolean => {
  const likedVideos = getLikedVideos();
  return likedVideos.some(video => video.id === videoId);
};

export const clearLikedVideos = (): StorageResult<StoredVideoData[]> => {
  return LocalStorageManager.setItem(LOCAL_STORAGE_KEYS.LIKED_VIDEOS, []);
};

// Subscribed Channels functions
export const getSubscribedChannels = (): ChannelData[] => {
  return LocalStorageManager.getItem(LOCAL_STORAGE_KEYS.SUBSCRIBED_CHANNELS, []);
};

export const addToSubscribedChannels = (channelData: ChannelData): StorageResult<ChannelData[]> => {
  const subscribedChannels = getSubscribedChannels();
  const existingChannel = subscribedChannels.find(channel => channel.id === channelData.id);
  
  if (!existingChannel) {
    const newChannelData = { ...channelData, subscribedAt: new Date() };
    const newSubscribedChannels = [newChannelData, ...subscribedChannels];
    return LocalStorageManager.setItem(LOCAL_STORAGE_KEYS.SUBSCRIBED_CHANNELS, newSubscribedChannels);
  }
  return { success: true, data: subscribedChannels };
};

export const removeFromSubscribedChannels = (channelId: string): StorageResult<ChannelData[]> => {
  const subscribedChannels = getSubscribedChannels();
  const newSubscribedChannels = subscribedChannels.filter(channel => channel.id !== channelId);
  return LocalStorageManager.setItem(LOCAL_STORAGE_KEYS.SUBSCRIBED_CHANNELS, newSubscribedChannels);
};

export const isSubscribedToChannel = (channelId: string): boolean => {
  const subscribedChannels = getSubscribedChannels();
  return subscribedChannels.some(channel => channel.id === channelId);
};

// Legacy function for backward compatibility - converts old string[] format to new ChannelData[] format
export const migrateSubscribedChannelsFormat = (): StorageResult<ChannelData[]> => {
  try {
    const rawData = localStorage.getItem(LOCAL_STORAGE_KEYS.SUBSCRIBED_CHANNELS);
    if (!rawData) return { success: true, data: [] };
    
    const parsed = JSON.parse(rawData);
    
    // Check if it's the old string[] format
    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
      // Convert old format to new format with placeholder data
      const migratedChannels: ChannelData[] = parsed.map((channelId: string) => ({
        id: channelId,
        title: `Channel ${channelId}`, // Placeholder title
        thumbnail: `https://i.pravatar.cc/88?img=${Math.floor(Math.random() * 70) + 1}`, // Placeholder thumbnail
        subscribedAt: new Date()
      }));
      
      return LocalStorageManager.setItem(LOCAL_STORAGE_KEYS.SUBSCRIBED_CHANNELS, migratedChannels);
    }
    
    // Already in new format or empty
    return { success: true, data: parsed };
  } catch (error) {
    console.error('Error migrating subscribed channels format:', error);
    return { success: false, error: 'Migration failed' };
  }
};

// Comment Interactions functions
export const getCommentInteractions = (): VideoCommentInteractions => {
  return LocalStorageManager.getItem(LOCAL_STORAGE_KEYS.COMMENT_INTERACTIONS, {});
};

export const getCommentInteractionsForVideo = (videoId: string): CommentInteraction[] => {
  const allInteractions = getCommentInteractions();
  return allInteractions[videoId] || [];
};

export const addCommentInteraction = (videoId: string, commentId: string, type: 'like' | 'dislike'): StorageResult<VideoCommentInteractions> => {
  const allInteractions = getCommentInteractions();
  const videoInteractions = allInteractions[videoId] || [];
  
  // Remove any existing interaction for this comment
  const filteredInteractions = videoInteractions.filter(interaction => interaction.commentId !== commentId);
  
  // Add new interaction
  const newInteraction: CommentInteraction = {
    commentId,
    type,
    timestamp: new Date()
  };
  
  const updatedVideoInteractions = [...filteredInteractions, newInteraction];
  const updatedAllInteractions = {
    ...allInteractions,
    [videoId]: updatedVideoInteractions
  };
  
  return LocalStorageManager.setItem(LOCAL_STORAGE_KEYS.COMMENT_INTERACTIONS, updatedAllInteractions);
};

export const removeCommentInteraction = (videoId: string, commentId: string): StorageResult<VideoCommentInteractions> => {
  const allInteractions = getCommentInteractions();
  const videoInteractions = allInteractions[videoId] || [];
  
  const filteredInteractions = videoInteractions.filter(interaction => interaction.commentId !== commentId);
  const updatedAllInteractions = {
    ...allInteractions,
    [videoId]: filteredInteractions
  };
  
  return LocalStorageManager.setItem(LOCAL_STORAGE_KEYS.COMMENT_INTERACTIONS, updatedAllInteractions);
};

export const getCommentInteractionType = (videoId: string, commentId: string): 'like' | 'dislike' | null => {
  const videoInteractions = getCommentInteractionsForVideo(videoId);
  const interaction = videoInteractions.find(interaction => interaction.commentId === commentId);
  return interaction ? interaction.type : null;
};

// Video Settings functions
export const getVideoSettings = (): Record<string, VideoLevelSettings> => {
  return LocalStorageManager.getItem(LOCAL_STORAGE_KEYS.VIDEO_SETTINGS, {});
};

export const getVideoSettingsForVideo = (videoId: string): VideoLevelSettings => {
  const allSettings = getVideoSettings();
  return allSettings[videoId] || DEFAULT_VIDEO_SETTINGS;
};

export const setVideoSettings = (videoId: string, settings: VideoLevelSettings): StorageResult<Record<string, VideoLevelSettings>> => {
  const allSettings = getVideoSettings();
  const newSettings = { ...allSettings, [videoId]: settings };
  return LocalStorageManager.setItem(LOCAL_STORAGE_KEYS.VIDEO_SETTINGS, newSettings);
};

export const updateVideoSetting = (videoId: string, key: keyof VideoLevelSettings, value: boolean): StorageResult<Record<string, VideoLevelSettings>> => {
  const currentSettings = getVideoSettingsForVideo(videoId);
  const updatedSettings = { ...currentSettings, [key]: value };
  return setVideoSettings(videoId, updatedSettings);
};

// App Settings functions
export const getAppSettings = (): AppSettings => {
  return LocalStorageManager.getItem(LOCAL_STORAGE_KEYS.APP_SETTINGS, DEFAULT_APP_SETTINGS);
};

export const setAppSettings = (settings: AppSettings): StorageResult<AppSettings> => {
  return LocalStorageManager.setItem(LOCAL_STORAGE_KEYS.APP_SETTINGS, settings);
};

export const updateAppSetting = <K extends keyof AppSettings>(
  key: K, 
  value: AppSettings[K]
): StorageResult<AppSettings> => {
  const currentSettings = getAppSettings();
  const updatedSettings = { ...currentSettings, [key]: value };
  return setAppSettings(updatedSettings);
};

// Digital Wellbeing Settings functions
export const getDigitalWellbeingSettings = (): DigitalWellbeingSettings => {
  return LocalStorageManager.getItem(LOCAL_STORAGE_KEYS.DIGITAL_WELLBEING_SETTINGS, DEFAULT_DIGITAL_WELLBEING_SETTINGS);
};

export const setDigitalWellbeingSettings = (settings: DigitalWellbeingSettings): StorageResult<DigitalWellbeingSettings> => {
  return LocalStorageManager.setItem(LOCAL_STORAGE_KEYS.DIGITAL_WELLBEING_SETTINGS, settings);
};

export const updateDigitalWellbeingSetting = <K extends keyof DigitalWellbeingSettings>(
  key: K, 
  value: DigitalWellbeingSettings[K]
): StorageResult<DigitalWellbeingSettings> => {
  const currentSettings = getDigitalWellbeingSettings();
  const updatedSettings = { ...currentSettings, [key]: value };
  return setDigitalWellbeingSettings(updatedSettings);
};

export const updateDailyWatchTimeTarget = (
  enabled: boolean,
  hours: number,
  minutes: number
): StorageResult<DigitalWellbeingSettings> => {
  const currentSettings = getDigitalWellbeingSettings();
  const updatedSettings = {
    ...currentSettings,
    dailyWatchTimeTarget: {
      enabled,
      hours,
      minutes,
    },
  };
  return setDigitalWellbeingSettings(updatedSettings);
};

export const updateTakeABreakSetting = (
  enabled: boolean,
  intervalMinutes: number
): StorageResult<DigitalWellbeingSettings> => {
  const currentSettings = getDigitalWellbeingSettings();
  const updatedSettings = {
    ...currentSettings,
    takeABreak: {
      enabled,
      intervalMinutes,
    },
  };
  return setDigitalWellbeingSettings(updatedSettings);
};

// Daily Watch Time functions
export const getDailyWatchTime = (): DailyWatchTimeData => {
  const data = LocalStorageManager.getItem(LOCAL_STORAGE_KEYS.DAILY_WATCH_TIME, DEFAULT_DAILY_WATCH_TIME);
  const today = new Date().toISOString().split('T')[0];
  
  // Reset data if it's a new day
  if (data.date !== today) {
    const resetData = {
      date: today,
      totalMinutesWatched: 0,
      lastUpdated: new Date(),
    };
    LocalStorageManager.setItem(LOCAL_STORAGE_KEYS.DAILY_WATCH_TIME, resetData);
    return resetData;
  }
  
  return data;
};

export const addWatchTime = (minutesToAdd: number): StorageResult<DailyWatchTimeData> => {
  const currentData = getDailyWatchTime();
  const updatedData = {
    ...currentData,
    totalMinutesWatched: currentData.totalMinutesWatched + minutesToAdd,
    lastUpdated: new Date(),
  };
  return LocalStorageManager.setItem(LOCAL_STORAGE_KEYS.DAILY_WATCH_TIME, updatedData);
};

export const getTodayWatchTimeMinutes = (): number => {
  const data = getDailyWatchTime();
  return data.totalMinutesWatched;
};

export const getWatchTimeStatus = (): {
  totalMinutes: number;
  targetMinutes: number;
  remainingMinutes: number;
  isTargetEnabled: boolean;
  hasReachedLimit: boolean;
  isNearLimit: boolean;
} => {
  const watchTimeData = getDailyWatchTime();
  const settings = getDigitalWellbeingSettings();
  
  const totalMinutes = watchTimeData.totalMinutesWatched;
  const targetMinutes = settings.dailyWatchTimeTarget.enabled 
    ? (settings.dailyWatchTimeTarget.hours * 60) + settings.dailyWatchTimeTarget.minutes
    : 0;
  
  const remainingMinutes = Math.max(0, targetMinutes - totalMinutes);
  const hasReachedLimit = settings.dailyWatchTimeTarget.enabled && totalMinutes >= targetMinutes;
  const isNearLimit = settings.dailyWatchTimeTarget.enabled && remainingMinutes <= 1 && remainingMinutes > 0;
  
  return {
    totalMinutes,
    targetMinutes,
    remainingMinutes,
    isTargetEnabled: settings.dailyWatchTimeTarget.enabled,
    hasReachedLimit,
    isNearLimit,
  };
};