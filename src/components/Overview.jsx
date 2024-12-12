import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Overview.css";

gsap.registerPlugin(ScrollTrigger);

const Overview = ({ userName }) => {
  const scrollTextWrapperRef = useRef(null);
  const scrollTextRef = useRef(null);
  const initialTextRef = useRef(null);
  const [scrollLength, setScrollLength] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if the screen is mobile or not
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    const updateScrollLength = () => {
      const totalWidth = Array.from(scrollTextRef.current.children).reduce(
        (acc, child) => acc + child.offsetWidth,
        0
      );
      setScrollLength(totalWidth);
    };

    updateScrollLength();
    window.addEventListener("resize", updateScrollLength);

    if (!isMobile) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollTextWrapperRef.current,
          start: "top top",
          end: `+=${scrollLength}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(scrollTextRef.current, { x: -scrollLength, ease: "Power2.out" });

      gsap.fromTo(
        initialTextRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "Power2.out",
          scrollTrigger: {
            trigger: initialTextRef.current,
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      window.removeEventListener("resize", updateScrollLength);
    };
  }, [scrollLength, isMobile, userName]);

  return (
    <div className="scrollText-wrapper" ref={scrollTextWrapperRef}>
      <div className="initial-text" ref={initialTextRef}>
        <h1>
          <i>Hello</i>,{" "}
          <span className="userName">{userName ? userName : "anonimous"}</span>
          👋
        </h1>
      </div>

      <div className={`scroll-text ${isMobile ? "mobile-text" : ""}`} ref={scrollTextRef}>
        <h1>
          {isMobile ? (
            <>Welcome to My Portfolio{" "}
              <span className="userName">{userName ? userName : "anonimous"}</span>,{" "}
              Explore My Work and Projects, Let's Create Something Amazing ✨!</>
          ) : (
            <>
              Welcome to My Portfolio{" "}
              <span className="userName">{userName ? userName : "anonimous"}</span>,{" "}
              Explore My Work and Projects, Let's Create Something Amazing ✨!</>

          )}
        </h1>
      </div>
    </div>
  );
};

export default Overview;
