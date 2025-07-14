// Video library page types
export enum VideoLibraryType {
  HISTORY = 'history',
  WATCH_LATER = 'watch-later', 
  LIKED_VIDEOS = 'liked-videos'
}

export enum VideoListSortOrder {
  NEWEST_FIRST = 'newest',
  OLDEST_FIRST = 'oldest'
}

// Props types (data passed to components)
export interface VideoLibraryPageProps {
  libraryType: VideoLibraryType;
}

export interface VideoItemData {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  viewCount: number;
  duration: string;
  description?: string;
}

export interface VideoLibraryState {
  videos: VideoItemData[];
  searchQuery: string;
  sortOrder: VideoListSortOrder;
  isLoading: boolean;
}