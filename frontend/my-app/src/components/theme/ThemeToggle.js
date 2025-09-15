// src/components/theme/ThemeToggle.js - FIXED VISIBILITY
import React from 'react';
import { useTheme } from './ThemeProvider';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-8 w-14 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 hover:bg-gray-300 dark:hover:bg-gray-600"
      aria-label="Toggle theme"
      type="button"
    >
      {/* Toggle Track */}
      <div className="absolute inset-1 rounded-full">
        {/* Toggle Thumb */}
        <div className={`absolute top-0 left-0 h-6 w-6 rounded-full bg-white dark:bg-gray-200 shadow-lg transform transition-transform duration-300 flex items-center justify-center ${
          theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
        }`}>
          {/* Icon */}
          {theme === 'light' ? (
            <Sun className="h-3 w-3 text-yellow-500 transition-all duration-300" />
          ) : (
            <Moon className="h-3 w-3 text-blue-500 transition-all duration-300" />
          )}
        </div>
      </div>

      {/* Background Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <Sun className="h-3 w-3 text-gray-500 dark:text-gray-400 opacity-50" />
        <Moon className="h-3 w-3 text-gray-500 dark:text-gray-400 opacity-50" />
      </div>
    </button>
  );
};

export default ThemeToggle;