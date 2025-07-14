import { useState, useEffect, useCallback } from 'react';
import { 
  UserBio, 
  VideoLevelSettings, 
  AppSettings,
  CommentInteraction,
  VideoCommentInteractions,
  StorageResult,
  StoredVideoData,
  ChannelData 
} from '../types/localStorage';
import {
  getUserBio,
  setUserBio,
  updateUserLastActive,
  getHistory,
  addToHistory,
  removeFromHistory,
  clearHistory,
  getWatchLater,
  addToWatchLater,
  removeFromWatchLater,
  isInWatchLater,
  getLikedVideos,
  addToLikedVideos,
  removeFromLikedVideos,
  isLikedVideo,
  getVideoSettingsForVideo,
  setVideoSettings,
  updateVideoSetting,
  getAppSettings,
  setAppSettings,
  updateAppSetting,
  getSubscribedChannels,
  addToSubscribedChannels,
  removeFromSubscribedChannels,
  isSubscribedToChannel,
  migrateSubscribedChannelsFormat,
  getCommentInteractions,
  getCommentInteractionsForVideo,
  addCommentInteraction,
  removeCommentInteraction,
  getCommentInteractionType,
  LocalStorageManager
} from '../utils/localStorage';

/**
 * Hook for managing user bio in localStorage
 */
export const useUserBio = () => {
  const [userBio, setUserBioState] = useState<UserBio>(getUserBio);

  const updateUserBio = useCallback((newBio: UserBio) => {
    const result = setUserBio(newBio);
    if (result.success) {
      setUserBioState(newBio);
    }
    return result;
  }, []);

  const updateLastActive = useCallback(() => {
    const result = updateUserLastActive();
    if (result.success && result.data) {
      setUserBioState(result.data);
    }
    return result;
  }, []);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: CustomEvent) => {
      if (e.detail.key === 'zentube_user_bio') {
        setUserBioState(getUserBio());
      }
    };

    window.addEventListener('zentubeStorageChange', handleStorageChange as EventListener);
    return () => window.removeEventListener('zentubeStorageChange', handleStorageChange as EventListener);
  }, []);

  return {
    userBio,
    updateUserBio,
    updateLastActive
  };
};

/**
 * Hook for managing video history
 */
export const useHistory = () => {
  const [history, setHistoryState] = useState<StoredVideoData[]>(getHistory);

  const addVideo = useCallback((videoData: StoredVideoData) => {
    const result = addToHistory(videoData);
    if (result.success && result.data) {
      setHistoryState(result.data);
    }
    return result;
  }, []);

  const removeVideo = useCallback((videoId: string) => {
    const result = removeFromHistory(videoId);
    if (result.success && result.data) {
      setHistoryState(result.data);
    }
    return result;
  }, []);

  const clear = useCallback(() => {
    const result = clearHistory();
    if (result.success && result.data) {
      setHistoryState(result.data);
    }
    return result;
  }, []);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: CustomEvent) => {
      if (e.detail.key === 'zentube_history') {
        setHistoryState(getHistory());
      }
    };

    window.addEventListener('zentubeStorageChange', handleStorageChange as EventListener);
    return () => window.removeEventListener('zentubeStorageChange', handleStorageChange as EventListener);
  }, []);

  return {
    history,
    addVideo,
    removeVideo,
    clear
  };
};

/**
 * Hook for managing watch later list
 */
export const useWatchLater = () => {
  const [watchLater, setWatchLaterState] = useState<StoredVideoData[]>(getWatchLater);

  const addVideo = useCallback((videoData: StoredVideoData) => {
    const result = addToWatchLater(videoData);
    if (result.success && result.data) {
      setWatchLaterState(result.data);
    }
    return result;
  }, []);

  const removeVideo = useCallback((videoId: string) => {
    const result = removeFromWatchLater(videoId);
    if (result.success && result.data) {
      setWatchLaterState(result.data);
    }
    return result;
  }, []);

  const isInList = useCallback((videoId: string) => {
    return isInWatchLater(videoId);
  }, []);

  const toggleVideo = useCallback((videoId: string, videoData?: StoredVideoData) => {
    if (isInWatchLater(videoId)) {
      return removeVideo(videoId);
    } else if (videoData) {
      return addVideo(videoData);
    } else {
      return { success: false, error: 'Video data required to add to watch later' };
    }
  }, [addVideo, removeVideo]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: CustomEvent) => {
      if (e.detail.key === 'zentube_watch_later') {
        setWatchLaterState(getWatchLater());
      }
    };

    window.addEventListener('zentubeStorageChange', handleStorageChange as EventListener);
    return () => window.removeEventListener('zentubeStorageChange', handleStorageChange as EventListener);
  }, []);

  return {
    watchLater,
    addVideo,
    removeVideo,
    isInList,
    toggleVideo
  };
};

