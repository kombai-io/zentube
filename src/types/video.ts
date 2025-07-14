// Video page related enums
export enum SortOrder {
  NEWEST = 'newest',
  OLDEST = 'oldest'
}

export enum VideoPlayerState {
  PLAYING = 'playing',
  PAUSED = 'paused',
  ENDED = 'ended'
}

export enum SettingsToggleType {
  MINIMAL_PLAYER = 'minimal_player',
  ZEN_TINE = 'zen_tine'
}

// Props types (data passed to components)
export interface VideoPageProps {
  videoId: string;
  initialSortOrder?: SortOrder;
}

export interface VideoDetails {
  id: string;
  title: string;
  description: string;
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  publishedAt: Date;
  duration: string;
  channelId: string;
  channelTitle: string;
  channelThumbnail: string;
  subscriberCount: number;
  isSubscribed: boolean;
}

export interface Comment {
  id: string;
  authorDisplayName: string;
  authorProfileImageUrl: string;
  textDisplay: string;
  likeCount: number;
  publishedAt: Date;
  replies: Comment[];
}

export interface RecommendedVideo {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  viewCount: number;
  publishedAt: Date;
  duration: string;
}

// Query types (API response data)
export interface VideoQueryResponse {
  videoDetails: VideoDetails;
  comments: Comment[];
  recommendedVideos: RecommendedVideo[];
}

// Store types (global state data)
export interface VideoPageState {
  currentVideoId: string | null;
  sortOrder: SortOrder;
  minimalPlayerMode: boolean;
  zenTineMode: boolean;
  commentsCount: number;
}