import React, { useRef } from 'react';
import { AboutImageSkeleton } from '../ui/Skeleton';
import { aboutText } from '../../data/constants';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { useReveals } from '../../hooks/useReveals';
import './About.css';

/**
 * The About stage. The stage frame already supplies the `->> ABOUT <<-`
 * title bar, so this renders body content only.
 */
const About = () => {
  const sectionRef = useRef(null);
  const { settings, loading } = usePortfolioData();

  const heroImage = settings.hero_photo_url;
  const headline = settings.about_headline || aboutText.headline;
  const bio = settings.about_bio || aboutText.bio;

  useReveals(sectionRef, [loading]);

  return (
    <div className="about" ref={sectionRef}>
      <div className="about__grid">
        <div className="about__media" data-reveal>
          <div className="about__frame">
            {loading ? (
              <AboutImageSkeleton />
            ) : heroImage ? (
              <img src={heroImage} alt="Alief Kurnia" className="about__photo" />
            ) : (
              <span className="about__photo-empty" aria-hidden="true" />
            )}
          </div>
          <div className="about__caption">
            <span className="about__caption-dot" />
            <span>Based in Indonesia</span>
          </div>
        </div>

        <div className="about__body">
          <h2 className="about__headline" data-reveal>{headline}</h2>
          <p className="about__bio" data-reveal>{bio}</p>

          <div className="about__chips" data-stagger>
            {aboutText.chips.map((chip) => (
              <span key={chip} className="about__chip">{chip}</span>
            ))}
          </div>

          <div className="about__stats" data-stagger>
            {aboutText.stats.map((stat) => (
              <div className="about__stat" key={stat.label}>
                <span className="about__stat-value">{stat.value}</span>
                <span className="about__stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
