import { ScrollArea } from '@/components/ui/scroll-area';
import { VideoItemData, VideoListSortOrder } from '../types/videoLibrary';
import VideoItem from './VideoItem';
import { useMemo } from 'react';

interface VideoListProps {
  videos: VideoItemData[];
  searchQuery: string;
  sortOrder: VideoListSortOrder;
  onDeleteVideo: (videoId: string) => void;
}

export default function VideoList({ 
  videos, 
  searchQuery, 
  sortOrder, 
  onDeleteVideo 
}: VideoListProps) {
  const filteredAndSortedVideos = useMemo(() => {
    // Filter videos based on search query
    let filtered = videos.filter(video => 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.channelTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort videos based on sort order (by title since we don't have publishedAt)
    filtered.sort((a, b) => {
      if (sortOrder === VideoListSortOrder.NEWEST_FIRST) {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });

    return filtered;
  }, [videos, searchQuery, sortOrder]);

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-6 p-4 max-w-5xl mx-auto">
        {filteredAndSortedVideos.map((video) => (
          <VideoItem
            key={video.id}
            video={video}
            onDelete={onDeleteVideo}
          />
        ))}
      </div>
    </ScrollArea>
  );
}