/**
 * Hook for managing liked videos
 */
export const useLikedVideos = () => {
  const [likedVideos, setLikedVideosState] = useState<StoredVideoData[]>(getLikedVideos);

  const addVideo = useCallback((videoData: StoredVideoData) => {
    const result = addToLikedVideos(videoData);
    if (result.success && result.data) {
      setLikedVideosState(result.data);
    }
    return result;
  }, []);

  const removeVideo = useCallback((videoId: string) => {
    const result = removeFromLikedVideos(videoId);
    if (result.success && result.data) {
      setLikedVideosState(result.data);
    }
    return result;
  }, []);

  const isLiked = useCallback((videoId: string) => {
    return isLikedVideo(videoId);
  }, []);

  const toggleVideo = useCallback((videoId: string, videoData?: StoredVideoData) => {
    if (isLikedVideo(videoId)) {
      return removeVideo(videoId);
    } else if (videoData) {
      return addVideo(videoData);
    } else {
      return { success: false, error: 'Video data required to add to liked videos' };
    }
  }, [addVideo, removeVideo]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: CustomEvent) => {
      if (e.detail.key === 'zentube_liked_videos') {
        setLikedVideosState(getLikedVideos());
      }
    };

    window.addEventListener('zentubeStorageChange', handleStorageChange as EventListener);
    return () => window.removeEventListener('zentubeStorageChange', handleStorageChange as EventListener);
  }, []);

  return {
    likedVideos,
    addVideo,
    removeVideo,
    isLiked,
    toggleVideo
  };
};

/**
 * Hook for managing video-specific settings
 */
export const useVideoSettings = (videoId: string) => {
  const [settings, setSettingsState] = useState<VideoLevelSettings>(
    () => getVideoSettingsForVideo(videoId)
  );

  const updateSettings = useCallback((newSettings: VideoLevelSettings) => {
    const result = setVideoSettings(videoId, newSettings);
    if (result.success) {
      setSettingsState(newSettings);
    }
    return result;
  }, [videoId]);

  const updateSetting = useCallback((key: keyof VideoLevelSettings, value: boolean) => {
    const result = updateVideoSetting(videoId, key, value);
    if (result.success) {
      setSettingsState(prev => ({ ...prev, [key]: value }));
    }
    return result;
  }, [videoId]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: CustomEvent) => {
      if (e.detail.key === 'zentube_video_settings') {
        setSettingsState(getVideoSettingsForVideo(videoId));
      }
    };

    window.addEventListener('zentubeStorageChange', handleStorageChange as EventListener);
    return () => window.removeEventListener('zentubeStorageChange', handleStorageChange as EventListener);
  }, [videoId]);

  return {
    settings,
    updateSettings,
    updateSetting
  };
};

/**
 * Hook for managing app-wide settings including theme
 */
export const useAppSettings = () => {
  const [settings, setSettingsState] = useState<AppSettings>(getAppSettings);

  const updateSettings = useCallback((newSettings: AppSettings) => {
    const result = setAppSettings(newSettings);
    if (result.success) {
      setSettingsState(newSettings);
    }
    return result;
  }, []);

  const updateSetting = useCallback(<K extends keyof AppSettings>(
    key: K, 
    value: AppSettings[K]
  ) => {
    const result = updateAppSetting(key, value);
    if (result.success && result.data) {
      setSettingsState(result.data);
    }
    return result;
  }, []);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: CustomEvent) => {
      if (e.detail.key === 'zentube_app_settings') {
        setSettingsState(getAppSettings());
      }
    };

    window.addEventListener('zentubeStorageChange', handleStorageChange as EventListener);
    return () => window.removeEventListener('zentubeStorageChange', handleStorageChange as EventListener);
  }, []);


  return {
    settings,
    updateSettings,
    updateSetting
  };
};

/**
 * Hook for storage management and monitoring
 */
