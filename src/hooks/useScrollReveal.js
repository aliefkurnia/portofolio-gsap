import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const {
      type = 'fadeUp',
      delay = 0,
      duration = 0.8,
      stagger = 0.1,
      start = 'top 85%',
      children = false,
    } = options;

    const targets = children ? el.children : el;
    let fromVars = {};
    let toVars = { duration, ease: 'power3.out', delay };

    switch (type) {
      case 'fadeUp':
        fromVars = { opacity: 0, y: 60 };
        toVars = { ...toVars, opacity: 1, y: 0 };
        break;
      case 'fadeIn':
        fromVars = { opacity: 0 };
        toVars = { ...toVars, opacity: 1 };
        break;
      case 'scaleIn':
        fromVars = { opacity: 0, scale: 0.9 };
        toVars = { ...toVars, opacity: 1, scale: 1 };
        break;
      case 'slideLeft':
        fromVars = { opacity: 0, x: 80 };
        toVars = { ...toVars, opacity: 1, x: 0 };
        break;
      case 'slideRight':
        fromVars = { opacity: 0, x: -80 };
        toVars = { ...toVars, opacity: 1, x: 0 };
        break;
      default:
        fromVars = { opacity: 0, y: 60 };
        toVars = { ...toVars, opacity: 1, y: 0 };
    }

    if (children && stagger) {
      toVars.stagger = stagger;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(targets, fromVars, {
        ...toVars,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: 'play none none none',
        },
      });
    }, el);

    return () => ctx.revert();
  }, [options]);

  return ref;
}

/**
 * Declarative reveals for the terminal redesign. Scans a section root for:
 *   [data-reveal]  → opacity:0,y:44 → 0            (trigger top 86%)
 *   [data-stagger] → children opacity:0,y:30,scale:0.96 (stagger 0.06, top 85%)
 *   [data-bullets] → children opacity:0,x:-12       (stagger 0.08, top 90%)
 * GSAP owns the hidden state (never set opacity:0 in CSS). Reduced motion =
 * everything stays visible.
 */
export function useReveals(ref, deps = []) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      el.querySelectorAll('[data-reveal]').forEach((node) => {
        gsap.from(node, {
          opacity: 0,
          y: 44,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: node, start: 'top 86%' },
        });
      });

      el.querySelectorAll('[data-stagger]').forEach((group) => {
        gsap.from(group.children, {
          opacity: 0,
          y: 30,
          scale: 0.96,
          duration: 0.6,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: { trigger: group, start: 'top 85%' },
        });
      });

      el.querySelectorAll('[data-bullets]').forEach((group) => {
        gsap.from(group.children, {
          opacity: 0,
          x: -12,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: group, start: 'top 90%' },
        });
      });
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
