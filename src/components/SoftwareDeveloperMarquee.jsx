import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { usePortfolioData } from "../hooks/usePortfolioData";
import "./SoftwareDeveloperMarquee.css";

const SoftwareDeveloperMarquee = () => {
  const { settings } = usePortfolioData();
  const rowRef = useRef(null);
  const tlRef = useRef(null);
  const directionRef = useRef(1);

  const marqueeText = settings.marquee_text || "Software Developer";

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const itemWidth = row.children[0].getBoundingClientRect().width;
    const totalItems = row.children.length;
    const repeatWidth = itemWidth * Math.floor(totalItems / 2);

    gsap.set(row, { x: -repeatWidth });

    tlRef.current = gsap.to(row, {
      x: `-=${itemWidth}`,
      duration: 3,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => {
          const val = parseFloat(x) % repeatWidth;
          return val > 0 ? val - repeatWidth : val;
        }),
      },
    });

    const handleWheel = (e) => {
      const newDir = e.deltaY > 0 ? 1 : -1;
      if (newDir !== directionRef.current) {
        directionRef.current = newDir;
        gsap.to(tlRef.current, {
          timeScale: newDir,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("wheel", handleWheel);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      tlRef.current?.kill();
    };
  }, []);

  return (
    <section className="cb-tagreel">
      <div className="cb-tagreel-content">
        <div className="cb-tagreel-items" role="marquee">
          <div className="cb-tagreel-row" ref={rowRef}>
            <div className="cb-tagreel-item">
              <span>{marqueeText}</span>
            </div>
            <div className="cb-tagreel-item -stroke">
              <span>{marqueeText}</span>
            </div>
            <div className="cb-tagreel-item">
              <span>{marqueeText}</span>
            </div>
            <div className="cb-tagreel-item -stroke">
              <span>{marqueeText}</span>
            </div>
            <div className="cb-tagreel-item">
              <span>{marqueeText}</span>
            </div>
            <div className="cb-tagreel-item -stroke">
              <span>{marqueeText}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SoftwareDeveloperMarquee;
