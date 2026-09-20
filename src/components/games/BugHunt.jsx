import React, { useState, useEffect, useRef, useCallback } from "react";
import { getBest, submitBest } from "./scores";
import ScoreSubmit from "./ScoreSubmit";
import { hit, comboUp } from "./sfx";
import "./Games.css";
import "./BugHunt.css";

const GAME_TIME = 30;
const BUG_LIFESPAN = 1100;
const SPAWN_EVERY = 680;

const BugHunt = () => {
  const [playing, setPlaying] = useState(false);
  const [over, setOver] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [bugs, setBugs] = useState([]);
  const [best, setBest] = useState(() => getBest("bughunt") || 0);
  const [popups, setPopups] = useState([]);

  const idRef = useRef(0);
  const timeoutsRef = useRef({});
  const playingRef = useRef(false);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const popupIdRef = useRef(0);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);
  useEffect(() => {
    comboRef.current = combo;
  }, [combo]);

  const clearAllTimeouts = () => {
    Object.values(timeoutsRef.current).forEach(clearTimeout);
    timeoutsRef.current = {};
  };

  const endGame = useCallback(() => {
    if (!playingRef.current) return;
    playingRef.current = false;
    setPlaying(false);
    setOver(true);
    setBugs([]);
    clearAllTimeouts();
    const final = scoreRef.current;
    if (submitBest("bughunt", final, "high")) setBest(final);
  }, []);

  // Countdown
  useEffect(() => {
    if (!playing) return;
    if (timeLeft <= 0) {
      endGame();
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [playing, timeLeft, endGame]);

  // Spawner
  useEffect(() => {
    if (!playing) return;
    const spawn = setInterval(() => {
      const id = ++idRef.current;
      const bug = {
        id,
        x: 6 + Math.random() * 88,
        y: 10 + Math.random() * 78,
        size: 32 + Math.random() * 14,
      };
      setBugs((b) => [...b, bug]);
      // auto-expire (missed) → combo resets
      timeoutsRef.current[id] = setTimeout(() => {
        setBugs((b) => {
          if (b.some((x) => x.id === id)) setCombo(0);
          return b.filter((x) => x.id !== id);
        });
        delete timeoutsRef.current[id];
      }, BUG_LIFESPAN);
    }, SPAWN_EVERY);
    return () => clearInterval(spawn);
  }, [playing]);

  const start = () => {
    clearAllTimeouts();
    idRef.current = 0;
    comboRef.current = 0;
    setScore(0);
    setCombo(0);
    setTimeLeft(GAME_TIME);
    setBugs([]);
    setPopups([]);
    setOver(false);
    playingRef.current = true;
    setPlaying(true);
  };

  const squash = (id, e) => {
    e.stopPropagation();
    // A bug button only exists while its bug is on the field, so a click is
    // always a valid hit. Clear its expiry timer so it can't reset the combo.
    const bug = bugs.find((x) => x.id === id);
    if (timeoutsRef.current[id]) {
      clearTimeout(timeoutsRef.current[id]);
      delete timeoutsRef.current[id];
    }
    setBugs((b) => b.filter((x) => x.id !== id));

    const nc = comboRef.current + 1;
    comboRef.current = nc;
    const pts = 10 + (nc - 1) * 2;
    setCombo(nc);
    setScore((s) => s + pts);

    // sound — a flourish every 5th hit, a rising blip otherwise
    if (nc % 5 === 0) comboUp(nc);
    else hit(nc);

    // floating score popup at the bug's spot
    if (bug) {
      const pid = ++popupIdRef.current;
      setPopups((p) => [...p, { id: pid, x: bug.x, y: bug.y, pts, combo: nc }]);
      setTimeout(() => {
        setPopups((p) => p.filter((x) => x.id !== pid));
      }, 750);
    }
  };

  useEffect(() => () => clearAllTimeouts(), []);

  return (
    <div className="game">
      <div className="game-hud">
        <div className="game-stat">
          <span className="game-stat__label">Score</span>
          <span className="game-stat__value">{score}</span>
        </div>
        <div className="game-stat">
          <span className="game-stat__label">Combo</span>
          <span
            key={combo}
            className="game-stat__value game-stat__value--accent bughunt__combo"
            data-hot={combo >= 5 ? "true" : "false"}
          >
            ×{combo}
          </span>
        </div>
        <div className="game-stat">
          <span className="game-stat__label">Time</span>
          <span className="game-stat__value">{timeLeft}s</span>
        </div>
        <div className="game-stat">
          <span className="game-stat__label">Best</span>
          <span className="game-stat__value">{best}</span>
        </div>
      </div>

      <div className="game-panel px-panel bughunt__field">
        {bugs.map((bug) => (
          <button
            key={bug.id}
            className="bughunt__bug"
            style={{
              left: `${bug.x}%`,
              top: `${bug.y}%`,
              fontSize: `${bug.size}px`,
            }}
            onClick={(e) => squash(bug.id, e)}
            aria-label="Squash bug"
          >
            🐛
          </button>
        ))}

        {popups.map((p) => (
          <span
            key={p.id}
            className={`bughunt__popup${p.combo >= 5 ? " is-hot" : ""}`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            +{p.pts}
            {p.combo >= 3 ? <b> ×{p.combo}</b> : ""}
          </span>
        ))}

        {!playing && (
          <div className="game-overlay">
            {over ? (
              <>
                <span className="game-overlay__emoji">🏁</span>
                <span className="game-overlay__title">Time!</span>
                <span className="game-overlay__note">
                  You squashed {score} points{score >= best && score > 0 ? " · new best!" : ""}
                </span>
                <ScoreSubmit gameId="bughunt" score={score} />
                <button className="game-btn game-btn--solid" onClick={start}>
                  Play again
                </button>
              </>
            ) : (
              <>
                <span className="game-overlay__emoji">🐛</span>
                <span className="game-overlay__title">Bug Hunt</span>
                <span className="game-overlay__note">
                  Squash bugs before they escape. 30 seconds on the clock.
                </span>
                <button className="game-btn game-btn--solid" onClick={start}>
                  Start
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BugHunt;
