import { uniqueNamesGenerator, colors, animals } from 'unique-names-generator';

// Generate a random username using unique-names-generator
const generateRandomUsername = (): string => {
  return uniqueNamesGenerator({
    dictionaries: [colors, animals],
    separator: '',
    style: 'capital'
  });
};

// Mock data for the user profile page
export const mockRootProps = {
  initialUsername: generateRandomUsername(),
  lastActiveAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  currentTheme: 'system' as const
};