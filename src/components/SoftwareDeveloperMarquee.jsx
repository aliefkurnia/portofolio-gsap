import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import "./SoftwareDeveloperMarquee.css";

const SoftwareDeveloperMarquee = () => {
  const [scrollDirection, setScrollDirection] = useState("left-to-right");

  const handleWheel = (event) => {
    if (event.deltaY > 0) {
      setScrollDirection("left-to-right");
    } else {
      setScrollDirection("right-to-left");
    }
  };

  useEffect(() => {
    const developmentRow = document.querySelector(".cb-tagreel-row");
    let rowWidth = developmentRow.getBoundingClientRect().width;
    let rowItemWidth = developmentRow.children[0].getBoundingClientRect().width;

    let initialOffset = ((2 * rowItemWidth) / rowWidth) * 100 * -1;

    gsap.set(developmentRow, {
      xPercent: initialOffset,
    });

    let duration = 6;
    var tl = gsap.timeline();

    const animateRow = () => {
      if (scrollDirection === "left-to-right") {
        tl.to(developmentRow, {
          ease: "none",
          duration: duration,
          xPercent: 0,
          repeat: -1,
        });
      } else {
        tl.to(developmentRow, {
          ease: "none",
          duration: duration,
          xPercent: -100,
          repeat: -1,
        });
      }
    };

    animateRow();

    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [scrollDirection]);

  return (
    <section className="cb-tagreel">
      <div className="cb-tagreel-content">
        <div className="cb-tagreel-items" role="marquee">
          <div className="cb-tagreel-row">
            <div className="cb-tagreel-item">
              <span>Software Developer</span>
            </div>
            <div className="cb-tagreel-item -stroke">
              <span>Software Developer</span>
            </div>
            <div className="cb-tagreel-item">
              <span>Software Developer</span>
            </div>
            <div className="cb-tagreel-item -stroke">
              <span>Software Developer</span>
            </div>
            <div className="cb-tagreel-item">
              <span>Software Developer</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SoftwareDeveloperMarquee;
