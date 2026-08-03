import React, { useState, useEffect, useCallback, useRef } from "react";
import csharp from "../Assets/tech/csharp.png";
import dotnet from "../Assets/tech/dotnet.png";
import blazor from "../Assets/tech/blazor.png";
import docker from "../Assets/tech/docker.png";
import kubernetes from "../Assets/tech/kubernetes.png";
import postgres from "../Assets/tech/postgres.png";
import redis from "../Assets/tech/redis.png";
import git from "../Assets/tech/git.png";
import "./Games.css";
import "./MemoryMatch.css";

const ICONS = [
  { src: csharp, name: "C#" },
  { src: dotnet, name: ".NET" },
  { src: blazor, name: "Blazor" },
  { src: docker, name: "Docker" },
  { src: kubernetes, name: "Kubernetes" },
  { src: postgres, name: "PostgreSQL" },
  { src: redis, name: "Redis" },
  { src: git, name: "Git" },
];

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildDeck = () =>
  shuffle(
    ICONS.flatMap((icon, i) => [
      { key: `${i}-a`, icon: i },
      { key: `${i}-b`, icon: i },
    ])
  ).map((c) => ({ ...c, flipped: false, matched: false }));

const MemoryMatch = () => {
  const [cards, setCards] = useState(buildDeck);
  const [picks, setPicks] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const lockRef = useRef(false);

  const won = matched === ICONS.length;

  // Timer
  useEffect(() => {
    if (!running || won) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running, won]);

  const handlePick = useCallback(
    (index) => {
      if (lockRef.current) return;
      const card = cards[index];
      if (card.flipped || card.matched) return;
      if (!running) setRunning(true);

      const nextCards = cards.map((c, i) => (i === index ? { ...c, flipped: true } : c));
      const nextPicks = [...picks, index];
      setCards(nextCards);
      setPicks(nextPicks);

      if (nextPicks.length === 2) {
        setMoves((m) => m + 1);
        const [a, b] = nextPicks;
        if (nextCards[a].icon === nextCards[b].icon) {
          // match
          setCards((cs) =>
            cs.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c))
          );
          setMatched((m) => m + 1);
          setPicks([]);
        } else {
          // no match — flip back after a beat
          lockRef.current = true;
          setTimeout(() => {
            setCards((cs) =>
              cs.map((c, i) => (i === a || i === b ? { ...c, flipped: false } : c))
            );
            setPicks([]);
            lockRef.current = false;
          }, 750);
        }
      }
    },
    [cards, picks, running]
  );

  const restart = () => {
    lockRef.current = false;
    setCards(buildDeck());
    setPicks([]);
    setMoves(0);
    setMatched(0);
    setSeconds(0);
    setRunning(false);
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="game">
      <div className="game-hud">
        <div className="game-stat">
          <span className="game-stat__label">Moves</span>
          <span className="game-stat__value">{moves}</span>
        </div>
        <div className="game-stat">
          <span className="game-stat__label">Pairs</span>
          <span className="game-stat__value">
            {matched}/{ICONS.length}
          </span>
        </div>
        <div className="game-stat">
          <span className="game-stat__label">Time</span>
          <span className="game-stat__value">
            {mm}:{ss}
          </span>
        </div>
        <div className="game-spacer" />
        <button className="game-btn game-btn--ghost" onClick={restart}>
          Restart
        </button>
      </div>

      <div className="game-panel glass">
        <div className="mm-grid">
          {cards.map((card, i) => {
            const show = card.flipped || card.matched;
            return (
              <button
                key={card.key}
                className={`mm-card${show ? " is-flipped" : ""}${
                  card.matched ? " is-matched" : ""
                }`}
                onClick={() => handlePick(i)}
                aria-label={show ? ICONS[card.icon].name : "Hidden card"}
              >
                <span className="mm-card__inner">
                  <span className="mm-card__face mm-card__face--back">
                    <span className="mm-card__logo">&lt;/&gt;</span>
                  </span>
                  <span className="mm-card__face mm-card__face--front">
                    <img
                      src={ICONS[card.icon].src}
                      alt={ICONS[card.icon].name}
                      className="mm-card__icon"
                    />
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {won && (
          <div className="game-overlay">
            <span className="game-overlay__emoji">🎉</span>
            <span className="game-overlay__title">Cleared!</span>
            <span className="game-overlay__note">
              {moves} moves · {mm}:{ss}
            </span>
            <button className="game-btn game-btn--solid" onClick={restart}>
              Play again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryMatch;
