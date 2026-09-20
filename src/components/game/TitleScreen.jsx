import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import PixelIcon from '../ui/PixelIcon';
import { STAGES, LINKS } from './screens';
import { aboutText, socialLinks } from '../../data/constants';
import './TitleScreen.css';

/**
 * The title screen — a centred arcade start screen rather than a CV.
 *
 * One column, one hero: a framed avatar, the name stated exactly once as the
 * wordmark, a tagline, and a single START. Below it a numbered strip lists the
 * stages the run contains (a table of contents, not a stage-select), and a
 * quiet row carries the contacts and the two destinations that leave the shell
 * (Arcade, Resume). Nothing here scrolls — the column is sized against the
 * viewport height so it centres on one screen.
 */

const SOCIALS = [
  { key: 'email', icon: 'envelope', href: `mailto:${socialLinks.email}`, label: 'Email' },
  { key: 'github', icon: 'code', href: socialLinks.github, label: 'GitHub' },
  { key: 'linkedin', icon: 'link', href: socialLinks.linkedin, label: 'LinkedIn' },
];

const TitleScreen = ({ data, onStart }) => {
  const rootRef = useRef(null);

  // A stage the admin has switched off is not part of the run, so it is not in
  // the contents either — and the run still starts at whatever is first.
  const stages = STAGES.filter((stage) => !stage.hidden?.(data));
  const first = stages[0];
  const role = data.settings.job_title || '.NET Software Developer';
  const photo = data.settings.hero_photo_url;

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.title__avatar', { opacity: 0, scale: 0.85, duration: 0.5, ease: 'back.out(1.6)' })
        .from('.title__kicker', { opacity: 0, y: -10, duration: 0.35 }, '-=0.2')
        .from('.title__name', { opacity: 0, y: 16, duration: 0.45 }, '-=0.18')
        .from('.title__tagline', { opacity: 0, y: 10, duration: 0.35 }, '-=0.24')
        .from('.title__meta', { opacity: 0, y: 8, duration: 0.3 }, '-=0.22')
        .from('.title__start', { opacity: 0, scale: 0.9, duration: 0.4, ease: 'back.out(1.5)' }, '-=0.15')
        .from('.title__stage', { opacity: 0, y: 10, stagger: 0.05, duration: 0.3 }, '-=0.14')
        .from('.title__links', { opacity: 0, y: 10, duration: 0.35 }, '-=0.1')
        .from('.title__foot', { opacity: 0, duration: 0.4 }, '-=0.2');
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="world" ref={rootRef}>
      <div className="shell__clouds" aria-hidden="true">
        <span className="shell__cloud shell__cloud--1" />
        <span className="shell__cloud shell__cloud--2" />
        <span className="shell__cloud shell__cloud--3" />
      </div>

      <div className="title">
        <div className="title__stack">
          <div className="title__avatar">
            {photo ? (
              <img src={photo} alt="Muchammad Alief Kurnia Wijaya" />
            ) : (
              <span className="title__avatar-empty" aria-hidden="true">
                <PixelIcon name="person" size={40} />
              </span>
            )}
          </div>

          <span className="title__kicker">
            <span className="title__kicker-mark" aria-hidden="true" />
            Portfolio
          </span>

          <h1 className="title__name px-title">Alief Kurnia</h1>

          <p className="title__tagline">{aboutText.headline}</p>

          <p className="title__meta">
            <span className="title__status">
              <span className="title__status-dot" aria-hidden="true" />
              Available for work
            </span>
            <span className="title__meta-sep" aria-hidden="true" />
            <span className="title__role">{role}</span>
          </p>

          {/* Focused on mount so ENTER starts the run without tabbing to it —
              which is what the footer promises. */}
          <button
            type="button"
            className="title__start px-btn"
            onClick={() => onStart(first.key)}
            disabled={!first}
            autoFocus
          >
            <PixelIcon name="gamepad" size={18} />
            start
          </button>

          {/* Contents, not a stage-select: numbered, quiet, no hover state. */}
          <ol className="title__stages" aria-label="Stages, in order">
            {stages.map((stage, i) => (
              <li className="title__stage" key={stage.key}>
                <span className="title__stage-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="title__stage-name">{stage.label}</span>
              </li>
            ))}
          </ol>

          {/* Contacts, and the two routes that leave the shell. */}
          <nav className="title__links" aria-label="Contact and links">
            {SOCIALS.map((s) => (
              <a
                key={s.key}
                className="title__social"
                href={s.href}
                target={s.key === 'email' ? undefined : '_blank'}
                rel="noopener noreferrer"
                title={s.label}
                aria-label={s.label}
              >
                <PixelIcon name={s.icon} size={15} />
              </a>
            ))}
            <span className="title__links-sep" aria-hidden="true" />
            {LINKS.map((link) => (
              <Link key={link.key} to={link.href} className="title__link">
                <PixelIcon name={link.icon} size={14} />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <footer className="title__foot">
          <p className="title__footline">
            <span className="title__prompt" aria-hidden="true" />
            <span className="title__hint">
              press
              <kbd className="title__key">enter</kbd>
              to start
            </span>
            <span className="title__dot" aria-hidden="true" />
            <span className="title__copy">
              &copy; {new Date().getFullYear()} Muchammad Alief Kurnia Wijaya
            </span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default TitleScreen;
