import React, { useEffect, useState } from "react";
import "./Hero.css";
import { useScramble } from "use-scramble";

const Hero = ({ showHero }) => {
  const [showScramble, setShowScramble] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [hasReplayed, setHasReplayed] = useState(false);
  const [scrambledText, setScrambledText] = useState("");

  const { ref, replay } = useScramble({
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

  useEffect(() => {
    if (showHero) {
      const scrambleTimer = setTimeout(() => {
        setShowScramble(true);
        setScrambledText("Muchammad Alief Kurnia Wijaya");
      }, 1200);

      const replayTimer = setTimeout(() => {
        if (!hasReplayed) {
          setHasReplayed(true);
        }
      });

      const descriptionTimer = setTimeout(() => {
        setShowDescription(true);
        setShowImage(true);
      }, 3500);

      return () => {
        clearTimeout(scrambleTimer);
        clearTimeout(replayTimer);
        clearTimeout(descriptionTimer);
      };
    }
  }, [showHero, replay, hasReplayed]);

  return (
    <div className="hero-container">
      <div className="hero-content">
        {showImage && (
          <img
            src={require("./Assets/alief.png")}
            alt="Muchammad Alief Kurnia Wijaya"
            className={`hero-image ${showImage ? "visible" : ""}`}
          />
        )}
        {showScramble && (
          <p
            className={`hero-title ${showScramble ? "visible" : ""}`}
            ref={ref}
          ></p>
        )}
        {showDescription && (
          <p className={`hero-description ${showDescription ? "visible" : ""}`}>
            Software Developer
          </p>
        )}
      </div>
    </div>
  );
};

export default Hero;
