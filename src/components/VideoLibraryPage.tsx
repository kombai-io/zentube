import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { VideoLibraryType, VideoItemData, VideoListSortOrder } from '../types/videoLibrary';
import { getPageTitle, getEmptyStateMessage } from '../utils/videoLibraryFormatters';
import { useDocumentTitle, getPageTitle as getDocumentTitle } from '../hooks/useDocumentTitle';
import { 
  getHistory, 
  getWatchLater, 
  getLikedVideos,
  removeFromHistory,
  removeFromWatchLater,
  removeFromLikedVideos,
  clearHistory,
  clearWatchLater,
  clearLikedVideos
} from '../utils/localStorage';
import { useGetVideoDetailsQuery } from '../services/youtubeApi';
import Layout from './Layout';
import VideoList from './VideoList';
import EmptyState from './EmptyState';
import RightSidebar from './RightSidebar';

export default function VideoLibraryPage() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<VideoListSortOrder>(VideoListSortOrder.NEWEST_FIRST);
  const [videos, setVideos] = useState<VideoItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Determine library type from route
  const libraryType = useMemo(() => {
    if (location.pathname === '/history') return VideoLibraryType.HISTORY;
    if (location.pathname === '/watch-later') return VideoLibraryType.WATCH_LATER;
    if (location.pathname === '/liked-videos') return VideoLibraryType.LIKED_VIDEOS;
    return VideoLibraryType.HISTORY;
  }, [location.pathname]);

  // Get stored video data based on library type
  const storedVideos = useMemo(() => {
    switch (libraryType) {
      case VideoLibraryType.HISTORY:
        return getHistory();
      case VideoLibraryType.WATCH_LATER:
        return getWatchLater();
      case VideoLibraryType.LIKED_VIDEOS:
        return getLikedVideos();
      default:
        return [];
    }
  }, [libraryType]);

  // Convert stored video data to VideoItemData format
  useEffect(() => {
    setIsLoading(true);
    
    const videoDetails: VideoItemData[] = storedVideos.map(storedVideo => ({
      id: storedVideo.id,
      title: storedVideo.title,
      channelTitle: storedVideo.channelTitle,
      thumbnail: storedVideo.thumbnail,
      viewCount: storedVideo.viewCount,
      duration: 'PT23M45S', // Default duration since it's not stored
      description: storedVideo.description
    }));

    setVideos(videoDetails);
    setIsLoading(false);
  }, [storedVideos]);

  const handleDeleteVideo = (videoId: string) => {
    switch (libraryType) {
      case VideoLibraryType.HISTORY:
        removeFromHistory(videoId);
        break;
      case VideoLibraryType.WATCH_LATER:
        removeFromWatchLater(videoId);
        break;
      case VideoLibraryType.LIKED_VIDEOS:
        removeFromLikedVideos(videoId);
        break;
    }
    
    // Update local state
    setVideos(prev => prev.filter(video => video.id !== videoId));
  };

  const handleClearAll = () => {
    switch (libraryType) {
      case VideoLibraryType.HISTORY:
        clearHistory();
        break;
      case VideoLibraryType.WATCH_LATER:
        clearWatchLater();
        break;
      case VideoLibraryType.LIKED_VIDEOS:
        clearLikedVideos();
        break;
    }
    
    // Clear local state
    setVideos([]);
  };

  const pageTitle = getPageTitle(libraryType);
  const emptyStateMessage = getEmptyStateMessage(libraryType);

  // Set document title based on library type
  const documentTitle = useMemo(() => {
    switch (libraryType) {
      case VideoLibraryType.HISTORY:
        return getDocumentTitle('history');
      case VideoLibraryType.WATCH_LATER:
        return getDocumentTitle('watch-later');
      case VideoLibraryType.LIKED_VIDEOS:
        return getDocumentTitle('liked-videos');
      default:
        return getDocumentTitle('home');
    }
  }, [libraryType]);

  useDocumentTitle(documentTitle);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-full">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex h-full">
        {/* Main Content */}
        <div className="flex-1 flex flex-col mt-16">
          {/* Video Content */}
          <div className="flex-1">
            {videos.length === 0 ? (
              <EmptyState 
                title={emptyStateMessage.title}
                description={emptyStateMessage.description}
              />
            ) : (
              <VideoList
                videos={videos}
                searchQuery={searchQuery}
                sortOrder={sortOrder}
                onDeleteVideo={handleDeleteVideo}
              />
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <RightSidebar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearAll={handleClearAll}
          videosCount={videos.length}
        />
      </div>
    </Layout>
  );
}