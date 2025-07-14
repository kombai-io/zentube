import { useEffect } from 'react';

export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;
    
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
};

export const getPageTitle = (pageType: string, customTitle?: string): string => {
  switch (pageType) {
    case 'home':
      return 'ZenTube';
    case 'video':
      return customTitle ? `${customTitle} - ZenTube` : 'ZenTube';
    case 'history':
      return 'History - ZenTube';
    case 'watch-later':
      return 'Watch Later - ZenTube';
    case 'liked-videos':
      return 'Liked Videos - ZenTube';
    default:
      return 'ZenTube';
  }
};