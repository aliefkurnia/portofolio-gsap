import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeading from '../ui/SectionHeading';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import './TechStack.css';

gsap.registerPlugin(ScrollTrigger);

const TechStack = () => {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  const { technologies } = usePortfolioData();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.techstack__heading',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      );

      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 30, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power3.out',
            scrollTrigger: { trigger: gridRef.current, start: 'top 85%' },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [technologies]);

  return (
    <section className="techstack section section--light" id="techstack" ref={sectionRef}>
      <div className="container">
        <div className="techstack__heading">
          <SectionHeading
            label="Technologies"
            title="Tech Stack"
            align="center"
          />
        </div>

        <div className="techstack__grid" ref={gridRef}>
          {technologies.map((tech) => (
            <div key={tech.id} className="techstack__item">
              <div className="techstack__icon-wrapper">
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
      </div>
    </section>
  );
};

export default TechStack;
