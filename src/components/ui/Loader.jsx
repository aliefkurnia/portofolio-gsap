import React, { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
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

function generatePositions(count) {
  const positions = [];
  const centerRadius = 140;

  // Grid-based: divide screen into cells, place one word per cell with jitter
  const cols = 6;
  const rows = Math.ceil(count / cols);
  const cellW = 200 / cols;   // total range -100% to 100%
  const cellH = 900 / rows;   // total range -450% to 450%

  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ r, c });
    }
  }

  // Shuffle cells so words aren't in grid order
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  for (let i = 0; i < count; i++) {
    const { r, c } = cells[i];
    let x, y;
    let attempts = 0;

    do {
      // Position within cell + random jitter
      x = -100 + c * cellW + cellW * 0.2 + Math.random() * cellW * 0.6;
      y = -450 + r * cellH + cellH * 0.2 + Math.random() * cellH * 0.6;
      attempts++;
    } while (Math.sqrt(x * x + y * y) < centerRadius && attempts < 30);

    // If stuck inside center, push outward
    if (Math.sqrt(x * x + y * y) < centerRadius) {
      const angle = Math.atan2(y, x);
      x = Math.cos(angle) * (centerRadius + 20 + Math.random() * 40);
      y = Math.sin(angle) * (centerRadius + 20 + Math.random() * 40);
    }

    positions.push({
      x: `${x.toFixed(0)}%`,
      y: `${y.toFixed(0)}%`,
      size: (0.75 + Math.random() * 0.3).toFixed(2),
    });
  }

  return positions;
}

const Loader = ({ onComplete }) => {
  const loaderRef = useRef(null);
  const mainRef = useRef(null);
  const wordsRef = useRef([]);

  const greetings = useMemo(() => {
    const shuffled = [...allGreetings].sort(() => Math.random() - 0.5);
    const positions = generatePositions(shuffled.length);
    return shuffled.map((text, i) => ({ text, ...positions[i] }));
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(loaderRef.current, {
          opacity: 0,
          scale: 1.08,
          duration: 0.5,
          ease: "power3.inOut",
          onComplete,
        });
      },
    });

    tl.fromTo(
      mainRef.current,
      { opacity: 0, scale: 0.85, y: 10 },
      { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "power3.out" },
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
      "-=0.3",
    );

    tl.to({}, { duration: 0.8 });

    tl.to([mainRef.current, ...wordsRef.current], {
      opacity: 0,
      scale: 1.1,
      duration: 0.35,
      ease: "power2.in",
      stagger: 0.02,
    });
  }, [onComplete]);

  return (
    <div className="loader" ref={loaderRef}>
      <div className="loader__scene">
        <span className="loader__main" ref={mainRef}>
          Hello
        </span>
        {greetings.map((g, i) => (
          <span
            key={i}
            className="loader__word"
            ref={(el) => (wordsRef.current[i] = el)}
            style={{
              "--x": g.x,
              "--y": g.y,
              "--size": g.size,
            }}
          >
            {g.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Loader;
