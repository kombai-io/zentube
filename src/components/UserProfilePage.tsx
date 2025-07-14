import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uniqueNamesGenerator, colors, animals } from 'unique-names-generator';
import { toast } from 'sonner';
import { Typography } from './Typography';
import UserProfileHeader from './UserProfileHeader';
import AppearanceSection from './AppearanceSection';
import DigitalWellbeingSection from './DigitalWellbeingSection';
import DangerZoneSection from './DangerZoneSection';
import { useAppDispatch } from '../hooks/redux';
import { setTheme } from '../store/themeSlice';
import { 
  getUserBio, 
  setUserBio, 
  updateUserLastActive, 
  getAppSettings, 
  updateAppSetting,
  LocalStorageManager 
} from '../utils/localStorage';
import { DEFAULT_USER_BIO } from '../types/localStorage';

export default function UserProfilePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [userBio, setUserBioState] = useState(() => {
    const bio = getUserBio();
    // Ensure lastActiveAt is a Date object
    return {
      ...bio,
      lastActiveAt: bio.lastActiveAt instanceof Date ? bio.lastActiveAt : new Date(bio.lastActiveAt)
    };
  });
  const [appSettings, setAppSettingsState] = useState(() => getAppSettings());

  // Initialize user with random name if it's the default
  useEffect(() => {
    if (userBio.name === DEFAULT_USER_BIO.name) {
      const randomName = uniqueNamesGenerator({
        dictionaries: [colors, animals],
        separator: '',
        style: 'capital'
      });
      
      const newBio = { ...userBio, name: randomName, lastActiveAt: new Date() };
      setUserBio(newBio);
      setUserBioState(newBio);
    }
    
    // Update last active time
    updateUserLastActive();
  }, []);

  const handleUsernameChange = (newUsername: string) => {
    const updatedBio = { ...userBio, name: newUsername, lastActiveAt: new Date() };
    const result = setUserBio(updatedBio);
    
    if (result.success) {
      setUserBioState(updatedBio);
      toast.success('Username updated successfully');
    } else {
      toast.error('Failed to update username');
    }
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    const result = updateAppSetting('theme', theme);
    
    if (result.success) {
      setAppSettingsState(prev => ({ ...prev, theme }));
      // Update Redux store as well
      dispatch(setTheme(theme));
      toast.success('Theme updated successfully');
    } else {
      toast.error('Failed to update theme');
    }
  };

  const handleDeleteAllData = () => {
    const result = LocalStorageManager.clearAll();
    
    if (result.success) {
      toast.success('All data deleted successfully');
      // Navigate to home page after deletion
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      toast.error('Failed to delete data');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Typography 
            as="h1" 
            weight="bold" 
            style={{ fontSize: '24px' }} 
            className="mb-2"
          >
            Account
          </Typography>
          <Typography 
            color="muted-foreground" 
            style={{ fontSize: '14px' }}
          >
            Manage your account settings and preferences
          </Typography>
        </div>

        <div className="space-y-6">
          <UserProfileHeader
            username={userBio.name}
            lastActiveAt={userBio.lastActiveAt}
            onUsernameChange={handleUsernameChange}
          />

          <AppearanceSection
            currentTheme={appSettings.theme}
            onThemeChange={handleThemeChange}
          />

          <DigitalWellbeingSection />

          <DangerZoneSection onDeleteAllData={handleDeleteAllData} />
        </div>
      </div>
    </div>
  );
}