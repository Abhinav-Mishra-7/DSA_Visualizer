import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function ThemeManager() {
  const theme = useSelector((state) => state.ui.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'neon');
    root.classList.add(theme);

    try {
      window.localStorage.setItem('app-theme', theme);
    } catch (error) {
      console.error("Failed to save theme to localStorage", error);
    }
  }, [theme]);

  return null;
}