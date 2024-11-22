import React, { useEffect } from "react";
import { gsap } from "gsap";
import "./SoftwareDeveloperMarquee.css";

const SoftwareDeveloperMarquee = () => {
  useEffect(() => {
    const developmentRow = document.querySelector(".cb-tagreel-row");
    let rowWidth = developmentRow.getBoundingClientRect().width;
    let rowItemWidth = developmentRow.children[0].getBoundingClientRect().width;

    let initialOffset = ((2 * rowItemWidth) / rowWidth) * 100 * -1;

    gsap.set(developmentRow, {
      xPercent: initialOffset,
    });

    let duration = 5;
    var tl = gsap.timeline();

    tl.to(developmentRow, {
      ease: "none",
      duration: duration,
      xPercent: 0,
      repeat: -1,
    });
  }, []);

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
