import React from "react";
import { usePortfolioData } from "../hooks/usePortfolioData";
import "./Works.css";

const Works = () => {
  const { experiences } = usePortfolioData();

  return (
    <div className="works-container">
      <section className="experiences">
        <h2 className="experiences-title">Experience</h2>
        {experiences.map((experience) => (
          <div key={experience.id} className="experience-item">
            <div className="experience-header">
              <img
                src={experience.icon_url}
                alt={experience.company_name}
                className="experience-icon"
                style={{ backgroundColor: experience.icon_bg }}
              />
            </div>

            <div className="separator"></div>

            <div className="experience-details">
              <h3>{experience.title}</h3>
              <h4>{experience.company_name}</h4>
              <p>{experience.date_range}</p>
              <ul className="experience-points">
                {experience.points.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Works;
