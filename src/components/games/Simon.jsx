import React, { useState, useRef, useEffect, useCallback } from "react";
import { getBest, submitBest } from "./scores";
import { pad as padTone, fail } from "./sfx";
import ScoreSubmit from "./ScoreSubmit";
import "./Games.css";
import "./Simon.css";

const PADS = [0, 1, 2, 3];
const rand = () => Math.floor(Math.random() * 4);

// phase: idle | showing | input | over
const Simon = () => {
  const [sequence, setSequence] = useState([]);
  const [phase, setPhase] = useState("idle");
  const [userIndex, setUserIndex] = useState(0);
  const [active, setActive] = useState(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => getBest("simon"));
  const [isBest, setIsBest] = useState(false);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => () => clearTimers(), []);

  const playSequence = useCallback((seq) => {
    setPhase("showing");
    setActive(null);
    let i = 0;
    const step = () => {
      if (i >= seq.length) {
        setPhase("input");
        setUserIndex(0);
        return;
      }
      setActive(seq[i]);
      padTone(seq[i]);
      timers.current.push(
        setTimeout(() => {
          setActive(null);
          i += 1;
          timers.current.push(setTimeout(step, 200));
        }, 440)
      );
    };
    timers.current.push(setTimeout(step, 500));
  }, []);

  const start = () => {
    clearTimers();
    setScore(0);
    setIsBest(false);
    const seq = [rand()];
    setSequence(seq);
    playSequence(seq);
  };

  const flash = (i) => {
    setActive(i);
    padTone(i);
    timers.current.push(setTimeout(() => setActive(null), 180));
  };

  const padClick = (i) => {
    if (phase !== "input") return;
    flash(i);

    if (i !== sequence[userIndex]) {
      fail();
      setPhase("over");
      if (submitBest("simon", score, "high")) {
        setBest(score);
        setIsBest(true);
      }
      return;
    }

    const nextUser = userIndex + 1;
    if (nextUser === sequence.length) {
      const completed = sequence.length;
      setScore(completed);
      const nextSeq = [...sequence, rand()];
      setSequence(nextSeq);
      timers.current.push(setTimeout(() => playSequence(nextSeq), 700));
    } else {
      setUserIndex(nextUser);
    }
  };

  const idle = phase === "idle";
  const over = phase === "over";

  return (
    <div className="game">
      <div className="game-hud">
        <div className="game-stat">
          <span className="game-stat__label">Round</span>
          <span className="game-stat__value">{score}</span>
        </div>
        <div className="game-stat">
          <span className="game-stat__label">Best</span>
          <span className="game-stat__value game-stat__value--accent">
            {best != null ? best : "—"}
          </span>
        </div>
        <div className="game-spacer" />
        <span className="simon__status">
          {phase === "showing" ? "Watch…" : phase === "input" ? "Your turn" : ""}
        </span>
      </div>

      <div className="game-panel px-panel simon__panel">
        <div className="simon__pads" data-locked={phase !== "input"}>
          {PADS.map((i) => (
            <button
              key={i}
              className={`simon__pad simon__pad--${i}${active === i ? " is-active" : ""}`}
              onClick={() => padClick(i)}
              aria-label={`Pad ${i + 1}`}
            />
          ))}
        </div>

        {(idle || over) && (
          <div className="game-overlay">
            <span className="game-overlay__emoji">{over ? "🧠" : "🎨"}</span>
            <span className="game-overlay__title">
              {over ? `Round ${score}` : "Sequence Memory"}
            </span>
            <span className="game-overlay__note">
              {over
                ? isBest && score > 0
                  ? "New best! Watch the pattern and repeat it."
                  : "Watch the pattern, then repeat it. One slip ends the run."
                : "Watch the pattern light up, then repeat it. It grows each round."}
            </span>
            {over && score > 0 && <ScoreSubmit gameId="simon" score={score} />}
            <button className="game-btn game-btn--solid" onClick={start}>
              {over ? "Play again" : "Start"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Simon;
