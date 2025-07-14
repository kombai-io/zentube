import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import SearchBar from './SearchBar';
import UserProfileSection from './UserProfileSection';
import WatchTimeDisplay from './WatchTimeDisplay';
import Logo from './Logo';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { toggleSidebar, SidebarState } from '../store/sidebarSlice';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { state: sidebarState, currentPage } = useAppSelector((state) => state.sidebar);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Listen for video playing state changes from the video player
  useEffect(() => {
    const handleVideoStateChange = (event: CustomEvent) => {
      if (event.detail.type === 'playing') {
        console.log('Header received video state change:', event.detail.isPlaying);
        setIsVideoPlaying(event.detail.isPlaying);
      }
    };

    window.addEventListener('videoStateChange', handleVideoStateChange as EventListener);
    
    return () => {
      window.removeEventListener('videoStateChange', handleVideoStateChange as EventListener);
    };
  }, []);

  // Debug: Log the video playing state
  useEffect(() => {
    console.log('Header - isVideoPlaying:', isVideoPlaying);
  }, [isVideoPlaying]);

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  // Hide hamburger menu on profile page
  const isProfilePage = location.pathname === '/account';
  // Show hamburger menu only when sidebar is completely hidden (collapsed) and not on profile page
  const showHamburger = sidebarState === SidebarState.COLLAPSED && !isProfilePage;

  return (
    <div className="bg-background sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          {showHamburger && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleSidebar}
                className="text-foreground hover:bg-secondary/50 p-2 cursor-pointer group"
              >
                <FontAwesomeIcon 
                  icon={faBars} 
                  style={{ 
                    width: '20px', 
                    height: '20px',
                    color: 'var(--foreground)'
                  }}
                />
              </Button>
              <Logo />
            </>
          )}
          {isProfilePage && <Logo />}
        </div>
        <div className="flex-1 max-w-2xl mx-auto">
          <SearchBar onSearch={onSearch} />
        </div>
        <div className="flex items-center gap-4">
          <WatchTimeDisplay isPlaying={isVideoPlaying} />
          <UserProfileSection />
        </div>
      </div>
    </div>
  );
}