export const useStorageManager = () => {
  const [storageInfo, setStorageInfo] = useState(() => LocalStorageManager.getStorageInfo());

  const clearAllData = useCallback(() => {
    return LocalStorageManager.clearAll();
  }, []);

  const refreshStorageInfo = useCallback(() => {
    setStorageInfo(LocalStorageManager.getStorageInfo());
  }, []);

  // Refresh storage info when any storage changes occur
  useEffect(() => {
    const handleStorageChange = () => {
      refreshStorageInfo();
    };

    window.addEventListener('zentubeStorageChange', handleStorageChange);
    return () => window.removeEventListener('zentubeStorageChange', handleStorageChange);
  }, [refreshStorageInfo]);

  return {
    storageInfo,
    clearAllData,
    refreshStorageInfo
  };
};

/**
 * Hook for cross-tab synchronization
 */
export const useStorageSync = () => {
  const [lastSyncTime, setLastSyncTime] = useState<number>(Date.now());

  useEffect(() => {
    const handleStorageChange = (e: CustomEvent) => {
      setLastSyncTime(e.detail.timestamp);
    };

    window.addEventListener('zentubeStorageChange', handleStorageChange as EventListener);
    return () => window.removeEventListener('zentubeStorageChange', handleStorageChange as EventListener);
  }, []);

  return {
    lastSyncTime
  };
};

/**
 * Hook for managing subscribed channels
 */
export const useSubscribedChannels = () => {
  const [subscribedChannels, setSubscribedChannelsState] = useState<ChannelData[]>(() => {
    // Migrate old format on first load
    migrateSubscribedChannelsFormat();
    return getSubscribedChannels();
  });

  const addChannel = useCallback((channelData: ChannelData) => {
    const result = addToSubscribedChannels(channelData);
    if (result.success && result.data) {
      setSubscribedChannelsState(result.data);
    }
    return result;
  }, []);

  const removeChannel = useCallback((channelId: string) => {
    const result = removeFromSubscribedChannels(channelId);
    if (result.success && result.data) {
      setSubscribedChannelsState(result.data);
    }
    return result;
  }, []);

  const isSubscribed = useCallback((channelId: string) => {
    return isSubscribedToChannel(channelId);
  }, []);

  const toggleSubscription = useCallback((channelData: ChannelData) => {
    if (isSubscribedToChannel(channelData.id)) {
      return removeChannel(channelData.id);
    } else {
      return addChannel(channelData);
    }
  }, [addChannel, removeChannel]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: CustomEvent) => {
      if (e.detail.key === 'zentube_subscribed_channels') {
        setSubscribedChannelsState(getSubscribedChannels());
      }
    };

    window.addEventListener('zentubeStorageChange', handleStorageChange as EventListener);
    return () => window.removeEventListener('zentubeStorageChange', handleStorageChange as EventListener);
  }, []);

  return {
    subscribedChannels,
    addChannel,
    removeChannel,
    isSubscribed,
    toggleSubscription
  };
};

/**
 * Hook for managing comment interactions for a specific video
 */
export const useCommentInteractions = (videoId: string) => {
  const [interactions, setInteractionsState] = useState<CommentInteraction[]>(
    () => getCommentInteractionsForVideo(videoId)
  );

  const addInteraction = useCallback((commentId: string, type: 'like' | 'dislike') => {
    const result = addCommentInteraction(videoId, commentId, type);
    if (result.success) {
      setInteractionsState(getCommentInteractionsForVideo(videoId));
    }
    return result;
  }, [videoId]);

  const removeInteraction = useCallback((commentId: string) => {
    const result = removeCommentInteraction(videoId, commentId);
    if (result.success) {
      setInteractionsState(getCommentInteractionsForVideo(videoId));
    }
    return result;
  }, [videoId]);

  const getInteractionType = useCallback((commentId: string): 'like' | 'dislike' | null => {
    return getCommentInteractionType(videoId, commentId);
  }, [videoId]);

  const toggleInteraction = useCallback((commentId: string, type: 'like' | 'dislike') => {
    const currentType = getInteractionType(commentId);
    
    if (currentType === type) {
      // Remove interaction if clicking the same type
      return removeInteraction(commentId);
    } else {
      // Add or change interaction
      return addInteraction(commentId, type);
    }
  }, [addInteraction, removeInteraction, getInteractionType]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: CustomEvent) => {
      if (e.detail.key === 'zentube_comment_interactions') {
        setInteractionsState(getCommentInteractionsForVideo(videoId));
      }
    };

    window.addEventListener('zentubeStorageChange', handleStorageChange as EventListener);
    return () => window.removeEventListener('zentubeStorageChange', handleStorageChange as EventListener);
  }, [videoId]);

  return {
    interactions,
    addInteraction,
    removeInteraction,
    getInteractionType,
    toggleInteraction
  };
};