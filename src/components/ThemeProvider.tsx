import { useEffect, useState } from 'react';
import { useAppDispatch } from '../hooks/redux';
import { setTheme } from '../store/themeSlice';
import { getAppSettings } from '../utils/localStorage';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const dispatch = useAppDispatch();
  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    const settings = getAppSettings();
    return settings.theme;
  });

  // Initialize Redux store with theme from localStorage
  useEffect(() => {
    const settings = getAppSettings();
    dispatch(setTheme(settings.theme as 'light' | 'dark' | 'system'));
  }, [dispatch]);

  useEffect(() => {
    const applyTheme = (theme: string) => {
      // Remove existing theme classes
      document.documentElement.classList.remove('dark', 'light');
      
      if (theme !== 'system') {
        document.documentElement.classList.add(theme);
      } else {
        // Use system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
      }
    };

    applyTheme(currentTheme);

    // Listen for system theme changes when using system theme
    if (currentTheme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = () => {
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(mediaQuery.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }
  }, [currentTheme]);

  // Listen for theme changes from localStorage
  useEffect(() => {
    const handleStorageChange = (e: CustomEvent) => {
      if (e.detail.key === 'zentube_app_settings') {
        const settings = getAppSettings();
        setCurrentTheme(settings.theme);
        // Also update Redux store
        dispatch(setTheme(settings.theme as 'light' | 'dark' | 'system'));
      }
    };

    window.addEventListener('zentubeStorageChange', handleStorageChange as EventListener);
    return () => window.removeEventListener('zentubeStorageChange', handleStorageChange as EventListener);
  }, [dispatch]);

  return <>{children}</>;
}