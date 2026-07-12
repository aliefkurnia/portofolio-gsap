import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { usePortfolioData } from "../hooks/usePortfolioData";
import "./Projects.css";

const Projects = () => {
  const { projects } = usePortfolioData();
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);
  const autoPlayRef = useRef(null);
  const isPausedRef = useRef(false);

  const totalProjects = projects.length;

  const goToSlide = useCallback((index) => {
    setActiveIndex(index);
    if (carouselRef.current) {
      const cards = carouselRef.current.querySelectorAll(".project-card");
      if (cards[index]) {
        gsap.to(carouselRef.current, {
          scrollLeft: cards[index].offsetLeft - carouselRef.current.offsetLeft,
          duration: 0.8,
          ease: "power2.out",
        });
      }
    }
  }, []);

  const nextSlide = useCallback(() => {
    const next = (activeIndex + 1) % totalProjects;
    goToSlide(next);
  }, [activeIndex, totalProjects, goToSlide]);

  useEffect(() => {
    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        if (!isPausedRef.current) {
          nextSlide();
        }
      }, 4000);
    };

    startAutoPlay();
    return () => clearInterval(autoPlayRef.current);
  }, [nextSlide]);

  const handleCardMouseEnter = (index) => {
    isPausedRef.current = true;
    goToSlide(index);
  };

  const handleCardMouseLeave = () => {
    isPausedRef.current = false;
  };

  return (
    <section id="projects" className="projects-section">
      <div className="projects-header">
        <h2 className="projects-title">My Projects</h2>
        <p className="projects-subtitle">Things I've built and shipped</p>
      </div>

      <div
        className="projects-carousel"
        ref={carouselRef}
      >
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={`project-card ${index === activeIndex ? "active" : ""}`}
            onMouseEnter={() => handleCardMouseEnter(index)}
            onMouseLeave={handleCardMouseLeave}
          >
            <div className="project-image-wrapper">
              <img
                src={project.image_url}
                alt={project.name}
                className="project-image"
              />
            </div>
            <div className="project-info">
              <h3 className="project-name">{project.name}</h3>
              <p className="project-desc">{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag, i) => (
                  <span key={i} className={`project-tag ${tag.color}`}>
                    {tag.name}
                  </span>
                ))}
              </div>
              <div className="project-links">
                <a
                  href={project.source_code_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-btn source"
                >
                  Source Code
                </a>
                <a
                  href={project.website_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-btn live"
                >
                  Live Demo
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="projects-dots">
        {projects.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === activeIndex ? "active" : ""}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Projects;
