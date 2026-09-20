import React, { useRef } from 'react';
import PixelIcon from '../ui/PixelIcon';
import { ExperienceSkeleton } from '../ui/Skeleton';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { useReveals } from '../../hooks/useReveals';
import './Experience.css';

/** The Experience stage. The stage frame supplies the title bar. */
const Experience = () => {
  const sectionRef = useRef(null);
  const { experiences, loading } = usePortfolioData();

  useReveals(sectionRef, [experiences.length, loading]);

  return (
    <div className="experience" ref={sectionRef}>
      {loading ? (
        <ExperienceSkeleton />
      ) : (
        <div className="experience__list">
          {experiences.map((exp) => (
            <article className="experience__row" key={exp.id} data-reveal>
              <div className="experience__meta">
                <span className="experience__date">{exp.date_range}</span>
                <div className="experience__logo-tile">
                  <img
                    src={exp.icon_url}
                    alt={exp.company_name}
                    className="experience__logo"
                  />
                </div>
              </div>

              <div className="experience__detail">
                <h3 className="experience__title">{exp.title}</h3>
                <p className="experience__company">{exp.company_name}</p>
                <ul className="experience__points" data-bullets>
                  {exp.points.map((point, idx) => (
                    <li key={idx} className="experience__point">
                      <PixelIcon
                        name="arrowRight"
                        size={14}
                        className="experience__marker"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Experience;
