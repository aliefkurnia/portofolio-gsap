import React, { useRef } from 'react';
import { AboutImageSkeleton } from '../ui/Skeleton';
import { aboutText } from '../../data/constants';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { useReveals } from '../../hooks/useScrollReveal';
import './About.css';

const About = () => {
  const sectionRef = useRef(null);
  const { settings, loading } = usePortfolioData();

  const heroImage = settings.hero_photo_url;
  const headline = settings.about_headline || aboutText.headline;
  const bio = settings.about_bio || aboutText.bio;

  useReveals(sectionRef, [loading]);

  return (
    <section className="about section" id="about" ref={sectionRef}>
      <div className="container about__grid">
        <div className="about__media" data-reveal>
          <div className="about__frame">
            {loading ? (
              <AboutImageSkeleton />
            ) : heroImage ? (
              <img src={heroImage} alt="Alief Kurnia" className="about__photo" />
            ) : null}
          </div>
          <div className="about__caption">
            <span className="about__caption-dot" />
            <span>Based in Indonesia</span>
          </div>
        </div>

        <div className="about__body">
          <span className="eyebrow" data-reveal>About</span>
          <h2 className="about__headline" data-reveal>{headline}</h2>
          <p className="about__bio" data-reveal>{bio}</p>
          <div className="about__chips" data-stagger>
            {aboutText.chips.map((chip) => (
              <span key={chip} className="about__chip">{chip}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
