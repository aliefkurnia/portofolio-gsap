import React from "react";
import { projects } from "../constants"; // Pastikan impor data proyek
import "./Projects.css";

const Projects = () => {
  return (
    <section id="projects" className="projects-section">
      <h2 className="projects-title">My Projects</h2>
      <div className="projects-container">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <img
              src={project.image}
              alt={project.name}
              className="project-image"
            />
            <div className="project-info">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag, index) => (
                  <span key={index} className={tag.color}>
                    {tag.name}
                  </span>
                ))}
              </div>
              <div className="project-links">
                <a
                  href={project.source_code_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source Code
                </a>
                <a
                  href={project.website_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live Website
                </a>
              </div>
            </div>
          </div>
        ))}
        <div className="slide-indicator"> &gt;&gt;&gt; </div>
      </div>

    </section>
  );
};

export default Projects;
