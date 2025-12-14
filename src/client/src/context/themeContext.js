import React, { createContext, useState, useContext, useEffect } from 'react';
import { storageService } from '../../../server/api';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(storageService.getTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    storageService.saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);