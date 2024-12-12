import React from "react";
import { technologies } from "../constants"; 
import "./Technologies.css";

const Technologies = () => {
  return (
    <div className="technologies-section">
      <h2 className="technologies-title">Tech I Use</h2>
      <div className="technologies-list">
        {technologies.slice(0, 23).map((tech, index) => (
          <div className="technology-card" key={index}>
            <img src={tech.icon} alt={tech.name} className="tech-icon" />
            <p>{tech.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Technologies;
