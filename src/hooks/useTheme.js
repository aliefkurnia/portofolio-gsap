import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'theme';

/* Mirrors --bg in src/styles/variables.css. The browser chrome colour has to
   be set by hand — a meta tag can't read a CSS custom property. */
const BG = { light: '#f5edd8', dark: '#17120f' };

const readStored = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

/**
 * Theme state, persisted to localStorage.
 *
 * The initial attribute is set by a blocking script in index.html so the
 * first paint already carries the right palette — this hook only keeps it
 * in sync afterwards. Default is light; we deliberately ignore
 * prefers-color-scheme because the reference design is light-first.
 */
export const useTheme = () => {
  const [theme, setTheme] = useState(readStored);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', BG[theme]);

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* private mode — the attribute still applies for this session */
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggle };
};

export default useTheme;
