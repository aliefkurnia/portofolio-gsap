import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { heroStats } from '../../data/constants';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const HEADLINE = [
  { t: 'I' },
  { t: 'ship' },
  { t: 'reliable', accent: true },
  { t: 'systems.' },
];

const Hero = () => {
  const rootRef = useRef(null);
  const windowRef = useRef(null);
  const statsRef = useRef(null);
  const btnPrimaryRef = useRef(null);
  const btnSecondaryRef = useRef(null);

  const { settings, experiences, technologies } = usePortfolioData();
  const role = settings.job_title || '.NET Software Developer';

  // Live count-up targets (fall back to prototype numbers before data loads)
  const statValues = {
    years_experience: parseInt(settings.years_experience, 10) || 3,
    companies: experiences.length || 5,
    technologies: technologies.length || 15,
  };

  const prefersReduced = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── Load timeline ───
  useEffect(() => {
    if (prefersReduced()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.35, defaults: { ease: 'power3.out' } });

      tl.from(windowRef.current, { opacity: 0, y: 28, duration: 0.7 })
        .from(
          '.hero__code-line',
          { opacity: 0, x: -14, stagger: 0.06, duration: 0.4 },
          '-=0.3'
        )
        .from(
          '.hero__word',
          { yPercent: 118, stagger: 0.06, duration: 0.7, ease: 'power4.out' },
          '-=0.1'
        )
        .from(
          '.hero__rise',
          { opacity: 0, y: 24, stagger: 0.12, duration: 0.6 },
          '-=0.35'
        );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // ─── Count-up stats ───
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const nums = el.querySelectorAll('.hero__stat-value');

    if (prefersReduced()) {
      nums.forEach((n) => {
        n.textContent =
          statValues[n.dataset.key] + (n.dataset.suffix || '');
      });
      return;
    }

    const ctx = gsap.context(() => {
      nums.forEach((n) => {
        const target = statValues[n.dataset.key];
        const suffix = n.dataset.suffix || '';
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.4,
          ease: 'power2.out',
          snap: { v: 1 },
          scrollTrigger: { trigger: el, start: 'top 90%' },
          onUpdate: () => {
            n.textContent = Math.round(obj.v) + suffix;
          },
        });
      });
    }, el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experiences.length, technologies.length, settings.years_experience]);

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
        const relX = e.clientX - (r.left + r.width / 2);
        const relY = e.clientY - (r.top + r.height / 2);
        xTo(relX * 0.3);
        yTo(relY * 0.4);
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
      <div className="container hero__inner">
        {/* ─── Terminal window ─── */}
        <div className="hero__window" ref={windowRef}>
          <div className="hero__titlebar">
            <span className="hero__dot hero__dot--red" />
            <span className="hero__dot hero__dot--yellow" />
            <span className="hero__dot hero__dot--green" />
            <span className="hero__titlebar-caption">
              ~/alief-kurnia — developer.ts
            </span>
          </div>
          <div className="hero__code">
            <div className="hero__gutter" aria-hidden="true">
              {Array.from({ length: 7 }, (_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>
            <pre className="hero__code-body">
              <div className="hero__code-line">
                <span className="tok-comment">// portfolio</span>
              </div>
              <div className="hero__code-line">
                <span className="tok-keyword">const</span>{' '}
                <span className="tok-func">developer</span> = {'{'}
              </div>
              <div className="hero__code-line">
                {'  '}<span className="tok-key">name</span>:{' '}
                <span className="tok-string">"Muchammad Alief Kurnia Wijaya"</span>,
              </div>
              <div className="hero__code-line">
                {'  '}<span className="tok-key">role</span>:{' '}
                <span className="tok-string">"{role}"</span>,
              </div>
              <div className="hero__code-line">
                {'  '}<span className="tok-key">based</span>:{' '}
                <span className="tok-string">"Indonesia"</span>,
              </div>
              <div className="hero__code-line">
                {'  '}<span className="tok-key">focus</span>: [
                <span className="tok-string">"enterprise"</span>,{' '}
                <span className="tok-string">"scalable"</span>,{' '}
                <span className="tok-string">"clean"</span>]
              </div>
              <div className="hero__code-line">
                {'}'}<span className="hero__cursor">▮</span>
              </div>
            </pre>
          </div>
        </div>

        {/* ─── Headline ─── */}
        <h1 className="hero__headline">
          {HEADLINE.map((w, i) => (
            <span className="hero__mask" key={i}>
              <span className={`hero__word ${w.accent ? 'hero__word--accent' : ''}`}>
                {w.t}
              </span>
            </span>
          ))}
        </h1>

        <p className="hero__subtitle hero__rise">
          Production support, ETL tracing, and CI/CD on Azure DevSecOps — plus
          full property-management platforms built in C#, .NET Core, and Blazor.
        </p>

        <div className="hero__actions hero__rise">
          <button
            className="hero__btn hero__btn--solid"
            ref={btnPrimaryRef}
            onClick={() => scrollTo('projects')}
          >
            $ view projects
          </button>
          <button
            className="hero__btn hero__btn--outline"
            ref={btnSecondaryRef}
            onClick={() => scrollTo('contact')}
          >
            $ contact --me
          </button>
        </div>

        {/* ─── Stats bar ─── */}
        <div className="hero__stats hero__rise" ref={statsRef}>
          {heroStats.map((s) => (
            <div className="hero__stat" key={s.key}>
              <span
                className={`hero__stat-value ${
                  s.key === 'technologies' ? 'hero__stat-value--accent' : ''
                }`}
                data-key={s.key}
                data-suffix={s.suffix}
              >
                0{s.suffix}
              </span>
              <span className="hero__stat-label">{s.key}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
