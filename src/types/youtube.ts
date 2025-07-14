// YouTube API response types

export interface YouTubeVideoCategory {
  kind: 'youtube#videoCategory';
  etag: string;
  id: string;
  snippet: {
    channelId: string;
    title: string;
    assignable: boolean;
  };
}

export interface YouTubeVideoCategoriesResponse {
  kind: 'youtube#videoCategoryListResponse';
  etag: string;
  items: YouTubeVideoCategory[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

export interface YouTubeVideoThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface YouTubeVideoThumbnails {
  default: YouTubeVideoThumbnail;
  medium: YouTubeVideoThumbnail;
  high: YouTubeVideoThumbnail;
  standard?: YouTubeVideoThumbnail;
  maxres?: YouTubeVideoThumbnail;
}

export interface YouTubeVideoSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: YouTubeVideoThumbnails;
  channelTitle: string;
  tags?: string[];
  categoryId: string;
  liveBroadcastContent: string;
  localized: {
    title: string;
    description: string;
  };
  defaultAudioLanguage?: string;
  defaultLanguage?: string;
}

export interface YouTubeVideoStatistics {
  viewCount: string;
  likeCount: string;
  favoriteCount: string;
  commentCount: string;
}

export interface YouTubeVideoContentDetails {
  duration: string;
  dimension: string;
  definition: string;
  caption: string;
  licensedContent: boolean;
  contentRating: Record<string, any>;
  projection: string;
}

export interface YouTubeVideo {
  kind: 'youtube#video';
  etag: string;
  id: string;
  snippet: YouTubeVideoSnippet;
  statistics: YouTubeVideoStatistics;
  contentDetails: YouTubeVideoContentDetails;
}

export interface YouTubeVideosResponse {
  kind: 'youtube#videoListResponse';
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YouTubeVideo[];
}

export interface YouTubeApiError {
  error: {
    code: number;
    message: string;
    errors: Array<{
      message: string;
      domain: string;
      reason: string;
    }>;
  };
}

export interface PopularVideosParams {
  regionCode?: string;
  categoryId?: string;
  maxResults?: number;
  pageToken?: string;
}