import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeading from '../ui/SectionHeading';
import { aboutText } from '../../data/constants';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const statsRef = useRef(null);

  const { settings } = usePortfolioData();
  const heroImage = settings.hero_photo_url;
  const headline = settings.about_headline || aboutText.headline;
  const bio = settings.about_bio || aboutText.bio;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about__heading',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      );

      gsap.fromTo(
        '.about__bio',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      );

      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: imageRef.current, start: 'top 80%' },
          }
        );
      }

      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: { trigger: statsRef.current, start: 'top 85%' },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="about section section--light" id="about" ref={sectionRef}>
      <div className="container">
        <div className="about__grid">
          <div className="about__image-col">
            <div className="about__image-wrapper" ref={imageRef}>
              {heroImage && (
                <img src={heroImage} alt="Alief Kurnia" className="about__image" />
              )}
              <div className="about__image-border"></div>
            </div>
          </div>

          <div className="about__text-col">
            <div className="about__heading">
              <SectionHeading label="About Me" title={headline} />
            </div>
            <p className="about__bio">{bio}</p>

            <div className="about__stats" ref={statsRef}>
              {aboutText.stats.map((stat, index) => (
                <div key={index} className="about__stat">
                  <span className="about__stat-value text-gradient">{stat.value}</span>
                  <span className="about__stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
