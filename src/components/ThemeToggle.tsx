'use client';

import { Button } from '@/components/ui/Button';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ width: '40px', height: '40px' }} />;
  }

  const isDark = theme === 'dark';

  return (
    <Button
      variant="ghost"
      size="sm"
      className="!transform-none !bg-transparent hover:bg-[rgb(var(--muted))]/50 transition-colors"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      <FontAwesomeIcon 
        icon={isDark ? faSun : faMoon} 
        className="h-5 w-5 text-[rgb(var(--text-primary))]" 
      />
    </Button>
  );
}
