import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useAppSettings } from '../hooks/useLocalStorage';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { settings, updateSetting } = useAppSettings();
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  // Calculate current theme based on settings and system preference
  useEffect(() => {
    const calculateCurrentTheme = (): 'light' | 'dark' => {
      if (settings.theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light';
      }
      return settings.theme as 'light' | 'dark';
    };

    setCurrentTheme(calculateCurrentTheme());

    // Listen for system theme changes when using system theme
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        setCurrentTheme(calculateCurrentTheme());
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme]);

  const handleToggleTheme = () => {
    // Toggle between light and dark only
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    updateSetting('theme', newTheme);
  };

  // Show moon icon when current theme is dark, sun icon when light
  const icon = currentTheme === 'dark' ? faMoon : faSun;
  
  const ariaLabel = currentTheme === 'light' ? 'Switch to dark theme' : 'Switch to light theme';

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleTheme}
      className={`text-foreground hover:bg-secondary/50 p-2 cursor-pointer group ${className || ''}`}
      aria-label={ariaLabel}
      title={`Current: ${currentTheme} theme`}
    >
      <FontAwesomeIcon 
        icon={icon} 
        style={{ 
          width: '20px', 
          height: '20px',
          color: 'var(--sidebar-foreground)'
        }}
        className="group-hover:text-[var(--header-icon-hover)]"
      />
    </Button>
  );
}