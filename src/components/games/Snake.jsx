import React, { useState, useRef, useEffect, useCallback } from "react";
import { getBest, submitBest } from "./scores";
import { eat as eatSfx, fail as failSfx } from "./sfx";
import ScoreSubmit from "./ScoreSubmit";
import "./Games.css";
import "./Snake.css";

const GRID = 15;
const TICK = 130;
const DIRS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
const OPPOSITE = { up: "down", down: "up", left: "right", right: "left" };

const cellKey = (x, y) => `${x},${y}`;

function randomFood(snake) {
  const taken = new Set(snake.map((s) => cellKey(s.x, s.y)));
  const free = [];
  for (let y = 0; y < GRID; y++)
    for (let x = 0; x < GRID; x++)
      if (!taken.has(cellKey(x, y))) free.push({ x, y });
  return free[Math.floor(Math.random() * free.length)] || { x: 0, y: 0 };
}

const START = () => [
  { x: 7, y: 7 },
  { x: 6, y: 7 },
  { x: 5, y: 7 },
];

const Snake = () => {
  const [, setTick] = useState(0);
  const [phase, setPhase] = useState("idle"); // idle | playing | over
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => getBest("snake") || 0);

  const snakeRef = useRef(START());
  const dirRef = useRef("right");
  const nextDirRef = useRef("right");
  const foodRef = useRef({ x: 11, y: 7 });
  const scoreRef = useRef(0);
  const loopRef = useRef(null);
  const phaseRef = useRef("idle");

  const stop = () => {
    if (loopRef.current) clearInterval(loopRef.current);
    loopRef.current = null;
  };

  const endGame = useCallback(() => {
    stop();
    phaseRef.current = "over";
    setPhase("over");
    failSfx();
    if (submitBest("snake", scoreRef.current, "high")) setBest(scoreRef.current);
  }, []);

  const step = useCallback(() => {
    const dir = DIRS[nextDirRef.current];
    dirRef.current = nextDirRef.current;
    const head = snakeRef.current[0];
    const nh = { x: head.x + dir.x, y: head.y + dir.y };

    const hitWall = nh.x < 0 || nh.x >= GRID || nh.y < 0 || nh.y >= GRID;
    const hitSelf = snakeRef.current.some((s) => s.x === nh.x && s.y === nh.y);
    if (hitWall || hitSelf) {
      endGame();
      return;
    }

    const grew = nh.x === foodRef.current.x && nh.y === foodRef.current.y;
    const newSnake = [nh, ...snakeRef.current];
    if (grew) {
      foodRef.current = randomFood(newSnake);
      scoreRef.current += 1;
      setScore(scoreRef.current);
      eatSfx();
    } else {
      newSnake.pop();
    }
    snakeRef.current = newSnake;
    setTick((t) => t + 1);
  }, [endGame]);

  const start = () => {
    stop();
    snakeRef.current = START();
    dirRef.current = "right";
    nextDirRef.current = "right";
    foodRef.current = randomFood(snakeRef.current);
    scoreRef.current = 0;
    setScore(0);
    phaseRef.current = "playing";
    setPhase("playing");
    loopRef.current = setInterval(step, TICK);
  };

  const turn = useCallback((d) => {
    if (phaseRef.current !== "playing") return;
    if (d === OPPOSITE[dirRef.current]) return; // no 180° flips
    nextDirRef.current = d;
  }, []);

  // Keyboard controls
  useEffect(() => {
    const onKey = (e) => {
      const map = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        w: "up",
        s: "down",
        a: "left",
        d: "right",
      };
      const d = map[e.key];
      if (d) {
        e.preventDefault();
        turn(d);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [turn]);

  useEffect(() => () => stop(), []);

  const snakeSet = new Set(snakeRef.current.map((s) => cellKey(s.x, s.y)));
  const headKey = cellKey(snakeRef.current[0].x, snakeRef.current[0].y);
  const foodKey = cellKey(foodRef.current.x, foodRef.current.y);

  return (
    <div className="game">
      <div className="game-hud">
        <div className="game-stat">
          <span className="game-stat__label">Score</span>
          <span className="game-stat__value">{score}</span>
        </div>
        <div className="game-stat">
          <span className="game-stat__label">Best</span>
          <span className="game-stat__value game-stat__value--accent">{best}</span>
        </div>
        <div className="game-spacer" />
        <span className="snake__hint">Arrow keys / WASD</span>
      </div>

      <div className="game-panel glass snake__panel">
        <div className="snake__board">
          {Array.from({ length: GRID * GRID }, (_, i) => {
            const x = i % GRID;
            const y = Math.floor(i / GRID);
            const k = cellKey(x, y);
            let cls = "snake__cell";
            if (k === foodKey) cls += " is-food";
            else if (k === headKey) cls += " is-head";
            else if (snakeSet.has(k)) cls += " is-body";
            return <div key={i} className={cls} />;
          })}
        </div>

        {phase !== "playing" && (
          <div className="game-overlay">
            <span className="game-overlay__emoji">🐍</span>
            <span className="game-overlay__title">
              {phase === "over" ? `Score ${score}` : "Snake"}
            </span>
            <span className="game-overlay__note">
              {phase === "over"
                ? "Eat the dots, don't hit the walls or yourself."
                : "Steer with arrow keys or WASD. Grab the dots to grow."}
            </span>
            {phase === "over" && score > 0 && (
              <ScoreSubmit gameId="snake" score={score} />
            )}
            <button className="game-btn game-btn--solid" onClick={start}>
              {phase === "over" ? "Play again" : "Start"}
            </button>
          </div>
        )}
      </div>

      {/* On-screen controls (mobile) */}
      <div className="snake__dpad">
        <button className="snake__dbtn snake__dbtn--up" onClick={() => turn("up")} aria-label="Up">▲</button>
        <button className="snake__dbtn snake__dbtn--left" onClick={() => turn("left")} aria-label="Left">◀</button>
        <button className="snake__dbtn snake__dbtn--right" onClick={() => turn("right")} aria-label="Right">▶</button>
        <button className="snake__dbtn snake__dbtn--down" onClick={() => turn("down")} aria-label="Down">▼</button>
      </div>
    </div>
  );
};

export default Snake;
