import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./GameNudge.css";

const GameNudge = () => {
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Appears a little after load. On wider screens it opens the full card;
  // on mobile it stays as just the robot head until tapped (less intrusive).
  useEffect(() => {
    const t = setTimeout(() => {
      setShow(true);
      if (window.matchMedia("(min-width: 621px)").matches) setExpanded(true);
    }, 4500);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div className="nudge">
      {expanded ? (
        <div className="nudge__card glass">
          <button
            className="nudge__close"
            onClick={() => setExpanded(false)}
            aria-label="Close"
          >
            ×
          </button>
          <span className="nudge__bot" aria-hidden="true">
            🤖
          </span>
          <div className="nudge__text">
            <strong className="nudge__title">Bored scrolling?</strong>
            <p className="nudge__msg">I built a tiny arcade. Fancy a quick game?</p>
            <Link
              to="/play"
              className="nudge__cta"
              onClick={() => setExpanded(false)}
            >
              Play now →
            </Link>
          </div>
        </div>
      ) : (
        <button
          className="nudge__launcher glass"
          onClick={() => setExpanded(true)}
          aria-label="Are you bored? Open the arcade nudge"
        >
          <span className="nudge__bot nudge__bot--sm" aria-hidden="true">
            🤖
          </span>
          <span className="nudge__launcher-text">Are you bored?</span>
        </button>
      )}
    </div>
  );
};

export default GameNudge;
