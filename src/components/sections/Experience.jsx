import React, { useRef } from 'react';
import SectionHeading from '../ui/SectionHeading';
import { ExperienceSkeleton } from '../ui/Skeleton';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { useReveals } from '../../hooks/useScrollReveal';
import './Experience.css';

const Experience = () => {
  const sectionRef = useRef(null);
  const { experiences, loading } = usePortfolioData();

  useReveals(sectionRef, [experiences.length, loading]);

  return (
    <section className="experience section" id="experience" ref={sectionRef}>
      <div className="container">
        <SectionHeading
          label="// career.log"
          title="Experience"
          meta="2021 → present"
        />

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
                        <span className="experience__marker">›</span>
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
    </section>
  );
};

export default Experience;
