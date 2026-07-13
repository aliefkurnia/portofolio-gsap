import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeading from '../ui/SectionHeading';
import { ExperienceSkeleton } from '../ui/Skeleton';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import './Experience.css';

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);

  const { experiences, loading } = usePortfolioData();

  useEffect(() => {
    if (loading || experiences.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.experience__heading',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      );

      const items = timelineRef.current?.querySelectorAll('.experience__item');
      if (items) {
        items.forEach((item, i) => {
          gsap.fromTo(
            item,
            { opacity: 0, y: 60, rotateX: -5 },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 0.7,
              delay: i * 0.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 85%',
              },
            }
          );
        });
      }

      if (timelineRef.current) {
        gsap.fromTo(
          '.experience__line',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 80%',
              end: 'bottom 80%',
              scrub: 1,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [experiences, loading]);

  return (
    <section className="experience section section--dark" id="experience" ref={sectionRef}>
      <div className="container">
        <div className="experience__heading">
          <SectionHeading label="Career" title="Experience" light />
        </div>

        {loading ? (
          <ExperienceSkeleton />
        ) : (
          <div className="experience__timeline" ref={timelineRef}>
            <div className="experience__line"></div>

            {experiences.map((exp) => (
              <div key={exp.id} className="experience__item">
                <div className="experience__dot"></div>

                <div className="experience__card">
                  <div className="experience__card-header">
                    <img
                      src={exp.icon_url}
                      alt={exp.company_name}
                      className="experience__icon"
                      style={{ backgroundColor: exp.icon_bg }}
                    />
                    <div>
                      <h3 className="experience__role">{exp.title}</h3>
                      <p className="experience__company">{exp.company_name}</p>
                    </div>
                  </div>
                  <span className="experience__date">{exp.date_range}</span>
                  <ul className="experience__points">
                    {exp.points.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
