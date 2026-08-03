import React, { useRef } from 'react';
import { gsap } from 'gsap';
import SectionHeading from '../ui/SectionHeading';
import { TechStackSkeleton } from '../ui/Skeleton';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { useReveals } from '../../hooks/useScrollReveal';
import './TechStack.css';

const TechStack = () => {
  const sectionRef = useRef(null);
  const { technologies, loading } = usePortfolioData();

  useReveals(sectionRef, [technologies.length, loading]);

  const prefersReduced = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const hover = (e, lift) => {
    if (prefersReduced()) return;
    gsap.to(e.currentTarget, {
      y: lift ? -5 : 0,
      duration: 0.3,
      ease: 'power3.out',
    });
  };

  return (
    <section className="techstack section" id="techstack" ref={sectionRef}>
      <div className="container">
        <SectionHeading label="Stack" title="Tech Stack" />

        {loading ? (
          <TechStackSkeleton />
        ) : (
          <div className="techstack__grid" data-stagger>
            {technologies.map((tech) => (
              <div
                key={tech.id}
                className="techstack__tile"
                onMouseEnter={(e) => hover(e, true)}
                onMouseLeave={(e) => hover(e, false)}
              >
                <div className="techstack__icon-box">
                  <img
                    src={tech.icon_url}
                    alt={tech.name}
                    className="techstack__icon"
                    loading="lazy"
                  />
                </div>
                <span className="techstack__name">{tech.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TechStack;
