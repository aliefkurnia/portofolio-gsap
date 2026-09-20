import React, { useRef } from 'react';
import { ProjectsSkeleton } from '../ui/Skeleton';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { useReveals } from '../../hooks/useReveals';
import './Projects.css';

/**
 * The Projects stage. The stage frame supplies the title bar and the
 * repository count, so this renders the grid only.
 *
 * The old scroll-scrubbed image parallax is gone: there is no page scroll in
 * the game shell for a ScrollTrigger to scrub against, and the card lift is
 * now a CSS hover so it matches every other card on the site.
 */
const Projects = () => {
  const sectionRef = useRef(null);
  const { projects, loading } = usePortfolioData();

  useReveals(sectionRef, [projects.length, loading]);

  return (
    <div className="projects" ref={sectionRef}>
      {loading ? (
        <ProjectsSkeleton />
      ) : (
        <div className="projects__grid" data-stagger>
          {projects.map((project) => (
            <article className="project-card" key={project.id}>
              <div className="project-card__media">
                <img
                  src={project.image_url}
                  alt={project.name}
                  className="project-card__image"
                  loading="lazy"
                />
              </div>

              <div className="project-card__body">
                <div className="project-card__head">
                  <h3 className="project-card__name">{project.name}</h3>
                  <div className="project-card__links">
                    {project.source_code_link && (
                      <a
                        href={project.source_code_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-card__link"
                      >
                        code
                      </a>
                    )}
                    {project.website_link && (
                      <a
                        href={project.website_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-card__link project-card__link--accent"
                      >
                        live ↗
                      </a>
                    )}
                  </div>
                </div>

                <p className="project-card__desc">{project.description}</p>

                <p className="project-card__tags">
                  {(project.tags || []).map((tag) => tag.name).join('  ·  ')}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
