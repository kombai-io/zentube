import { useState, useEffect, useRef } from 'react';
import { useWatchTimeTracker } from '../hooks/useWatchTimeTracker';

interface VideoPlayerProps {
  videoId: string;
  title: string;
}

export default function VideoPlayer({ videoId, title }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true); // Assume autoplay starts the video
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playingCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle video pause when limit is reached
  const handlePauseVideo = () => {
    if (iframeRef.current) {
      // Send pause command to YouTube iframe
      iframeRef.current.contentWindow?.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        '*'
      );
      setIsPlaying(false);
      dispatchVideoStateChange(false);
    }
  };

  // Initialize watch time tracker with actual video state
  const { watchTimeStatus } = useWatchTimeTracker({
    isPlaying,
    onPauseVideo: handlePauseVideo,
  });

  // Dispatch video state changes to other components
  const dispatchVideoStateChange = (playing: boolean) => {
    const event = new CustomEvent('videoStateChange', {
      detail: {
        type: 'playing',
        isPlaying: playing
      }
    });
    window.dispatchEvent(event);
  };

  // More robust playing state detection using document visibility and focus
  const checkPlayingState = () => {
    // If document is hidden or iframe is not focused, assume paused
    if (document.hidden || document.visibilityState === 'hidden') {
      if (isPlaying) {
        console.log('Document hidden, pausing video tracking');
        setIsPlaying(false);
        dispatchVideoStateChange(false);
      }
      return;
    }

    // Check if iframe is in viewport and focused
    if (iframeRef.current) {
      const rect = iframeRef.current.getBoundingClientRect();
      const isInViewport = rect.top >= 0 && rect.left >= 0 && 
                          rect.bottom <= window.innerHeight && 
                          rect.right <= window.innerWidth;
      
      // If iframe is not in viewport, we can't be sure about playing state
      // but we'll rely on the YouTube API messages for now
    }
  };

  // Listen for YouTube player state changes
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com') return;
      
      try {
        const data = JSON.parse(event.data);
        console.log('YouTube message received:', data);
        
        if (data.event === 'video-progress' || data.event === 'onStateChange') {
          // YouTube player states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
          if (data.info === 1) {
            // Video started playing
            console.log('Video playing detected');
            setIsPlaying(true);
            dispatchVideoStateChange(true);
          } else if (data.info === 2 || data.info === 0) {
            // Video paused or ended
            console.log('Video paused/ended detected');
            setIsPlaying(false);
            dispatchVideoStateChange(false);
          } else if (data.info === 3) {
            // Buffering - keep current state but don't count as playing time
            console.log('Video buffering detected');
          }
        }
      } catch (error) {
        // Ignore parsing errors
        console.log('Error parsing YouTube message:', error);
      }
    };

    // Listen for document visibility changes
    const handleVisibilityChange = () => {
      checkPlayingState();
    };

    // Listen for window focus/blur events
    const handleWindowBlur = () => {
      if (isPlaying) {
        console.log('Window lost focus, pausing video tracking');
        setIsPlaying(false);
        dispatchVideoStateChange(false);
      }
    };

    const handleWindowFocus = () => {
      // Don't automatically resume on focus, wait for YouTube API message
      console.log('Window gained focus');
    };

    window.addEventListener('message', handleMessage);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    // Set up interval to periodically check playing state as fallback
    playingCheckIntervalRef.current = setInterval(checkPlayingState, 5000);

    return () => {
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      
      if (playingCheckIntervalRef.current) {
        clearInterval(playingCheckIntervalRef.current);
      }
    };
  }, [isPlaying]);

  // Pause video immediately if limit is already reached when trying to play
  useEffect(() => {
    if (watchTimeStatus.hasReachedLimit && isPlaying) {
      // Small delay to ensure the video player is ready
      setTimeout(() => {
        handlePauseVideo();
      }, 100);
    }
  }, [watchTimeStatus.hasReachedLimit, isPlaying]);

  // Enhanced iframe with better API integration
  useEffect(() => {
    if (iframeRef.current) {
      // Enable JS API and request player state updates
      const iframe = iframeRef.current;
      iframe.onload = () => {
        // Request player state updates every few seconds as fallback
        const requestStateInterval = setInterval(() => {
          if (iframe.contentWindow) {
            iframe.contentWindow.postMessage(
              '{"event":"listening","id":"' + videoId + '"}',
              '*'
            );
          }
        }, 3000);

        // Clean up interval when component unmounts
        return () => clearInterval(requestStateInterval);
      };
    }
  }, [videoId]);

  return (
    <div className="video-player-container">
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1&origin=${window.location.origin}`}
          title={title}
          className="w-full h-full video-iframe"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ filter: 'none !important' }}
        />
      </div>
    </div>
  );
}