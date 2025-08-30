import { createSlice } from '@reduxjs/toolkit';

const themes = ['light', 'dark'];

const getInitialTheme = () => {
  try {
    const storedTheme = window.localStorage.getItem('app-theme');
    return themes.includes(storedTheme) ? storedTheme : 'light';
  } catch {
    return 'light';
  }
};

const initialState = {
  theme: getInitialTheme(),
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const currentIndex = themes.indexOf(state.theme);
      const nextIndex = (currentIndex + 1) % themes.length;
      state.theme = themes[nextIndex];
    },
  },
});

export const { toggleTheme } = uiSlice.actions;

export default uiSlice.reducer;