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

  useEffect(() => {
    const updateScrollLength = () => {
      // Calculate total width of all <h1> elements
      const totalWidth = Array.from(scrollTextRef.current.children).reduce(
        (acc, child) => acc + child.offsetWidth,
        0
      );
      console.log(totalWidth); // Log to check the total width calculation
      setScrollLength(totalWidth);
    };

    updateScrollLength();
    window.addEventListener("resize", updateScrollLength);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollTextWrapperRef.current,
        start: "top top",
        end: `+=${scrollLength}`, // Set end based on scrollLength
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

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      window.removeEventListener("resize", updateScrollLength);
    };
  }, [scrollLength, userName]);

  return (
    <div className="scrollText-wrapper" ref={scrollTextWrapperRef}>
      <div className="initial-text" ref={initialTextRef}>
        <h1>Hello, {userName ? userName : "anonimous"}👋</h1>
      </div>

      <div className="scroll-text" ref={scrollTextRef}>
        <h1>Welcome to My Portfolio {userName}, </h1>
        <h1>Explore My Work and Projects, </h1>
        <h1>Let's Create Something Amazing!</h1>
      </div>
    </div>
  );
};

export default Overview;
