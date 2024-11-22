import React from "react";
import {experiences } from "../constants";
import "../components/Works";
 
const Works = () => {
  return (
    <div className="works-container">
      <section className="experiences">
        <h2>Experiences</h2>
        {experiences.map((experience, index) => (
          <div key={index} className="experience-item">
            <div className="experience-header">
              <img
                src={experience.icon}
                alt={experience.company_name}
                className="experience-icon"
                style={{ backgroundColor: experience.iconBg }}
              />
              <div className="experience-details">
                <h3>{experience.title}</h3>
                <h4>{experience.company_name}</h4>
                <p>{experience.date}</p>
              </div>
            </div>
            <ul className="experience-points">
              {experience.points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Works;
