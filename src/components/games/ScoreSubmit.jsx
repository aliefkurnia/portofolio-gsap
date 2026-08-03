import React, { useState } from "react";
import { getPlayerName, setPlayerName, submitScore } from "./scores";
import "./ScoreSubmit.css";

// Name entry + save-to-leaderboard, shown on a game's end screen.
const ScoreSubmit = ({ gameId, score }) => {
  const [name, setName] = useState(() => getPlayerName());
  const [state, setState] = useState("idle"); // idle | saving | done | error

  const save = async () => {
    const clean = name.trim();
    if (!clean) return;
    setPlayerName(clean);
    setState("saving");
    const ok = await submitScore(gameId, score);
    setState(ok ? "done" : "error");
  };

  if (state === "done") {
    return <p className="ss__done">Saved to leaderboard ✓</p>;
  }

  return (
    <div className="ss">
      <p className="ss__prompt">Enter your name for the leaderboard</p>
      <div className="ss__row">
        <input
          className="ss__input"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 24))}
          onKeyDown={(e) => e.key === "Enter" && save()}
          placeholder="Your name"
          maxLength={24}
          spellCheck="false"
          autoFocus
        />
        <button
          className="game-btn game-btn--solid ss__save"
          onClick={save}
          disabled={!name.trim() || state === "saving"}
        >
          {state === "saving" ? "Saving…" : "Save"}
        </button>
      </div>
      {state === "error" && (
        <p className="ss__err">Couldn't save — leaderboard offline.</p>
      )}
    </div>
  );
};

export default ScoreSubmit;
