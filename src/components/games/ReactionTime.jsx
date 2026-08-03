import React, { useState, useRef, useEffect } from "react";
import { getBest, submitBest } from "./scores";
import { go, fail, win as winSfx } from "./sfx";
import ScoreSubmit from "./ScoreSubmit";
import "./Games.css";
import "./ReactionTime.css";

// phase: idle | waiting | ready | result | early
const ReactionTime = () => {
  const [phase, setPhase] = useState("idle");
  const [ms, setMs] = useState(null);
  const [best, setBest] = useState(() => getBest("reaction"));
  const [isBest, setIsBest] = useState(false);
  const timerRef = useRef(null);
  const readyAtRef = useRef(0);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const arm = () => {
    setPhase("waiting");
    setMs(null);
    setIsBest(false);
    const delay = 1200 + Math.random() * 2800;
    timerRef.current = setTimeout(() => {
      readyAtRef.current = performance.now();
      setPhase("ready");
      go();
    }, delay);
  };

  const handleClick = () => {
    if (phase === "idle" || phase === "result" || phase === "early") {
      arm();
      return;
    }
    if (phase === "waiting") {
      // clicked too early
      clearTimeout(timerRef.current);
      setPhase("early");
      fail();
      return;
    }
    if (phase === "ready") {
      const t = Math.round(performance.now() - readyAtRef.current);
      setMs(t);
      setPhase("result");
      winSfx();
      if (submitBest("reaction", t, "low")) {
        setBest(t);
        setIsBest(true);
      }
    }
  };

  const content = {
    idle: { title: "Reaction Time", note: "Click to start, then click the moment it turns green.", cls: "" },
    waiting: { title: "Wait for green…", note: "Don't click yet.", cls: "is-waiting" },
    ready: { title: "CLICK!", note: "", cls: "is-ready" },
    result: {
      title: `${ms} ms`,
      note: isBest ? "New best! ⚡ Click to try again." : "Click to try again.",
      cls: "is-result",
    },
    early: { title: "Too soon! 😅", note: "You clicked before green. Click to retry.", cls: "is-early" },
  }[phase];

  return (
    <div className="game">
      <div className="game-hud">
        <div className="game-stat">
          <span className="game-stat__label">Last</span>
          <span className="game-stat__value">{ms != null ? `${ms}ms` : "—"}</span>
        </div>
        <div className="game-stat">
          <span className="game-stat__label">Best</span>
          <span className="game-stat__value game-stat__value--accent">
            {best != null ? `${best}ms` : "—"}
          </span>
        </div>
      </div>

      <button className={`reaction ${content.cls}`} onClick={handleClick}>
        <span className="reaction__title">{content.title}</span>
        {content.note && <span className="reaction__note">{content.note}</span>}
      </button>

      {phase === "result" && (
        <div className="reaction__submit">
          <ScoreSubmit gameId="reaction" score={ms} />
        </div>
      )}
    </div>
  );
};

export default ReactionTime;
