import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Typography } from './Typography';

interface NavigationItemProps {
  icon: ReactNode;
  hoverIcon?: ReactNode;
  activeHoverIcon?: ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  isCollapsed?: boolean;
}

export default function NavigationItem({ 
  icon, 
  hoverIcon,
  activeHoverIcon,
  label, 
  isActive = false, 
  onClick,
  isCollapsed = false 
}: NavigationItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Determine which icon to show based on active state and hover
  const getDisplayIcon = () => {
    if (isHovered) {
      if (isActive && activeHoverIcon) {
        return activeHoverIcon;
      }
      if (hoverIcon) {
        return hoverIcon;
      }
    }
    return icon;
  };

  // Determine text color based on active state and hover
  const getTextColor = () => {
    if (isHovered && isActive) {
      return '#ffffff'; // White for active items on hover
    }
    if (isHovered) {
      return 'var(--nav-text-hover)'; // Theme-based hover color for non-active items
    }
    return 'inherit'; // Default color
  };
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        w-full gap-5 px-6 py-3 h-auto text-left rounded-tl-none rounded-bl-none rounded-tr-3xl rounded-br-3xl cursor-pointer
        ${isCollapsed ? 'justify-center' : 'justify-start'}
        ${isActive 
          ? 'bg-sidebar-accent border-t border-r border-b border-primary text-sidebar-accent-foreground' 
          : 'text-sidebar-foreground hover:!bg-secondary'
        }
        ${isCollapsed ? 'px-3' : 'px-6'}
      `}
    >
      <div className="flex-shrink-0">
        {getDisplayIcon()}
      </div>
      {!isCollapsed && (
        <Typography
          variant="base"
          weight={isActive ? 'semibold' : 'normal'}
          style={{ 
            color: getTextColor()
          }}
        >
          {label}
        </Typography>
      )}
    </Button>
  );
}