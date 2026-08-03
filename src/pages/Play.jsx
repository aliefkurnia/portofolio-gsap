import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MemoryMatch from "../components/games/MemoryMatch";
import BugHunt from "../components/games/BugHunt";
import TypingTest from "../components/games/TypingTest";
import ReactionTime from "../components/games/ReactionTime";
import Simon from "../components/games/Simon";
import Snake from "../components/games/Snake";
import Leaderboard from "../components/games/Leaderboard";
import { getBest } from "../components/games/scores";
import { isMuted, setMuted } from "../components/games/sfx";
import "./Play.css";

const GAMES = [
  {
    id: "memory",
    title: "Tech Memory Match",
    desc: "Flip the glass cards and match every tech-stack pair. Fewer moves, faster time — higher score.",
    emoji: "🃏",
    tag: "Memory",
    Component: MemoryMatch,
    dir: "low",
    formatBest: (v) => `${v} moves`,
  },
  {
    id: "bughunt",
    title: "Bug Hunt",
    desc: "Squash as many bugs as you can before the timer runs out. Chain hits to build a combo.",
    emoji: "🐛",
    tag: "Reaction",
    Component: BugHunt,
    dir: "high",
    formatBest: (v) => `${v} pts`,
  },
  {
    id: "typing",
    title: "Code Typing Test",
    desc: "Type the C# snippet as fast and accurately as you can. Measures your WPM and accuracy.",
    emoji: "⌨️",
    tag: "Speed",
    Component: TypingTest,
    dir: "high",
    formatBest: (v) => `${v} WPM`,
  },
  {
    id: "reaction",
    title: "Reaction Time",
    desc: "Wait for green, then click as fast as you can. Your best reaction in milliseconds.",
    emoji: "⚡",
    tag: "Reflex",
    Component: ReactionTime,
    dir: "low",
    formatBest: (v) => `${v} ms`,
  },
  {
    id: "simon",
    title: "Sequence Memory",
    desc: "Watch the colours light up, then repeat the growing pattern. How far can you get?",
    emoji: "🎨",
    tag: "Memory",
    Component: Simon,
    dir: "high",
    formatBest: (v) => `round ${v}`,
  },
  {
    id: "snake",
    title: "Snake",
    desc: "The classic. Steer with arrow keys or WASD, eat the dots, and don't crash into yourself.",
    emoji: "🐍",
    tag: "Arcade",
    Component: Snake,
    dir: "high",
    formatBest: (v) => `${v} pts`,
  },
];

const Play = () => {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState(null);
  const [muted, setMutedState] = useState(() => isMuted());
  const active = GAMES.find((g) => g.id === activeId);

  const toggleMute = () => {
    const m = !muted;
    setMuted(m);
    setMutedState(m);
  };

  return (
    <div className="play">
      <div className="play__mesh" aria-hidden="true">
        <span className="play__blob play__blob--1" />
        <span className="play__blob play__blob--2" />
        <span className="play__blob play__blob--3" />
      </div>

      <div className="play__container">
        <header className="play__header">
          {active ? (
            <button className="play__back" onClick={() => setActiveId(null)}>
              ← Back to menu
            </button>
          ) : (
            <button className="play__back" onClick={() => navigate("/")}>
              ← Portfolio
            </button>
          )}
          <div className="play__header-right">
            <button
              className="play__mute"
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              title={muted ? "Unmute" : "Mute"}
            >
              {muted ? "🔇" : "🔊"}
            </button>
            <span className="play__brand">
              alief<span className="play__brand-dot">.</span>arcade
            </span>
          </div>
        </header>

        {!active ? (
          <>
            <div className="play__intro">
              <span className="eyebrow">Arcade</span>
              <h1 className="play__title">Take a break, play a round.</h1>
              <p className="play__subtitle">
                A few small games I built for fun. No installs, no ads — just
                click one and play.
              </p>
            </div>

            <div className="play__grid">
              {GAMES.map((g) => {
                const best = getBest(g.id);
                return (
                  <button
                    key={g.id}
                    className="play__card glass"
                    onClick={() => setActiveId(g.id)}
                  >
                    <div className="play__card-top">
                      <span className="play__card-emoji">{g.emoji}</span>
                      <span className="play__card-tag">{g.tag}</span>
                    </div>
                    <h3 className="play__card-title">{g.title}</h3>
                    <p className="play__card-desc">{g.desc}</p>
                    <div className="play__card-foot">
                      <span className="play__card-cta">Play →</span>
                      {best != null && (
                        <span className="play__card-best">
                          <span className="play__card-best-star">★</span>
                          {g.formatBest(best)}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="play__stage">
            <div className="play__stage-head">
              <h2 className="play__stage-title">
                <span className="play__stage-emoji">{active.emoji}</span>
                {active.title}
              </h2>
            </div>
            <active.Component />
            <Leaderboard
              gameId={active.id}
              dir={active.dir}
              formatBest={active.formatBest}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Play;
