import { useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * Entrance animation for a screen's contents.
 *
 * This used to be scroll-driven (ScrollTrigger, `start: 'top 86%'`), but the
 * site is now a fixed viewport that never scrolls the page — a window
 * ScrollTrigger would either fire instantly or never. Screens mount and
 * unmount instead, so the reveal simply plays on mount.
 *
 * Scans the ref'd root for:
 *   [data-reveal]  → opacity 0, y 28   (staggered across the screen)
 *   [data-stagger] → children pop in   (stagger 0.05, back.out)
 *   [data-bullets] → children slide in from the left
 *
 * GSAP owns the hidden state; never set opacity:0 in CSS. Reduced motion
 * leaves everything visible and simply skips the animation.
 *
 * Every tween here is `fromTo` with explicit end values, and that is
 * load-bearing rather than stylistic. A `from` tween takes the element's
 * *current* value as its destination, so a second pass — a re-render, a data
 * change, the skeleton swapping out for the real grid — captures whatever
 * partial transform the first pass left behind and animates *to that* instead
 * of to zero. The tween then reports success while parking the element
 * permanently off-position, and each further pass ratchets it further out.
 * Measured on the Tech Stack grid: tiles came to rest at 0%, 5% and 38% of
 * their travel and stayed there. Since the tiles' `scale` differs on the way
 * in, that ceiling was visible as the first card in the grid rendering larger
 * than its siblings. Explicit start *and* end values make each tween
 * idempotent — it can be interrupted and re-run any number of times and always
 * lands in the same place.
 *
 * None of the tweens animate `scale` on a grid child. A scaled child renders at
 * a different size while its grid row is still sized from the unscaled box, so
 * mid-flight cards are visibly mismatched, and any card that fails to finish
 * stays mismatched for good. `clearProps` hands the transform back to CSS once
 * the tween is done, which is what lets the cards' own `:hover` lift work — an
 * inline transform left behind by GSAP outranks any stylesheet rule, so a
 * completed reveal used to silently disable hover on every tile it touched.
 */
export function useReveals(ref, deps = []) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = gsap.context(() => {
      const reveals = el.querySelectorAll('[data-reveal]');
      if (reveals.length) {
        gsap.fromTo(
          reveals,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.07,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
          },
        );
      }

      el.querySelectorAll('[data-stagger]').forEach((group) => {
        gsap.fromTo(
          group.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.42,
            stagger: 0.05,
            ease: 'back.out(1.4)',
            clearProps: 'transform,opacity',
          },
        );
      });

      el.querySelectorAll('[data-bullets]').forEach((group) => {
        gsap.fromTo(
          group.children,
          { opacity: 0, x: -12 },
          {
            opacity: 1,
            x: 0,
            duration: 0.35,
            stagger: 0.06,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
          },
        );
      });
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default useReveals;
