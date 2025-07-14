import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export default function UserProfileSection() {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/account');
  };

  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleProfileClick}
        className="text-foreground hover:bg-secondary/50 p-2 cursor-pointer group"
      >
        <FontAwesomeIcon 
          icon={faUser} 
          style={{ 
            width: '20px', 
            height: '20px',
            color: 'var(--sidebar-foreground)'
          }}
          className="group-hover:text-[var(--header-icon-hover)]"
        />
      </Button>
    </div>
  );
}