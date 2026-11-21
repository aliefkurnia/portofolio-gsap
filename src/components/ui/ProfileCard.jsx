import React from 'react';
import PixelIcon from './PixelIcon';
import PlateHeading from './PlateHeading';
import { socialLinks } from '../../data/constants';
import './ProfileCard.css';

/**
 * Portrait, name, and contact — the left panel of the reference CV.
 *
 * Shared by the home screen and the CV document, so the biography the player
 * meets on the world map is literally the same markup as the one on the
 * resume. `panel` adds the card chrome for the home, where it sits on the
 * cloud backdrop; the CV already provides its own paper, so it omits it.
 */

const contacts = [
  { icon: 'envelope', value: socialLinks.email },
  {
    icon: 'github',
    value: socialLinks.github.replace(/^https?:\/\//, '').replace(/\/$/, ''),
    href: socialLinks.github,
  },
  {
    icon: 'linkedin',
    value: socialLinks.linkedin.replace(/^https?:\/\//, '').replace(/\/$/, ''),
    href: socialLinks.linkedin,
  },
  { icon: 'person', value: 'Indonesia' },
];

const ProfileCard = ({ settings, panel = false, showName = true, className = '' }) => {
  const role = settings.job_title || '.NET Software Developer';
  const photo = settings.hero_photo_url;

  return (
    <aside
      className={`profile${panel ? ' profile--panel' : ''}${className ? ` ${className}` : ''}`}
    >
      <div className="profile__portrait">
        {photo ? (
          <img src={photo} alt="Muchammad Alief Kurnia Wijaya" />
        ) : (
          <span className="profile__portrait-empty" aria-hidden="true">
            <PixelIcon name="person" size={44} />
          </span>
        )}
      </div>

      {showName && (
        <h2 className="profile__name">Muchammad Alief Kurnia Wijaya</h2>
      )}
      <p className={`profile__role${showName ? '' : ' profile__role--lead'}`}>{role}</p>

      <span className="profile__status">
        <span className="profile__status-dot" />
        Available for work
      </span>

      <PlateHeading icon="envelope">Contact</PlateHeading>

      <ul className="profile__contacts">
        {contacts.map((c) => (
          <li className="profile__contact" key={c.value}>
            <span className="profile__contact-icon">
              <PixelIcon name={c.icon} size={13} />
            </span>
            {c.href ? (
              <a
                className="profile__contact-text"
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {c.value}
              </a>
            ) : (
              <span className="profile__contact-text">{c.value}</span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ProfileCard;
