import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { 
  YouTubeVideoCategoriesResponse, 
  YouTubeVideosResponse, 
  PopularVideosParams 
} from '../types/youtube';
import type { VideoDetails, Comment, RecommendedVideo } from '../types/video';

// YouTube Data API v3 base URL
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Hard-coded YouTube API key
const API_KEY = 'AIzaSyDsh49EmSLD2FNba-LkA1gQBB75Mcsfv9k';

export const youtubeApi = createApi({
  reducerPath: 'youtubeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: YOUTUBE_API_BASE_URL,
  }),
  tagTypes: ['VideoCategories', 'PopularVideos', 'VideoDetails', 'VideoComments', 'RecommendedVideos', 'SearchSuggestions', 'SearchVideos'],
  endpoints: (builder) => ({
    // Fetch individual video details
    getVideoDetails: builder.query<VideoDetails, string>({
      queryFn: async (videoId) => {
        try {
          if (!API_KEY) {
            throw new Error('YouTube API key is not configured');
          }

          const response = await fetch(`${YOUTUBE_API_BASE_URL}/videos?${new URLSearchParams({
            part: 'snippet,statistics,contentDetails',
            id: videoId,
            key: API_KEY,
          })}`);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data: YouTubeVideosResponse = await response.json();
          
          if (!data.items || data.items.length === 0) {
            throw new Error('Video not found');
          }

          const video = data.items[0];
          
          // Fetch channel details for subscriber count
          const channelResponse = await fetch(`${YOUTUBE_API_BASE_URL}/channels?${new URLSearchParams({
            part: 'snippet,statistics',
            id: video.snippet.channelId,
            key: API_KEY,
          })}`);

          let subscriberCount = 0;
          let channelThumbnail = '';
          
          if (channelResponse.ok) {
            const channelData = await channelResponse.json();
            if (channelData.items && channelData.items.length > 0) {
              subscriberCount = parseInt(channelData.items[0].statistics?.subscriberCount || '0');
              channelThumbnail = channelData.items[0].snippet?.thumbnails?.default?.url || '';
            }
          }

          const videoDetails: VideoDetails = {
            id: video.id,
            title: video.snippet.title,
            description: video.snippet.description,
            viewCount: parseInt(video.statistics.viewCount),
            likeCount: parseInt(video.statistics.likeCount || '0'),
            dislikeCount: 0, // YouTube API no longer provides dislike count
            publishedAt: new Date(video.snippet.publishedAt),
            duration: video.contentDetails.duration,
            channelId: video.snippet.channelId,
            channelTitle: video.snippet.channelTitle,
            channelThumbnail,
            subscriberCount,
            isSubscribed: false, // This would need user authentication
          };

          return { data: videoDetails };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      providesTags: (result, error, videoId) => [{ type: 'VideoDetails', id: videoId }],
    }),

    // Fetch video comments
    getVideoComments: builder.query<Comment[], { videoId: string; maxResults?: number; order?: string }>({
      queryFn: async ({ videoId, maxResults = 100, order = 'relevance' }) => {
        try {
          if (!API_KEY) {
            throw new Error('YouTube API key is not configured');
          }

          const response = await fetch(`${YOUTUBE_API_BASE_URL}/commentThreads?${new URLSearchParams({
            part: 'snippet,replies',
            videoId,
            maxResults: Math.min(maxResults, 100).toString(),
            order,
            key: API_KEY,
          })}`);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          
          const comments: Comment[] = data.items?.map((item: any) => ({
            id: item.id,
            authorDisplayName: item.snippet.topLevelComment.snippet.authorDisplayName,
            authorProfileImageUrl: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
            textDisplay: item.snippet.topLevelComment.snippet.textDisplay,
            likeCount: item.snippet.topLevelComment.snippet.likeCount,
            publishedAt: new Date(item.snippet.topLevelComment.snippet.publishedAt),
            replies: item.replies?.comments?.map((reply: any) => ({
              id: reply.id,
              authorDisplayName: reply.snippet.authorDisplayName,
              authorProfileImageUrl: reply.snippet.authorProfileImageUrl,
              textDisplay: reply.snippet.textDisplay,
              likeCount: reply.snippet.likeCount,
              publishedAt: new Date(reply.snippet.publishedAt),
              replies: [],
            })) || [],
          })) || [];

          return { data: comments };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      providesTags: (result, error, { videoId }) => [{ type: 'VideoComments', id: videoId }],
    }),

    // Fetch recommended videos based on current video
    getRecommendedVideos: builder.query<RecommendedVideo[], string>({
      queryFn: async (videoId) => {
        try {
          if (!API_KEY) {
            throw new Error('YouTube API key is not configured');
          }

          // Since YouTube removed related videos API, we'll fetch popular videos instead
          const response = await fetch(`${YOUTUBE_API_BASE_URL}/videos?${new URLSearchParams({
            part: 'snippet,statistics,contentDetails',
            chart: 'mostPopular',
            regionCode: 'US',
            maxResults: '20',
            key: API_KEY,
          })}`);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data: YouTubeVideosResponse = await response.json();
          
          const recommendedVideos: RecommendedVideo[] = data.items?.map((video) => ({
            id: video.id,
            title: video.snippet.title,
            thumbnail: video.snippet.thumbnails.medium.url,
            channelTitle: video.snippet.channelTitle,
            viewCount: parseInt(video.statistics.viewCount),
            publishedAt: new Date(video.snippet.publishedAt),
            duration: video.contentDetails.duration,
          })) || [];

          return { data: recommendedVideos };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      providesTags: ['RecommendedVideos'],
    }),
    // Fetch video categories (maximum 50, requesting 50 to ensure at least 30)
    getVideoCategories: builder.query<YouTubeVideoCategoriesResponse, { regionCode?: string }>({
      query: ({ regionCode = 'US' } = {}) => {
        // Ensure API key is available before making request
        if (!API_KEY) {
          throw new Error('YouTube API key is not configured. Please set VITE_YOUTUBE_API_KEY in your .env file');
        }
        
        return {
          url: '/videoCategories',
          params: {
            part: 'snippet',
            regionCode,
            maxResults: 50,
            key: API_KEY,
          },
        };
      },
      providesTags: ['VideoCategories'],
    }),

    // Fetch most popular videos (single request, max 50)
    getPopularVideos: builder.query<YouTubeVideosResponse, PopularVideosParams>({
      query: ({ 
        regionCode = 'US', 
        categoryId, 
        maxResults = 50, 
        pageToken 
      } = {}) => {
        // Ensure API key is available before making request
        if (!API_KEY) {
          throw new Error('YouTube API key is not configured. Please set VITE_YOUTUBE_API_KEY in your .env file');
        }
        
        const params: Record<string, string | number> = {
          part: 'snippet,statistics,contentDetails',
          chart: 'mostPopular',
          regionCode,
          maxResults: Math.min(maxResults, 50), // YouTube API max is 50
          key: API_KEY,
        };

        // Add optional parameters
        if (categoryId) {
          params.videoCategoryId = categoryId;
        }
        if (pageToken) {
          params.pageToken = pageToken;
        }

        return {
          url: '/videos',
          params,
        };
      },
      providesTags: ['PopularVideos'],
    }),

    // Fetch multiple pages of popular videos to get more than 50
    getPopularVideosMultiple: builder.query<YouTubeVideosResponse, PopularVideosParams>({
      queryFn: async ({ regionCode = 'US', categoryId, maxResults = 50 }, { dispatch }) => {
        try {
          // Ensure API key is available before making request
          if (!API_KEY) {
            throw new Error('YouTube API key is not configured. Please set VITE_YOUTUBE_API_KEY in your .env file');
          }

          const allVideos: any[] = [];
          let nextPageToken: string | undefined = undefined;
          const videosPerRequest = 50; // YouTube API maximum
          const totalRequests = Math.ceil(maxResults / videosPerRequest);

          for (let i = 0; i < totalRequests && allVideos.length < maxResults; i++) {
            const params: Record<string, string | number> = {
              part: 'snippet,statistics,contentDetails',
              chart: 'mostPopular',
              regionCode,
              maxResults: Math.min(videosPerRequest, maxResults - allVideos.length),
              key: API_KEY,
            };

            if (categoryId) {
              params.videoCategoryId = categoryId;
            }
            if (nextPageToken) {
              params.pageToken = nextPageToken;
            }

            const response = await fetch(`${YOUTUBE_API_BASE_URL}/videos?${new URLSearchParams(params as any)}`);
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: YouTubeVideosResponse = await response.json();
            
            if (data.items) {
              allVideos.push(...data.items);
            }

            nextPageToken = data.nextPageToken;
            
            // If no more pages, break
            if (!nextPageToken) {
              break;
            }
          }

          return {
            data: {
              kind: 'youtube#videoListResponse',
              etag: 'combined-response',
              pageInfo: {
                totalResults: allVideos.length,
                resultsPerPage: allVideos.length,
              },
              items: allVideos.slice(0, maxResults),
            } as YouTubeVideosResponse
          };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      providesTags: ['PopularVideos'],
    }),

    // Fetch 200 videos belonging to a particular category
    get200VideosByCategory: builder.query<YouTubeVideosResponse, { categoryId: string; regionCode?: string }>({
      queryFn: async ({ categoryId, regionCode = 'US' }) => {
        try {
          // Ensure API key is available before making request
          if (!API_KEY) {
            throw new Error('YouTube API key is not configured. Please set VITE_YOUTUBE_API_KEY in your .env file');
          }

          if (!categoryId) {
            throw new Error('Category ID is required');
          }

          const allVideos: any[] = [];
          let nextPageToken: string | undefined = undefined;
          const videosPerRequest = 50; // YouTube API maximum
          const targetVideoCount = 200;
          const maxRequests = Math.ceil(targetVideoCount / videosPerRequest); // 4 requests to get 200 videos

          for (let i = 0; i < maxRequests && allVideos.length < targetVideoCount; i++) {
            const params: Record<string, string | number> = {
              part: 'snippet,statistics,contentDetails',
              chart: 'mostPopular',
              regionCode,
              videoCategoryId: categoryId,
              maxResults: Math.min(videosPerRequest, targetVideoCount - allVideos.length),
              key: API_KEY,
            };

            if (nextPageToken) {
              params.pageToken = nextPageToken;
            }

            const response = await fetch(`${YOUTUBE_API_BASE_URL}/videos?${new URLSearchParams(params as any)}`);
            
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const data: YouTubeVideosResponse = await response.json();
            
            if (data.items && data.items.length > 0) {
              allVideos.push(...data.items);
            }

            nextPageToken = data.nextPageToken;
            
            // If no more pages available, break
            if (!nextPageToken) {
              break;
            }

            // Add a small delay between requests to be respectful to the API
            if (i < maxRequests - 1) {
              await new Promise(resolve => setTimeout(resolve, 100));
            }
          }

          return {
            data: {
              kind: 'youtube#videoListResponse',
              etag: `category-${categoryId}-response`,
              pageInfo: {
                totalResults: allVideos.length,
                resultsPerPage: allVideos.length,
              },
              items: allVideos.slice(0, targetVideoCount), // Ensure we don't exceed 200
            } as YouTubeVideosResponse
          };
        } catch (error) {
          return { 
            error: { 
              status: 'FETCH_ERROR', 
              error: error instanceof Error ? error.message : String(error) 
            } 
          };
        }
      },
      providesTags: (result, error, { categoryId }) => [
        { type: 'PopularVideos', id: `category-${categoryId}` }
      ],
    }),

    // Get search suggestions using YouTube search API
    getSearchSuggestions: builder.query<string[], string>({
      queryFn: async (query) => {
        try {
          if (!query || query.length < 2) {
            return { data: [] };
          }

          if (!API_KEY) {
            throw new Error('YouTube API key is not configured');
          }

          // Use YouTube search API to get related search terms
          const response = await fetch(`${YOUTUBE_API_BASE_URL}/search?${new URLSearchParams({
            part: 'snippet',
            q: query,
            type: 'video',
            maxResults: '15',
            key: API_KEY,
          })}`);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          
          // Extract unique search suggestions from video titles and channel names
          const suggestions = new Set<string>();
          
          // Add the original query as first suggestion
          suggestions.add(query);
          
          // Extract keywords from video titles
          data.items?.forEach((item: any) => {
            const title = item.snippet.title.toLowerCase();
            const channelTitle = item.snippet.channelTitle.toLowerCase();
            
            // Add variations of the search query found in titles
            const words = title.split(/\s+/);
            const queryWords = query.toLowerCase().split(/\s+/);
            
            // Find phrases that start with query words
            for (let i = 0; i < words.length; i++) {
              for (let len = 1; len <= Math.min(4, words.length - i); len++) {
                const phrase = words.slice(i, i + len).join(' ');
                if (phrase.includes(query.toLowerCase()) && phrase.length > query.length) {
                  suggestions.add(phrase);
                }
              }
            }
            
            // Add channel name if it contains the query
            if (channelTitle.includes(query.toLowerCase())) {
              suggestions.add(channelTitle);
            }
          });
          
          // Convert to array and limit to 15 suggestions
          const suggestionArray = Array.from(suggestions).slice(0, 15);
          
          return { data: suggestionArray };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      providesTags: ['SearchSuggestions'],
    }),

    // Search videos by query
    searchVideos: builder.query<YouTubeVideosResponse, { query: string; maxResults?: number }>({
      queryFn: async ({ query, maxResults = 30 }) => {
        try {
          if (!API_KEY) {
            throw new Error('YouTube API key is not configured');
          }

          if (!query) {
            throw new Error('Search query is required');
          }

          const response = await fetch(`${YOUTUBE_API_BASE_URL}/search?${new URLSearchParams({
            part: 'snippet',
            q: query,
            type: 'video',
            maxResults: Math.min(maxResults, 50).toString(),
            key: API_KEY,
          })}`);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const searchData = await response.json();
          
          if (!searchData.items || searchData.items.length === 0) {
            return {
              data: {
                kind: 'youtube#videoListResponse',
                etag: 'search-response',
                pageInfo: {
                  totalResults: 0,
                  resultsPerPage: 0,
                },
                items: [],
              } as YouTubeVideosResponse
            };
          }

          // Get video IDs to fetch additional details
          const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
          
          // Fetch video details for statistics and content details
          const detailsResponse = await fetch(`${YOUTUBE_API_BASE_URL}/videos?${new URLSearchParams({
            part: 'snippet,statistics,contentDetails',
            id: videoIds,
            key: API_KEY,
          })}`);

          if (!detailsResponse.ok) {
            throw new Error(`HTTP error! status: ${detailsResponse.status}`);
          }

          const detailsData: YouTubeVideosResponse = await detailsResponse.json();

          return { data: detailsData };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      providesTags: ['SearchVideos'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetVideoCategoriesQuery,
  useLazyGetVideoCategoriesQuery,
  useGetPopularVideosQuery,
  useLazyGetPopularVideosQuery,
  useGetPopularVideosMultipleQuery,
  useLazyGetPopularVideosMultipleQuery,
  useGet200VideosByCategoryQuery,
  useLazyGet200VideosByCategoryQuery,
  useGetVideoDetailsQuery,
  useLazyGetVideoDetailsQuery,
  useGetVideoCommentsQuery,
  useLazyGetVideoCommentsQuery,
  useGetRecommendedVideosQuery,
  useLazyGetRecommendedVideosQuery,
  useGetSearchSuggestionsQuery,
  useLazyGetSearchSuggestionsQuery,
  useSearchVideosQuery,
  useLazySearchVideosQuery,
} = youtubeApi;