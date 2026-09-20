import React, { useEffect, useRef, useMemo, useCallback } from "react";
import { gsap } from "gsap";
import { usePortfolioData } from "../../hooks/usePortfolioData";
import "./Loader.css";

const allGreetings = [
  "Halo", "こんにちは", "Bonjour", "你好", "Hola",
  "안녕하세요", "Ciao", "Olá", "Привет", "Merhaba",
  "Sawubona", "Namaste", "Hej", "Aloha", "Salaam",
  "Kamusta", "Sawasdee", "Habari", "Hallo", "Xin chào",
  "Szia", "Ahoj", "Γεια σου", "Bok", "Buna",
  "Tere", "Sveiki", "Halló", "Witaj", "Salut",
  "Selamat", "Jambo", "Hei", "Kumusta", "Shalom",
  "Selam", "Salam", "Hodi", "Sannu", "Nǐ hǎo",
  "Yā", "Oi",
];

/** How long the splash holds before it advances on its own. */
const HOLD_MS = 2600;
/** Shorter under reduced motion — there is no animation to sit through. */
const HOLD_MS_REDUCED = 1200;

/**
 * Lays the greetings out as a ring around the television.
 *
 * Positions are percentages of the *scene*, not of each word, because the
 * words used to be placed by `translate` percentages of themselves — which
 * held the whole set inside a ~200px halo at the centre. That halo was the
 * point when a wordmark sat there, but the TV now occupies exactly that spot,
 * so every greeting ended up behind it. A grid with the centre cells removed
 * puts them in the margins instead.
 */
const KEEPOUT = { min: 21, max: 79 };
const COLS = 12;
const ROWS = 7;
const INSET = 6; // keep words off the very edges of the window

function generatePositions(count) {
  const cells = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = INSET + ((c + 0.5) / COLS) * (100 - INSET * 2);
      const y = ((r + 0.5) / ROWS) * 100;
      const inX = x > KEEPOUT.min && x < KEEPOUT.max;
      const inY = y > KEEPOUT.min && y < KEEPOUT.max;
      if (inX && inY) continue; // the television lives here
      cells.push({ x, y });
    }
  }

  // Shuffle so words are not handed out in reading order
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  const stepX = (100 - INSET * 2) / COLS;
  const stepY = 100 / ROWS;

  return Array.from({ length: count }, (_, i) => {
    const cell = cells[i % cells.length];
    let x = cell.x + (Math.random() - 0.5) * stepX * 0.7;
    let y = cell.y + (Math.random() - 0.5) * stepY * 0.7;

    // Jitter can nudge a word back over the set; push it clear on whichever
    // side it is nearer to.
    if (x > KEEPOUT.min && x < KEEPOUT.max && y > KEEPOUT.min && y < KEEPOUT.max) {
      x = x < 50 ? KEEPOUT.min - 2 : KEEPOUT.max + 2;
    }

    return {
      x: `${Math.max(2, Math.min(98, x)).toFixed(1)}%`,
      y: `${Math.max(3, Math.min(97, y)).toFixed(1)}%`,
      size: (0.8 + Math.random() * 0.35).toFixed(2),
    };
  });
}

const prefersReduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The boot splash — a CRT television switching on.
 *
 * It advances **on its own**, on the timer below. A key or a click only cuts
 * the wait short. That distinction is the whole of the copy on screen: it used
 * to read "press any key to continue", which told the visitor that nothing
 * would happen until they acted — and they duly sat and waited to be asked.
 * The line now offers a skip, and the bar underneath shows the splash making
 * its own way there.
 *
 * It also reads the portfolio payload, which warms `usePortfolioData`'s
 * module cache during the seconds the splash is on screen.
 */
const Loader = ({ onComplete }) => {
  const { settings } = usePortfolioData();

  const loaderRef = useRef(null);
  const tvRef = useRef(null);
  const wordsRef = useRef([]);
  const tlRef = useRef(null);
  const doneRef = useRef(false);

  // Held in a ref so `finish` can stay stable. It used to close over
  // `onComplete` directly, which meant a parent re-render gave it a new
  // identity, which re-ran the effect and *restarted the auto-advance timer* —
  // a splash that never advances if the parent happens to re-render on a
  // shorter cycle than the hold.
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const reduced = prefersReduced();
  const hold = reduced ? HOLD_MS_REDUCED : HOLD_MS;

  const role = settings.job_title || ".NET Software Developer";
  const year = new Date().getFullYear();

  const greetings = useMemo(() => {
    const shuffled = [...allGreetings].sort(() => Math.random() - 0.5);
    const positions = generatePositions(shuffled.length);
    return shuffled.map((text, i) => ({ text, ...positions[i] }));
  }, []);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;

    tlRef.current?.kill();

    gsap.to(loaderRef.current, {
      opacity: 0,
      duration: prefersReduced() ? 0 : 0.4,
      ease: "power2.inOut",
      onComplete: () => onCompleteRef.current(),
    });
  }, []);

  useEffect(() => {
    let tl = null;

    if (!reduced) {
      tl = gsap.timeline({ onComplete: finish });
      tlRef.current = tl;

      tl.fromTo(
        tvRef.current,
        { opacity: 0, scale: 0.9, y: 18 },
        { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: "power3.out" },
      );

      tl.fromTo(
        wordsRef.current,
        { opacity: 0, scale: 0.6 },
        {
          opacity: 0.5,
          scale: 1,
          duration: 0.4,
          stagger: 0.04,
          ease: "back.out(1.5)",
        },
        "-=0.35",
      );
    }

    // A key or a click skips the rest of the wait. The timer is what actually
    // drives the splash — this only shortens it.
    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);

    const timer = setTimeout(finish, hold);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      tl?.kill();
    };
  }, [finish, hold, reduced]);

  return (
    <div className="loader" ref={loaderRef}>
      <div className="loader__scene">
        {greetings.map((g, i) => (
          <span
            key={i}
            className="loader__word"
            // Block body — a ref callback must not return a value.
            ref={(el) => {
              wordsRef.current[i] = el;
            }}
            style={{
              "--x": g.x,
              "--y": g.y,
              "--size": g.size,
            }}
          >
            {g.text}
          </span>
        ))}

        <div className="loader__tv" ref={tvRef}>
          <span className="loader__antenna loader__antenna--l" aria-hidden="true" />
          <span className="loader__antenna loader__antenna--r" aria-hidden="true" />

          <div className="loader__screen">
            <div className="loader__screen-body">
              <span className="loader__year">{year}</span>
              <span className="loader__title px-title">Portfolio</span>
              <span className="loader__role">{role}</span>
              <span className="loader__press">press any key to skip</span>
            </div>
            {/* Fills over the hold, so the splash visibly makes its own way to
                the map instead of looking like it is waiting to be told. */}
            <span
              className="loader__progress"
              style={{ "--hold": `${hold}ms` }}
              aria-hidden="true"
            />
            {/* Scanlines sit over the type, the way a real tube does. */}
            <span className="loader__scan" aria-hidden="true" />
          </div>

          <div className="loader__controls" aria-hidden="true">
            <span className="loader__led" />
            <span className="loader__knob" />
            <span className="loader__knob" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
