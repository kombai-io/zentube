import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faTrash } from '@fortawesome/free-solid-svg-icons';

interface VideoItemMenuProps {
  onDelete: () => void;
}

export default function VideoItemMenu({ onDelete }: VideoItemMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 hover:bg-transparent !hover:bg-transparent cursor-pointer"
        >
          <FontAwesomeIcon 
            icon={faEllipsisV} 
            style={{ 
              fontSize: '16px',
              color: 'var(--foreground)'
            }}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem 
          onClick={onDelete}
          className="text-destructive focus:text-destructive hover:bg-muted cursor-pointer"
        >
          <FontAwesomeIcon 
            icon={faTrash} 
            style={{ 
              fontSize: '14px',
              marginRight: '8px'
            }}
          />
          Delete video
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}