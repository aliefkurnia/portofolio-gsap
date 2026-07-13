import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const nameRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  const { settings } = usePortfolioData();
  const jobTitle = settings.job_title || 'Software Developer';

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });

      tl.fromTo(
        nameRef.current.querySelectorAll('.hero__char'),
        { opacity: 0, y: 80, rotateX: -90 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.03,
          ease: 'power3.out',
        }
      )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.3'
        )
        .fromTo(
          scrollIndicatorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          '-=0.2'
        );

      gsap.to(contentRef.current, {
        scale: 1.05,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const renderChars = (text) =>
    text.split('').map((char, i) => (
      <span key={i} className="hero__char" style={{ perspective: '400px' }}>
        {char}
      </span>
    ));

  return (
    <section className="hero" id="hero" ref={heroRef}>
      <div className="hero__ambient">
        <div className="hero__orb hero__orb--1"></div>
        <div className="hero__orb hero__orb--2"></div>
        <div className="hero__orb hero__orb--3"></div>
      </div>

      <div className="hero__content" ref={contentRef}>
        <div className="hero__text">
          <p className="hero__greeting">Muchammad</p>
          <h1 className="hero__name" ref={nameRef}>
            <span className="hero__name-line">{renderChars('ALIEF KURNIA')}</span>
            <span className="hero__name-line">{renderChars('WIJAYA')}</span>
          </h1>
          <p className="hero__subtitle" ref={subtitleRef}>
            <span className="hero__subtitle-line"></span>
            <span className="text-gradient">{jobTitle}</span>
          </p>
        </div>
      </div>

      <div className="hero__scroll-indicator" ref={scrollIndicatorRef}>
        <span className="hero__scroll-text">Scroll</span>
        <div className="hero__scroll-line">
          <div className="hero__scroll-dot"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
