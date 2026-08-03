import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const NAME = [
  { t: 'Muchammad' },
  { t: 'Alief' },
  { t: 'Kurnia', accent: true },
  { t: 'Wijaya', accent: true },
];

const Hero = () => {
  const rootRef = useRef(null);
  const btnPrimaryRef = useRef(null);
  const btnSecondaryRef = useRef(null);

  const { settings, technologies } = usePortfolioData();
  const role = settings.job_title || '.NET Software Developer';

  const stats = [
    { value: `${parseInt(settings.years_experience, 10) || 3}+`, label: 'Years' },
    { value: `${technologies.length || 15}`, label: 'Technologies' },
  ];

  const prefersReduced = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── Load timeline ───
  useEffect(() => {
    if (prefersReduced()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3, defaults: { ease: 'power3.out' } });

      tl.from('.hero__pill', { opacity: 0, y: 16, duration: 0.5 })
        .from(
          '.hero__word',
          { yPercent: 120, stagger: 0.06, duration: 0.7, ease: 'power4.out' },
          '-=0.2'
        )
        .from('.hero__rise', { opacity: 0, y: 20, stagger: 0.1, duration: 0.6 }, '-=0.4');
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // ─── Magnetic buttons ───
  useEffect(() => {
    if (prefersReduced()) return;
    const cleanups = [];
    [btnPrimaryRef.current, btnSecondaryRef.current].forEach((btn) => {
      if (!btn) return;
      const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' });
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' });
      const move = (e) => {
        const r = btn.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.4);
      };
      const leave = () => {
        xTo(0);
        yTo(0);
      };
      btn.addEventListener('mousemove', move);
      btn.addEventListener('mouseleave', leave);
      cleanups.push(() => {
        btn.removeEventListener('mousemove', move);
        btn.removeEventListener('mouseleave', leave);
      });
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <section className="hero" id="hero" ref={rootRef}>
      <div className="hero__mesh" aria-hidden="true">
        <span className="hero__blob hero__blob--1" />
        <span className="hero__blob hero__blob--2" />
        <span className="hero__blob hero__blob--3" />
        <span className="hero__blob hero__blob--4" />
      </div>
      <div className="hero__grid-lines" aria-hidden="true" />

      <div className="container hero__inner">
        <span className="hero__pill">
          <span className="hero__pill-dot" />
          Available for work
        </span>

        <h1 className="hero__name">
          {NAME.map((w, i) => (
            <span className="hero__mask" key={i}>
              <span className={`hero__word ${w.accent ? 'hero__word--accent' : ''}`}>
                {w.t}
              </span>
            </span>
          ))}
        </h1>

        <p className="hero__role hero__rise">{role}</p>

        <p className="hero__tagline hero__rise">
          Building production-grade platforms in C#, .NET Core &amp; Blazor —
          with ETL tracing and CI/CD on Azure.
        </p>

        <div className="hero__actions hero__rise">
          <button
            className="hero__btn hero__btn--solid"
            ref={btnPrimaryRef}
            onClick={() => scrollTo('projects')}
          >
            View projects
          </button>
          <button
            className="hero__btn hero__btn--ghost"
            ref={btnSecondaryRef}
            onClick={() => scrollTo('contact')}
          >
            Get in touch
          </button>
        </div>

        <div className="hero__stats hero__rise">
          {stats.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <span className="hero__stat-sep" aria-hidden="true" />}
              <div className="hero__stat">
                <span className="hero__stat-num">{s.value}</span>
                <span className="hero__stat-label">{s.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
