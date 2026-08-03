import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MemoryMatch from "../components/games/MemoryMatch";
import BugHunt from "../components/games/BugHunt";
import TypingTest from "../components/games/TypingTest";
import "./Play.css";

const GAMES = [
  {
    id: "memory",
    title: "Tech Memory Match",
    desc: "Flip the glass cards and match every tech-stack pair. Fewer moves, faster time — higher score.",
    emoji: "🃏",
    tag: "Memory",
    Component: MemoryMatch,
  },
  {
    id: "bughunt",
    title: "Bug Hunt",
    desc: "Squash as many bugs as you can before the timer runs out. Chain hits to build a combo.",
    emoji: "🐛",
    tag: "Reaction",
    Component: BugHunt,
  },
  {
    id: "typing",
    title: "Code Typing Test",
    desc: "Type the C# snippet as fast and accurately as you can. Measures your WPM and accuracy.",
    emoji: "⌨️",
    tag: "Speed",
    Component: TypingTest,
  },
];

const Play = () => {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState(null);
  const active = GAMES.find((g) => g.id === activeId);

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
          <span className="play__brand">
            alief<span className="play__brand-dot">.</span>arcade
          </span>
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
              {GAMES.map((g) => (
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
                  <span className="play__card-cta">Play →</span>
                </button>
              ))}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Play;
