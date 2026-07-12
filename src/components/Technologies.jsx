import React from "react";
import { usePortfolioData } from "../hooks/usePortfolioData";
import "./Technologies.css";

const Technologies = () => {
  const { technologies } = usePortfolioData();

  return (
    <div className="technologies-section">
      <h2 className="technologies-title">Tech I Use</h2>
      <div className="technologies-list">
        {technologies.map((tech) => (
          <div className="technology-card" key={tech.id}>
            <img src={tech.icon_url} alt={tech.name} className="tech-icon" />
            <p>{tech.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Technologies;
