import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { useDocumentTitle, getPageTitle } from '../hooks/useDocumentTitle';
import { 
  setSortOrder, 
  setMinimalPlayerMode, 
  setZenTineMode, 
  setCommentsCount 
} from '../store/videoPageSlice';
import { SortOrder, VideoPageProps } from '../types/video';
import { 
  useGetVideoDetailsQuery, 
  useGetVideoCommentsQuery, 
  useGetRecommendedVideosQuery 
} from '../services/youtubeApi';
import { useAppSettings } from '../hooks/useLocalStorage';
import VideoPlayer from './VideoPlayer';
import VideoMetadata from './VideoMetadata';
import EngagementButtons from './EngagementButtons';
import ChannelInfo from './ChannelInfo';
import CommentsSection from './CommentsSection';
import RecommendedVideos from './RecommendedVideos';
import LoadingSpinner from './LoadingSpinner';
import { ErrorState } from './ErrorState';

export default function VideoPage({ videoId, initialSortOrder = SortOrder.NEWEST }: VideoPageProps) {
  const dispatch = useAppDispatch();
  const { sortOrder } = useAppSelector(state => state.videoPage);
  
  // Use local storage for global app settings
  const { settings, updateSetting } = useAppSettings();
  const { minimalPlayerMode, zenTint } = settings;
  
  // Fetch video data from YouTube API
  const { 
    data: videoData, 
    isLoading: videoLoading, 
    error: videoError 
  } = useGetVideoDetailsQuery(videoId);
  
  const { 
    data: comments = [], 
    isLoading: commentsLoading, 
    error: commentsError 
  } = useGetVideoCommentsQuery({ 
    videoId, 
    maxResults: 100, 
    order: sortOrder === SortOrder.NEWEST ? 'time' : 'relevance' 
  });
  
  const { 
    data: recommendedVideos = [], 
    isLoading: recommendedLoading 
  } = useGetRecommendedVideosQuery(videoId);

  // Set document title
  useDocumentTitle(getPageTitle('video', videoData?.title));

  useEffect(() => {
    dispatch(setCommentsCount(comments.length));
    dispatch(setSortOrder(initialSortOrder));
    // Sync local storage settings with Redux state
    dispatch(setMinimalPlayerMode(minimalPlayerMode));
    dispatch(setZenTineMode(zenTint));
  }, [dispatch, comments.length, initialSortOrder, minimalPlayerMode, zenTint]);

  const handleSortChange = (newSortOrder: SortOrder) => {
    dispatch(setSortOrder(newSortOrder));
  };

  const handleMinimalPlayerToggle = (enabled: boolean) => {
    updateSetting('minimalPlayerMode', enabled);
    dispatch(setMinimalPlayerMode(enabled));
  };

  const handleZenTineToggle = (enabled: boolean) => {
    updateSetting('zenTint', enabled);
    dispatch(setZenTineMode(enabled));
  };

  // Show loading state
  if (videoLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  // Show error state
  if (videoError || !videoData) {
    return (
      <div className="flex items-center justify-center h-full">
        <ErrorState 
          message="Failed to load video. Please try again." 
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }

  const sortedComments = [...comments].sort((a, b) => {
    if (sortOrder === SortOrder.NEWEST) {
      return b.publishedAt.getTime() - a.publishedAt.getTime();
    }
    return a.publishedAt.getTime() - b.publishedAt.getTime();
  });

  return (
    <div className="relative">
      {/* Zen Tint Overlay */}
      {zenTint && (
        <div className="zen-tint-overlay" />
      )}
      
      <div className={`flex h-full ${zenTint ? 'zen-tint-active' : ''}`}>
        {/* Main Content - 70% */}
        <div className="flex-[0_0_70%] p-6 space-y-6">
          {/* Video Player - Completely isolated from zen tint */}
          <div className="video-player-container">
            <VideoPlayer videoId={videoId} title={videoData.title} />
          </div>
          
          {/* Video Info - Apply zen tint here */}
          <div className={`space-y-4 ${zenTint ? 'zen-tint-content' : ''}`}>
            <VideoMetadata
              title={videoData.title}
              viewCount={videoData.viewCount}
              publishedAt={videoData.publishedAt}
            />
            
            <div className={`flex items-center justify-between ${zenTint ? 'zen-tint-content' : ''}`}>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground font-bold" style={{ fontSize: 'var(--font-size-base)' }}>
                  {videoData.viewCount.toLocaleString()} views
                </span>
                <span className="text-muted-foreground font-bold" style={{ fontSize: 'var(--font-size-base)' }}>
                  . {new Date(videoData.publishedAt).toLocaleDateString()}
                </span>
              </div>
              
              <EngagementButtons
                videoId={videoId}
                likeCount={videoData.likeCount}
                dislikeCount={videoData.dislikeCount}
                videoTitle={videoData.title}
                channelTitle={videoData.channelTitle}
                thumbnail={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`}
                viewCount={videoData.viewCount}
                description={videoData.description}
              />
            </div>
          </div>
          
          {/* Channel Info */}
          <div className={zenTint ? 'zen-tint-content' : ''}>
            <ChannelInfo
              channelId={videoData.channelId}
              channelTitle={videoData.channelTitle}
              channelThumbnail={videoData.channelThumbnail}
              subscriberCount={videoData.subscriberCount}
              description={videoData.description}
            />
          </div>
          
          {/* Divider */}
          <div className={`h-px bg-border ${zenTint ? 'zen-tint-content' : ''}`}></div>
          
          {/* Comments Section */}
          {!minimalPlayerMode && (
            <div className={zenTint ? 'zen-tint-content' : ''}>
              {commentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : commentsError ? (
                <div className="text-center py-8 text-muted-foreground">
                  Failed to load comments
                </div>
              ) : (
                <CommentsSection
                  videoId={videoId}
                  comments={sortedComments}
                  commentsCount={comments.length}
                  sortOrder={sortOrder}
                  onSortChange={handleSortChange}
                />
              )}
            </div>
          )}
        </div>
        
        {/* Recommended Videos Sidebar - 30% - Always show for settings access */}
        <div className={`flex-[0_0_30%] p-6 space-y-6 ${zenTint ? 'zen-tint-content' : ''}`}>
          {recommendedLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <RecommendedVideos
              videos={recommendedVideos}
              minimalPlayerMode={minimalPlayerMode}
              zenTineMode={zenTint}
              onMinimalPlayerToggle={handleMinimalPlayerToggle}
              onZenTineToggle={handleZenTineToggle}
            />
          )}
        </div>
      </div>
    </div>
  );
}