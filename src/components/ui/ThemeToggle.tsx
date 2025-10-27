'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with same dimensions to prevent layout shift
    return (
      <div className="glass-dark px-3 py-1.5 rounded-full flex items-center gap-1.5 opacity-0">
        <div className="w-4 h-4"></div>
        <span className="text-xs font-medium">Dark</span>
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="glass-dark px-3 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all flex items-center gap-1.5 group relative overflow-hidden"
      aria-label="Toggle theme"
    >
      <div className="relative w-4 h-4">
        <Sun 
          size={16} 
          className={`absolute inset-0 text-yellow-400 transition-all duration-300 ${
            theme === 'light' 
              ? 'rotate-0 scale-100 opacity-100' 
              : 'rotate-90 scale-0 opacity-0'
          }`}
        />
        <Moon 
          size={16} 
          className={`absolute inset-0 text-purple-400 transition-all duration-300 ${
            theme === 'dark' 
              ? 'rotate-0 scale-100 opacity-100' 
              : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>
      <span className="text-gray-900 dark:text-white/90 text-xs font-medium">
        {theme === 'dark' ? 'Dark' : 'Light'}
      </span>
    </button>
  );
}

