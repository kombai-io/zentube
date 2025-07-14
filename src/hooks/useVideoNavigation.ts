import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { addToHistory } from '../utils/localStorage';
import { StoredVideoData } from '../types/localStorage';

export const useVideoNavigation = () => {
  const navigate = useNavigate();

  const navigateToVideo = useCallback((videoId: string, videoData?: Partial<StoredVideoData>) => {
    // Store video in history if video data is provided
    if (videoData && videoData.title && videoData.channelTitle && videoData.thumbnail) {
      const historyData: StoredVideoData = {
        id: videoId,
        title: videoData.title,
        channelTitle: videoData.channelTitle,
        thumbnail: videoData.thumbnail,
        viewCount: videoData.viewCount || 0,
        description: videoData.description || '',
        addedAt: new Date()
      };
      addToHistory(historyData);
    }
    
    navigate(`/watch?v=${videoId}`);
  }, [navigate]);

  return { navigateToVideo };
};