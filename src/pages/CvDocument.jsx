import React from 'react';
import PlateHeading from '../components/ui/PlateHeading';
import ProfileCard from '../components/ui/ProfileCard';
import './CvDocument.css';

/**
 * The CV as a pixel document rather than a PDF.
 *
 * Built from the live Supabase payload, so it cannot drift out of sync with
 * the rest of the site the way a re-uploaded PDF can. Its left panel is the
 * very `<ProfileCard>` the home screen renders.
 *
 * What it does *not* have is an EDUCATION section — there is no education
 * table in the schema, and inventing one on a document people send to
 * employers would be worse than leaving it out. The PDF view stays one click
 * away for the complete, authored version.
 */

const CvDocument = ({ settings, experiences, technologies }) => (
  <article className="cvdoc" aria-label="Resume">
    <div className="cvdoc__grid">
      <ProfileCard settings={settings} />

      <div className="cvdoc__main">
        {settings.about_bio && (
          <section className="cvdoc__section">
            <PlateHeading icon="file">Profile</PlateHeading>
            <p className="cvdoc__bio">{settings.about_bio}</p>
          </section>
        )}

        {experiences.length > 0 && (
          <section className="cvdoc__section">
            <PlateHeading icon="briefcase">Experience</PlateHeading>
            <div className="cvdoc__jobs">
              {experiences.map((exp) => (
                <article className="cvdoc__job" key={exp.id}>
                  <header className="cvdoc__job-head">
                    <h4 className="cvdoc__job-title">{exp.title}</h4>
                    <span className="cvdoc__job-date">{exp.date_range}</span>
                  </header>
                  <p className="cvdoc__job-company">{exp.company_name}</p>
                  {exp.points?.length > 0 && (
                    <ul className="cvdoc__points">
                      {exp.points.map((point, i) => (
                        <li className="cvdoc__point" key={i}>
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {technologies.length > 0 && (
          <section className="cvdoc__section">
            <PlateHeading icon="cpu">Skills</PlateHeading>
            <ul className="cvdoc__skills">
              {technologies.map((tech, i) => (
                <li className={`cvdoc__skill cvdoc__skill--${(i % 4) + 1}`} key={tech.id}>
                  {tech.name}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  </article>
);

export default CvDocument;
