import React, { useState, useEffect, useRef } from "react";
import { getBest, submitBest } from "./scores";
import { typeKey, win as winSfx } from "./sfx";
import ScoreSubmit from "./ScoreSubmit";
import "./Games.css";
import "./TypingTest.css";

const SNIPPETS = [
  "public async Task<User> GetUserAsync(int id) => await _db.Users.FindAsync(id);",
  "var active = items.Where(x => x.IsActive).OrderBy(x => x.Name).ToList();",
  "services.AddScoped<IUserRepository, UserRepository>();",
  "if (!ModelState.IsValid) return BadRequest(ModelState);",
];

const TypingTest = () => {
  const [snippetIdx, setSnippetIdx] = useState(() =>
    Math.floor(Math.random() * SNIPPETS.length)
  );
  const snippet = SNIPPETS[snippetIdx];

  const [typed, setTyped] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [strokes, setStrokes] = useState(0);
  const [errors, setErrors] = useState(0);
  const [best, setBest] = useState(() => getBest("typing") || 0);
  const inputRef = useRef(null);

  // live timer
  useEffect(() => {
    if (!startTime || finished) return;
    const id = setInterval(() => setElapsed((Date.now() - startTime) / 1000), 100);
    return () => clearInterval(id);
  }, [startTime, finished]);

  const minutes = elapsed / 60;
  const wpm = minutes > 0 ? Math.round(snippet.length / 5 / minutes) : 0;
  const accuracy = strokes > 0 ? Math.round(((strokes - errors) / strokes) * 100) : 100;

  const handleChange = (e) => {
    if (finished) return;
    const val = e.target.value;

    // Deletion (backspace) is always allowed.
    if (val.length <= typed.length) {
      setTyped(val);
      return;
    }

    // A new character was attempted at the current position.
    const idx = typed.length;
    const attempted = val[idx];
    if (!startTime) setStartTime(Date.now());
    setStrokes((s) => s + 1);

    if (attempted !== snippet[idx]) {
      // Wrong key — reject it. Cursor stays put; you must type the right key.
      setErrors((x) => x + 1);
      typeKey(false);
      e.target.value = typed;
      return;
    }

    // Correct — advance exactly one character (also blocks paste-ahead).
    const next = snippet.slice(0, idx + 1);
    setTyped(next);
    typeKey(true);

    if (next.length === snippet.length) {
      const finalElapsed = (Date.now() - (startTime || Date.now())) / 1000;
      setElapsed(finalElapsed);
      setFinished(true);
      const finalWpm =
        finalElapsed > 0 ? Math.round(snippet.length / 5 / (finalElapsed / 60)) : 0;
      if (submitBest("typing", finalWpm, "high")) setBest(finalWpm);
      winSfx();
    }
  };

  const reset = (newSnippet) => {
    if (newSnippet) {
      setSnippetIdx((i) => (i + 1) % SNIPPETS.length);
    }
    setTyped("");
    setStartTime(null);
    setElapsed(0);
    setFinished(false);
    setStrokes(0);
    setErrors(0);
    requestAnimationFrame(() => inputRef.current && inputRef.current.focus());
  };

  return (
    <div className="game">
      <div className="game-hud">
        <div className="game-stat">
          <span className="game-stat__label">WPM</span>
          <span className="game-stat__value game-stat__value--accent">{wpm}</span>
        </div>
        <div className="game-stat">
          <span className="game-stat__label">Accuracy</span>
          <span className="game-stat__value">{accuracy}%</span>
        </div>
        <div className="game-stat">
          <span className="game-stat__label">Time</span>
          <span className="game-stat__value">{elapsed.toFixed(1)}s</span>
        </div>
        <div className="game-stat">
          <span className="game-stat__label">Best WPM</span>
          <span className="game-stat__value">{best}</span>
        </div>
      </div>

      <div
        className="game-panel glass typing__panel"
        onClick={() => inputRef.current && inputRef.current.focus()}
      >
        <pre className="typing__snippet">
          {snippet.split("").map((ch, i) => {
            let cls = "typing__ch";
            if (i < typed.length) {
              cls += typed[i] === ch ? " is-correct" : " is-wrong";
            } else if (i === typed.length) {
              cls += " is-current";
            }
            return (
              <span key={i} className={cls}>
                {ch}
              </span>
            );
          })}
        </pre>

        <input
          ref={inputRef}
          className="typing__input"
          value={typed}
          onChange={handleChange}
          disabled={finished}
          autoFocus
          spellCheck="false"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          aria-label="Type the code snippet"
        />

        <p className="typing__hint">
          {finished
            ? "Nice! Hit New snippet to go again."
            : startTime
            ? "Keep going…"
            : "Click here and start typing the snippet above."}
        </p>

        {finished && (
          <div className="game-overlay">
            <span className="game-overlay__emoji">⌨️</span>
            <span className="game-overlay__title">{wpm} WPM</span>
            <span className="game-overlay__note">
              {accuracy}% accuracy · {elapsed.toFixed(1)}s
              {wpm >= best && wpm > 0 ? " · new best!" : ""}
            </span>
            <ScoreSubmit gameId="typing" score={wpm} />
            <div className="typing__actions">
              <button className="game-btn game-btn--ghost" onClick={() => reset(false)}>
                Retry
              </button>
              <button className="game-btn game-btn--solid" onClick={() => reset(true)}>
                New snippet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingTest;
