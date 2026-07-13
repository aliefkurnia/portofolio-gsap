import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeading from '../ui/SectionHeading';
import { achievements } from '../../data/constants';
import './Achievements.css';

gsap.registerPlugin(ScrollTrigger);

const Achievements = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.achievements__heading',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      );

      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { opacity: 0, y: 50, rotateY: -10 },
          {
            opacity: 1,
            y: 0,
            rotateY: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: cardsRef.current, start: 'top 85%' },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="achievements section section--dark" id="achievements" ref={sectionRef}>
      <div className="container">
        <div className="achievements__heading">
          <SectionHeading
            label="Milestones"
            title="Achievements"
            light
            align="center"
          />
        </div>

        <div className="achievements__grid" ref={cardsRef}>
          {achievements.map((achievement) => (
            <div key={achievement.id} className="achievement-card">
              <div className="achievement-card__metric">
                <span className="achievement-card__value text-gradient">
                  {achievement.metric}
                </span>
                <span className="achievement-card__metric-label">
                  {achievement.metricLabel}
                </span>
              </div>
              <h3 className="achievement-card__title">{achievement.title}</h3>
              <p className="achievement-card__desc">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
