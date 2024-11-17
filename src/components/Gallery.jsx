import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Gallery.css";

gsap.registerPlugin(ScrollTrigger);

const Gallery = () => {
  const scrollTextWrapperRef = useRef(null);
  const scrollTextRef = useRef(null);
  const initialTextRef = useRef(null);

  useEffect(() => {
    const scrollTextWrapper = scrollTextWrapperRef.current;
    const scrollText = scrollTextRef.current;
    const initialText = initialTextRef.current;

    const textWidth = scrollText.offsetWidth;
    const scrollLength = 10000;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollTextWrapper,
        start: "top top",
        end: scrollLength,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    tl.to(scrollText, { x: -scrollLength, ease: "Power2.out" });

    gsap.fromTo(
      initialText,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "Power2.out",
        scrollTrigger: {
          trigger: initialText,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <div className="scrollText-wrapper" ref={scrollTextWrapperRef}>
        <div className="initial-text" ref={initialTextRef}>
          <h1>Overview</h1>
        </div>

        <div className="scroll-text" ref={scrollTextRef}>
          <h1>I'm a web developer</h1>
          <h1>with nearly two years of experience</h1>
          <h1>in .NET Core and JavaScript frameworks</h1>
          <h1>like React.js and Express.js.</h1>
          <h1>Passionate about solving complex problems,</h1>
          <h1>I'm currently exploring Three.js</h1>
          <h1>to expand my skills.</h1>
          <h1>Eager to collaborate on innovative projects</h1>
          <h1>and bring creative ideas to life.</h1>
        </div>
      </div>
    </>
  );
};

export default Gallery;
