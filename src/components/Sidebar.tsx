import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faHome, 
  faHistory, 
  faClock, 
  faHeart, 
  faShieldHeart 
} from '@fortawesome/free-solid-svg-icons';
import Logo from './Logo';
import NavigationItem from './NavigationItem';
import SubscriptionsList from './SubscriptionsList';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { toggleSidebar, setActiveItem, SidebarState } from '../store/sidebarSlice';
import { useNavigate, useLocation } from 'react-router-dom';

const navigationItems = [
  { id: 'Home', label: 'Home', icon: faHome },
  { id: 'History', label: 'History', icon: faHistory },
  { id: 'Watch later', label: 'Watch later', icon: faClock },
  { id: 'Liked videos', label: 'Liked videos', icon: faHeart },
  { id: 'Digital Wellbeing', label: 'Digital Wellbeing', icon: faShieldHeart },
];

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { state: sidebarState, activeItem } = useAppSelector((state) => state.sidebar);

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const handleItemClick = (itemId: string) => {
    dispatch(setActiveItem(itemId));
    
    // Navigate to appropriate route
    switch (itemId) {
      case 'Home':
        navigate('/');
        break;
      case 'History':
        navigate('/history');
        break;
      case 'Watch later':
        navigate('/watch-later');
        break;
      case 'Liked videos':
        navigate('/liked-videos');
        break;
      case 'Digital Wellbeing':
        navigate('/digital-wellbeing');
        break;
      default:
        break;
    }
  };

  // Determine active item based on current route
  const getActiveItemFromRoute = () => {
    switch (location.pathname) {
      case '/':
        return 'Home';
      case '/history':
        return 'History';
      case '/watch-later':
        return 'Watch later';
      case '/liked-videos':
        return 'Liked videos';
      case '/digital-wellbeing':
        return 'Digital Wellbeing';
      default:
        return activeItem;
    }
  };

  const currentActiveItem = getActiveItemFromRoute();

  // Get theme-aware colors for icons using CSS custom properties
  const getIconColor = (itemId: string, isActive: boolean) => {
    if (itemId === 'Digital Wellbeing') {
      return 'var(--nav-icon-special)'; // Special items use brand color
    }
    
    if (isActive) {
      return 'var(--nav-icon-active)'; // Active items use brand color
    }
    
    // Use theme-appropriate colors for inactive items
    return 'var(--nav-icon)';
  };

  // Get hover icon color using theme variables
  const getHoverIconColor = (itemId: string) => {
    if (itemId === 'Digital Wellbeing') {
      return 'var(--nav-icon-special-hover)'; // Special hover color for Digital Wellbeing
    }
    
    return 'var(--nav-icon-hover)'; // Theme-appropriate hover color for other items
  };

  // Get active hover icon color - always white for active items
  const getActiveHoverIconColor = () => {
    return '#ffffff'; // White color for active items on hover
  };

  // Don't render sidebar if collapsed
  if (sidebarState === SidebarState.COLLAPSED) {
    return null;
  }

  const isMinimized = sidebarState === SidebarState.MINIMIZED;

  return (
    <div className={`
      bg-sidebar h-screen sticky top-0 flex flex-col transition-all duration-300
      ${isMinimized ? 'w-16' : 'w-[250px]'}
    `}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleSidebar}
          className="text-sidebar-foreground hover:bg-secondary/50 p-2 cursor-pointer group"
        >
          <FontAwesomeIcon 
            icon={faBars} 
            style={{ 
              width: '20px', 
              height: '20px',
              color: 'var(--sidebar-foreground)'
            }}
            className="group-hover:text-[var(--header-icon-hover)]"
          />
        </Button>
        {!isMinimized && <Logo />}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = currentActiveItem === item.id;
            return (
              <NavigationItem
                key={item.id}
                icon={
                  <FontAwesomeIcon 
                    icon={item.icon}
                    style={{ 
                      color: getIconColor(item.id, isActive),
                      width: '18px', 
                      height: '18px' 
                    }}
                  />
                }
                hoverIcon={
                  <FontAwesomeIcon 
                    icon={item.icon}
                    style={{ 
                      color: getHoverIconColor(item.id),
                      width: '18px', 
                      height: '18px' 
                    }}
                  />
                }
                activeHoverIcon={
                  <FontAwesomeIcon 
                    icon={item.icon}
                    style={{ 
                      color: getActiveHoverIconColor(),
                      width: '18px', 
                      height: '18px' 
                    }}
                  />
                }
                label={item.label}
                isActive={isActive}
                onClick={() => handleItemClick(item.id)}
                isCollapsed={isMinimized}
              />
            );
          })}
        </div>
        
        {/* Subscriptions Section */}
        <SubscriptionsList isCollapsed={isMinimized} />
      </nav>
    </div>
  );
}