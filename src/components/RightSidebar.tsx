import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Typography } from './Typography';

interface RightSidebarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearAll: () => void;
  videosCount: number;
}

export default function RightSidebar({ 
  searchQuery, 
  onSearchChange, 
  onClearAll, 
  videosCount 
}: RightSidebarProps) {
  return (
    <div className="w-80 h-full mt-16">
      <Card className="h-full border-0 rounded-none bg-transparent shadow-none">
        <CardHeader className="pb-4">
          <CardTitle>
            <Typography variant="large" weight="semibold">
              Search & Actions
            </Typography>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Box */}
          <div className="relative">
            <FontAwesomeIcon 
              icon={faSearch} 
              style={{ 
                fontSize: '16px',
                color: 'var(--muted-foreground)'
              }}
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
            />
            <Input
              placeholder="Search videos"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Clear All Button */}
          <Button
            variant="destructive"
            onClick={onClearAll}
            disabled={videosCount === 0}
            className="w-full"
          >
            <FontAwesomeIcon 
              icon={faTrash} 
              style={{ 
                fontSize: '14px',
                marginRight: '8px'
              }}
            />
            <Typography variant="base" weight="medium">
              Clear all videos
            </Typography>
          </Button>

          {/* Video Count */}
          <div className="text-center">
            <Typography variant="small" color="muted-foreground">
              {videosCount} video{videosCount !== 1 ? 's' : ''}
            </Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}