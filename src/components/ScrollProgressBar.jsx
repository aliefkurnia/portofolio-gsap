import React, { useState, useEffect } from "react";
import "./ScrollProgressBar.css"; // CSS untuk progress bar

const ScrollProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Mendapatkan total tinggi halaman dan posisi scroll
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage = (scrollTop / scrollHeight) * 100;

      setScrollProgress(scrollPercentage); // Update progress bar
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener saat komponen unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="scroll-progress-container">
      <div
        className="scroll-progress-bar"
        style={{ width: `${scrollProgress}%` }}
      ></div>
    </div>
  );
};

export default ScrollProgressBar;
