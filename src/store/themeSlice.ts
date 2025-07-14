import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  theme: 'dark' | 'light' | 'system';
  resolvedTheme: 'dark' | 'light';
}

// Function to get system theme preference
const getSystemTheme = (): 'dark' | 'light' => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
};

const initialState: ThemeState = {
  theme: 'system',
  resolvedTheme: getSystemTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      if (state.theme === 'system') {
        state.theme = state.resolvedTheme === 'dark' ? 'light' : 'dark';
      } else if (state.theme === 'dark') {
        state.theme = 'light';
      } else {
        state.theme = 'dark';
      }
      
      // Update resolved theme
      if (state.theme === 'system') {
        state.resolvedTheme = getSystemTheme();
      } else {
        state.resolvedTheme = state.theme;
      }
    },
    setTheme: (state, action: PayloadAction<'dark' | 'light' | 'system'>) => {
      state.theme = action.payload;
      if (action.payload === 'system') {
        state.resolvedTheme = getSystemTheme();
      } else {
        state.resolvedTheme = action.payload;
      }
    },
    updateSystemTheme: (state) => {
      if (state.theme === 'system') {
        state.resolvedTheme = getSystemTheme();
      }
    },
  },
});

export const { toggleTheme, setTheme, updateSystemTheme } = themeSlice.actions;
export default themeSlice.reducer;