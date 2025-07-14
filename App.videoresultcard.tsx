import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import VideoResultCard from './src/components/VideoResultCard';
import { Typography } from './src/components/Typography';
import type { YouTubeVideo } from './src/types/youtube';

// Mock data for preview
const mockVideo: YouTubeVideo = {
  kind: 'youtube#video',
  etag: 'mock-etag',
  id: 'dQw4w9WgXcQ',
  snippet: {
    publishedAt: '2023-10-15T10:00:00Z',
    channelId: 'UCuAXFkgsw1L7xaCfnd5JJOw',
    title: 'Amazing Nature Documentary: Wildlife in 4K - Breathtaking Landscapes and Animals',
    description: 'Experience the beauty of nature like never before in this stunning 4K documentary featuring incredible wildlife footage and breathtaking landscapes from around the world.',
    thumbnails: {
      default: {
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=320&h=180&fit=crop&crop=center',
        width: 120,
        height: 90
      },
      medium: {
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=480&h=270&fit=crop&crop=center',
        width: 320,
        height: 180
      },
      high: {
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=640&h=360&fit=crop&crop=center',
        width: 480,
        height: 360
      }
    },
    channelTitle: 'Nature Explorer',
    tags: ['nature', 'documentary', '4k', 'wildlife'],
    categoryId: '15',
    liveBroadcastContent: 'none',
    localized: {
      title: 'Amazing Nature Documentary: Wildlife in 4K - Breathtaking Landscapes and Animals',
      description: 'Experience the beauty of nature like never before in this stunning 4K documentary featuring incredible wildlife footage and breathtaking landscapes from around the world.'
    }
  },
  statistics: {
    viewCount: '2847392',
    likeCount: '45231',
    favoriteCount: '0',
    commentCount: '3421'
  },
  contentDetails: {
    duration: 'PT15M42S',
    dimension: '2d',
    definition: 'hd',
    caption: 'false',
    licensedContent: false,
    contentRating: {},
    projection: 'rectangular'
  }
};

const mockVideo2: YouTubeVideo = {
  kind: 'youtube#video',
  etag: 'mock-etag-2',
  id: 'abc123def456',
  snippet: {
    publishedAt: '2023-10-14T14:30:00Z',
    channelId: 'UCexample123',
    title: 'Learn React in 30 Minutes - Complete Beginner Tutorial',
    description: 'A comprehensive React tutorial for beginners covering components, state, props, and hooks. Perfect for getting started with modern web development.',
    thumbnails: {
      default: {
        url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=320&h=180&fit=crop&crop=center',
        width: 120,
        height: 90
      },
      medium: {
        url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=480&h=270&fit=crop&crop=center',
        width: 320,
        height: 180
      },
      high: {
        url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=640&h=360&fit=crop&crop=center',
        width: 480,
        height: 360
      }
    },
    channelTitle: 'Code Academy Pro',
    tags: ['react', 'javascript', 'tutorial', 'programming'],
    categoryId: '27',
    liveBroadcastContent: 'none',
    localized: {
      title: 'Learn React in 30 Minutes - Complete Beginner Tutorial',
      description: 'A comprehensive React tutorial for beginners covering components, state, props, and hooks. Perfect for getting started with modern web development.'
    }
  },
  statistics: {
    viewCount: '892456',
    likeCount: '23847',
    favoriteCount: '0',
    commentCount: '1892'
  },
  contentDetails: {
    duration: 'PT32M18S',
    dimension: '2d',
    definition: 'hd',
    caption: 'true',
    licensedContent: false,
    contentRating: {},
    projection: 'rectangular'
  }
};

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <Typography variant="extra-large" weight="bold" className="mb-2">
            VideoResultCard Component Preview
          </Typography>
          <Typography variant="base" color="muted-foreground">
            Updated with increased thumbnail width (md:w-96 instead of md:w-80)
          </Typography>
        </div>
        
        <div className="space-y-6">
          <div>
            <Typography variant="large" weight="semibold" className="mb-4">
              Nature Documentary Example
            </Typography>
            <VideoResultCard video={mockVideo} />
          </div>
          
          <div>
            <Typography variant="large" weight="semibold" className="mb-4">
              Programming Tutorial Example
            </Typography>
            <VideoResultCard video={mockVideo2} />
          </div>
        </div>
        
        <div className="mt-12 p-6 bg-muted/50 rounded-lg">
          <Typography variant="base" weight="semibold" className="mb-2">
            Changes Made:
          </Typography>
          <Typography variant="base" color="muted-foreground">
            • Increased thumbnail width from <code className="bg-muted px-1 rounded">md:w-80</code> to <code className="bg-muted px-1 rounded">md:w-96</code>
            <br />
            • Increased thumbnail height from <code className="bg-muted px-1 rounded">md:h-48</code> to <code className="bg-muted px-1 rounded">md:h-54</code> to maintain aspect ratio
            <br />
            • This provides a larger, more prominent video thumbnail in the search results
          </Typography>
        </div>
      </div>
    </div>
    </BrowserRouter>
  );
}