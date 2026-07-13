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
