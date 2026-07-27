import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeading from '../ui/SectionHeading';
import { ProjectsSkeleton } from '../ui/Skeleton';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { useReveals } from '../../hooks/useScrollReveal';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const sectionRef = useRef(null);
  const { projects, loading } = usePortfolioData();

  useReveals(sectionRef, [projects.length, loading]);

  const prefersReduced = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Image parallax (scrubbed over each card's scroll range)
  useEffect(() => {
    if (loading || projects.length === 0 || prefersReduced()) return;
    const ctx = gsap.context(() => {
      sectionRef.current
        .querySelectorAll('.project-card')
        .forEach((card) => {
          const img = card.querySelector('.project-card__image');
          if (!img) return;
          gsap.fromTo(
            img,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        });
    }, sectionRef);
    return () => ctx.revert();
  }, [projects, loading]);

  const hover = (e, active) => {
    if (prefersReduced()) return;
    const card = e.currentTarget;
    gsap.to(card, {
      y: active ? -6 : 0,
      borderColor: active ? 'var(--accent)' : 'var(--border)',
      duration: 0.35,
      ease: 'power3.out',
    });
    const img = card.querySelector('.project-card__image');
    if (img) gsap.to(img, { scale: active ? 1.06 : 1, duration: 0.5, ease: 'power3.out' });
  };

  const repoMeta = `${String(projects.length || 0).padStart(2, '0')} repositories`;

  return (
    <section className="projects section" id="projects" ref={sectionRef}>
      <div className="container">
        <SectionHeading
          label="// ls ./projects"
          title="Selected Projects"
          meta={repoMeta}
        />

        {loading ? (
          <ProjectsSkeleton />
        ) : (
          <div className="projects__grid" data-stagger>
            {projects.map((project) => (
              <article
                key={project.id}
                className="project-card"
                onMouseEnter={(e) => hover(e, true)}
                onMouseLeave={(e) => hover(e, false)}
              >
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
    </section>
  );
};

export default Projects;
