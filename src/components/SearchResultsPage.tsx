import { useSearchParams } from 'react-router-dom';
import { useSearchVideosQuery } from '../services/youtubeApi';
import { Typography } from './Typography';
import VideoResultCard from './VideoResultCard';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data: searchResults, isLoading, error } = useSearchVideosQuery(
    { query, maxResults: 30 },
    { skip: !query }
  );

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Search Results</h1>
          <p className="text-muted-foreground">No search query provided</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Searching for "{query}"</h1>
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Search Results</h1>
          <p className="text-red-500">Error loading search results</p>
        </div>
      </div>
    );
  }

  const videos = searchResults?.items || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Typography variant="extra-large" weight="bold" className="mb-2">
          Search Results for "{query}"
        </Typography>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-12">
          <Typography variant="large" color="muted-foreground" className="mb-2">
            No videos found for your search.
          </Typography>
          <Typography variant="base" color="muted-foreground">
            Try different keywords or check your spelling.
          </Typography>
        </div>
      ) : (
        <div className="grid gap-4">
          {videos.map((video) => (
            <VideoResultCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}