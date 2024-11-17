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

    const Width = 6000;
    const horizontalScrollLength = Width - window.innerWidth;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollTextWrapper,
        start: "top",
        end: Width,
        pin: true,
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    });

    tl.set(scrollText, { x: horizontalScrollLength });
    tl.to(scrollText, { ease: "Power2.out", scale: 1, x: 0 });

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
          <h1>Welcome to the Horizontal Scroll Experience!</h1>
        </div>

        <div className="scroll-text" ref={scrollTextRef}>
          <h1>This</h1>
          <h1>is</h1>
          <h1>an</h1>
          <h1>example</h1>
          <h1>of</h1>
          <h1>horizontal</h1>
          <h1>scroll</h1>
          <h1>In</h1>
          <h1>Gsap</h1>
          <h1>using</h1>
          <h1>scrollTrigger.</h1>
        </div>
      </div>
    </>
  );
};

export default Gallery;
