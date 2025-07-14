import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setSidebarState, setCurrentPage, SidebarState } from '../store/sidebarSlice';

interface LayoutProps {
  children?: ReactNode;
  onSearch?: (query: string) => void;
}

export default function Layout({ children, onSearch }: LayoutProps) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  
  // Check if current page is profile page
  const isProfilePage = location.pathname === '/account';
  
  // Set sidebar state and page context based on route
  useEffect(() => {
    if (location.pathname === '/watch') {
      // Video page: set context and hide sidebar by default
      dispatch(setCurrentPage('video'));
      dispatch(setSidebarState(SidebarState.COLLAPSED));
    } else if (location.pathname === '/account') {
      // Profile page: set context and hide sidebar completely
      dispatch(setCurrentPage('profile'));
      dispatch(setSidebarState(SidebarState.COLLAPSED));
    } else {
      // Home page: set context and show sidebar by default
      dispatch(setCurrentPage('home'));
      dispatch(setSidebarState(SidebarState.SHOWN));
    }
  }, [location.pathname, dispatch]);

  return (
    <div className="flex h-screen bg-background overflow-x-hidden">
      {!isProfilePage && <Sidebar />}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onSearch={onSearch} />
        <main className="flex-1 overflow-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}