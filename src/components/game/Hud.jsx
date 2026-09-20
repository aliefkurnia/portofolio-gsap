import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';
import PixelIcon from '../ui/PixelIcon';
import './Hud.css';

const RESUME_URL = '/PreviewCV';

/**
 * The persistent status bar — sits above every screen like a game HUD.
 * It reports where you are and carries the controls that are always
 * available: go home, flip the theme, open the CV.
 */
const Hud = ({ stage, index, total, onHome }) => {
  const inStage = Boolean(stage);

  return (
    <header className="hud">
      <div className="hud__bar">
        <button className="hud__logo" onClick={onHome} title="Title screen">
          alief<span className="hud__logo-dot">.</span>dev
        </button>

        {/* Only a stage has anything to report. On the title screen this is
            left empty rather than filled with a prompt — the screen below
            already says what to do, and a status bar announcing "select a
            stage" over a page whose only action is START is noise. */}
        <div className="hud__status">
          {inStage && (
            <span className="hud__status-text">
              <span className="hud__led" aria-hidden="true" />
              <span className="hud__status-dim">
                stage {String(index).padStart(2, '0')}/{String(total).padStart(2, '0')}
              </span>
              <span className="hud__status-sep" aria-hidden="true">
                ·
              </span>
              <span className="hud__status-name">{stage.label}</span>
            </span>
          )}
        </div>

        <div className="hud__actions">
          <ThemeToggle />
          <Link to={RESUME_URL} className="hud__resume">
            <PixelIcon name="code" size={14} />
            resume
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Hud;
