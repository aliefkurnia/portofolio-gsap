import React, { useRef } from 'react';
import { TechStackSkeleton } from '../ui/Skeleton';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { useReveals } from '../../hooks/useReveals';
import './TechStack.css';

/** The Tech Stack stage. The stage frame supplies the title bar. */
const TechStack = () => {
  const sectionRef = useRef(null);
  const { technologies, loading } = usePortfolioData();

  useReveals(sectionRef, [technologies.length, loading]);

  return (
    <div className="techstack" ref={sectionRef}>
      {loading ? (
        <TechStackSkeleton />
      ) : (
        <div className="techstack__grid" data-stagger>
          {technologies.map((tech) => (
            <div className="techstack__tile" key={tech.id}>
              <div className="techstack__icon-box">
                {tech.icon_url ? (
                  <img
                    src={tech.icon_url}
                    alt={tech.name}
                    className="techstack__icon"
                    loading="lazy"
                  />
                ) : (
                  <span className="techstack__icon-fallback">
                    {tech.name?.replace(/[^a-zA-Z0-9]/g, '').charAt(0).toUpperCase() || '?'}
                  </span>
                )}
              </div>
              <span className="techstack__name">{tech.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TechStack;
