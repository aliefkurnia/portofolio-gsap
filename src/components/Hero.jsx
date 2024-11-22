import React, { useEffect, useState } from "react";
import "./Hero.css";
import { useScramble } from "use-scramble";
import SoftwareDeveloperMarquee from "./SoftwareDeveloperMarquee";

const Hero = ({ showHero }) => {
  const [showScramble, setShowScramble] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [scrambledText, setScrambledText] = useState("");
  const [scrambledText1, setScrambledText1] = useState("");

  const { ref: ref1, replay: replay1 } = useScramble({
    text: scrambledText,
    playOnMount: false,
    range: [65, 125],
    speed: 0.33,
    tick: 2,
    step: 1,
    scramble: 1,
    seed: 0,
    chance: 1,
    overdrive: false,
    overflow: false,
  });

  const { ref: ref2, replay: replay2 } = useScramble({
    text: scrambledText1,
    playOnMount: false,
    range: [65, 125],
    speed: 0.33,
    tick: 2,
    step: 1,
    scramble: 1,
    seed: 1,
    chance: 1,
    overdrive: false,
    overflow: false,
  });

  useEffect(() => {
    if (showHero) {
      const scrambleTimer = setTimeout(() => {
        setShowScramble(true);
        setScrambledText("muchammad alief");
        setScrambledText1("kurnia wijaya");

        // Replay kedua teks
        replay1();
        replay2();
      }, 500);

      const descriptionTimer = setTimeout(() => {
        setShowDescription(true);
        setShowImage(true);
      }, 1500);

      return () => {
        clearTimeout(scrambleTimer);
        clearTimeout(descriptionTimer);
      };
    }
  }, [showHero, replay1, replay2]);

  return (
    <div className="hero-container">
      <div className="hero-content">
        {showImage && (
          <img
            src={require("./Assets/alief.png")}
            alt="alip"
            className={`hero-image ${showImage ? "visible" : ""}`}
          />
        )}
        {showScramble && (
          <>
            <p
              className={`hero-title ${showScramble ? "visible" : ""}`}
              ref={ref1}
            ></p>
            <p
              className={`hero-title1 ${showScramble ? "visible" : ""}`}
              ref={ref2}
            ></p>
          </>
        )}
        {showDescription && <SoftwareDeveloperMarquee />}
      </div>
    </div>
  );
};

export default Hero;
