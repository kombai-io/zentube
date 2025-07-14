import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum SidebarState {
  COLLAPSED = 'collapsed', // Hidden
  MINIMIZED = 'minimized', // Icons only
  SHOWN = 'shown' // Full width
}

interface SidebarSliceState {
  state: SidebarState;
  activeItem: string;
  currentPage: 'home' | 'video';
}

const initialState: SidebarSliceState = {
  state: SidebarState.SHOWN,
  activeItem: 'Home',
  currentPage: 'home',
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setSidebarState: (state, action: PayloadAction<SidebarState>) => {
      state.state = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<'home' | 'video'>) => {
      state.currentPage = action.payload;
    },
    toggleSidebar: (state) => {
      // Different toggle behavior based on current page
      if (state.currentPage === 'home') {
        // Home page: toggle between minimized and shown
        if (state.state === SidebarState.MINIMIZED) {
          state.state = SidebarState.SHOWN;
        } else {
          state.state = SidebarState.MINIMIZED;
        }
      } else if (state.currentPage === 'video') {
        // Video page: toggle between collapsed (hidden) and shown
        if (state.state === SidebarState.COLLAPSED) {
          state.state = SidebarState.SHOWN;
        } else {
          state.state = SidebarState.COLLAPSED;
        }
      }
    },
    setActiveItem: (state, action: PayloadAction<string>) => {
      state.activeItem = action.payload;
    },
  },
});

export const { setSidebarState, setCurrentPage, toggleSidebar, setActiveItem } = sidebarSlice.actions;
export default sidebarSlice.reducer;