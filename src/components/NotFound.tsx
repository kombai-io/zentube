import { Button } from './ui/button';
import { Typography } from './Typography';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      {/* 404 Illustration */}
      <div className="mb-8">
        <img
          src="https://images.unsplash.com/photo-1578183561786-a461f6c5e202?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHw0MDQlMjBlcnJvciUyMGxvc3QlMjBjb25mdXNlZCUyMHBhZ2UlMjBub3QlMjBmb3VuZHxlbnwwfDB8fHwxNzUyMDYzNTQ3fDA&ixlib=rb-4.1.0&q=85"
          alt="404 error page illustration - Mitchell Luo on Unsplash"
          className="w-80 h-60 mx-auto object-cover rounded-lg opacity-80"
          style={{ width: '320px', height: '240px' }}
        />
      </div>

      {/* Error Content */}
      <div className="max-w-md space-y-4">
        <Typography 
          as="h1" 
          variant="extra-large" 
          weight="bold" 
          color="foreground"
          className="mb-2"
        >
          Oops! Page Not Found
        </Typography>
        
        <Typography 
          as="p" 
          variant="large" 
          weight="normal" 
          color="muted-foreground"
          className="mb-6"
        >
          The video you're looking for doesn't exist or the link might be broken.
        </Typography>

        <Typography 
          as="p" 
          variant="base" 
          weight="normal" 
          color="muted-foreground"
          className="mb-8"
        >
          Don't worry, you can find plenty of amazing videos on our homepage!
        </Typography>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleGoHome}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3"
          >
            <Typography 
              variant="base" 
              weight="medium" 
              style={{ color: 'inherit' }}
            >
              Go to Homepage
            </Typography>
          </Button>
          
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="px-6 py-3"
          >
            <Typography 
              variant="base" 
              weight="medium" 
              color="foreground"
            >
              Go Back
            </Typography>
          </Button>
        </div>
      </div>
    </div>
  );
}