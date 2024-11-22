import React from "react";
import { experiences } from "../constants";
import "./Works.css";

const Works = () => {
  return (
    <div className="works-container">
      <section className="experiences">
        <h2 className="experiences-title">Experience</h2>
        {experiences.map((experience, index) => (
          <div key={index} className="experience-item">
            <div className="experience-header">
              <img
                src={experience.icon}
                alt={experience.company_name}
                className="experience-icon"
                style={{ backgroundColor: experience.iconBg }}
              />
            </div>

            <div className="separator"></div>

            <div className="experience-details">
              <h3>{experience.title}</h3>
              <h4>{experience.company_name}</h4>
              <p>{experience.date}</p>
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
