import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileVideo } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  const navigate = useNavigate();

  const handleStartWatching = () => {
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md bg-transparent border-0 shadow-none">
        <CardContent className="flex flex-col items-center text-center p-8">
          <div className="mb-6">
            <FontAwesomeIcon 
              icon={faFileVideo} 
              style={{ 
                fontSize: '64px',
                color: 'var(--muted-foreground)'
              }}
            />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-foreground">
            {title}
          </h3>
          <p className="text-muted-foreground mb-6">
            {description}
          </p>
          <Button 
            onClick={handleStartWatching}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Start watching
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}