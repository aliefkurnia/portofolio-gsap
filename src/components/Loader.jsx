import React, { useState, useEffect } from "react";
import "./Loader.css";
import loader from "./Assets/loader.svg";
const Loader = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const simulateProgress = (progressValue) => {
      if (progressValue >= 100) {
        setLoading(false);
        return;
      }

      setProgress(progressValue);
      setTimeout(() => simulateProgress(progressValue + 10), 200);
    };

    simulateProgress(0);

    return () => {};
  }, []);

  if (!loading) {
    return null;
  }

  return (
    <div className="loader-wrapper">
      <img src={loader} alt="Loading..." className="loader-image" />

      <div className="loader-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default Loader;
