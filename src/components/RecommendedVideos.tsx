import { RecommendedVideo } from '../types/video';
import { useVideoNavigation } from '../hooks/useVideoNavigation';
import RecommendedVideoCard from './RecommendedVideoCard';
import SettingsPanel from './SettingsPanel';

interface RecommendedVideosProps {
  videos: RecommendedVideo[];
  minimalPlayerMode: boolean;
  zenTineMode: boolean;
  onVideoClick?: (videoId: string) => void;
  onMinimalPlayerToggle: (enabled: boolean) => void;
  onZenTineToggle: (enabled: boolean) => void;
}

export default function RecommendedVideos({ 
  videos, 
  minimalPlayerMode, 
  zenTineMode,
  onVideoClick,
  onMinimalPlayerToggle,
  onZenTineToggle
}: RecommendedVideosProps) {
  const { navigateToVideo } = useVideoNavigation();

  const handleVideoClick = (videoId: string) => {
    if (onVideoClick) {
      onVideoClick(videoId);
    } else {
      navigateToVideo(videoId);
    }
  };

  return (
    <div className="space-y-6">
      <SettingsPanel
        minimalPlayerMode={minimalPlayerMode}
        zenTineMode={zenTineMode}
        onMinimalPlayerToggle={onMinimalPlayerToggle}
        onZenTineToggle={onZenTineToggle}
      />
      
      {/* Only hide recommended videos in minimal player mode, not the settings */}
      {!minimalPlayerMode && (
        <div className="space-y-3">
          {videos.map((video) => (
            <RecommendedVideoCard
              key={video.id}
              video={video}
              onClick={() => handleVideoClick(video.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}