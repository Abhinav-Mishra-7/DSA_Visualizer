import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function ThemeManager() {
  const theme = useSelector((state) => state.ui.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return null; 
}