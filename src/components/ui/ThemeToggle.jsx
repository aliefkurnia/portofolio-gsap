import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import PixelIcon from './PixelIcon';
import './ThemeToggle.css';

/**
 * Light/dark switch, drawn as a two-position rocker rather than one icon
 * button.
 *
 * The old version showed only the icon of the mode you would switch *to*,
 * which is a coin-flip to read — and its pixel moon happened to render as a
 * `‹` chevron at 18px, so the whole control read as a back button. Both
 * positions are now visible at once with the active one lit, which needs no
 * interpretation; the labels drop below 640px and the paired icons carry it.
 */
const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  // The hook exposes a toggle rather than a setter, and with exactly two
  // positions that is the same thing — as long as we don't re-fire on the
  // position that is already active.
  const select = (next) => {
    if (next !== theme) toggle();
  };

  return (
    <div className="theme-switch" role="group" aria-label="Colour theme">
      <button
        type="button"
        className="theme-switch__opt"
        aria-pressed={!isDark}
        onClick={() => select('light')}
        title="Light mode"
      >
        <PixelIcon name="sun" size={16} />
        <span className="theme-switch__label">light</span>
      </button>

      <button
        type="button"
        className="theme-switch__opt"
        aria-pressed={isDark}
        onClick={() => select('dark')}
        title="Dark mode"
      >
        <PixelIcon name="moon" size={16} />
        <span className="theme-switch__label">dark</span>
      </button>
    </div>
  );
};

export default ThemeToggle;
