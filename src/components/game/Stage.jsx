import React, { useCallback, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import PixelIcon, { PixelArrow } from '../ui/PixelIcon';
import './Stage.css';

const prefersReduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * One stage = one screen = one slide of the deck.
 *
 * The frame is a fixed-height panel with a title bar and a content region.
 * If the content is taller than the panel, the *content region* scrolls —
 * the page itself never moves. That is the whole trick behind the game feel.
 *
 * Slides advance sideways rather than vertically. The transition is two
 * phases, and this component owns both of them: it plays its own frame *out*
 * and only then tells `Game` to swap the stage, so the outgoing section is
 * already gone by the time the incoming one mounts. The incoming frame is
 * told which way the deck moved (`enterFrom`) and slides in from that side.
 *
 * That sequencing is also why the sections' reveal animations still read
 * correctly: `useReveals` plays on mount, and `Game` keys each `<Stage>` by
 * stage, so every slide gets a fresh entrance instead of having quietly
 * animated itself off-screen before you arrived.
 */
const Stage = ({
  title,
  meta,
  index,
  total,
  enterFrom,
  prevKey,
  nextKey,
  onBack,
  onNavigate,
  children,
}) => {
  const frameRef = useRef(null);
  const busyRef = useRef(false);

  useEffect(() => {
    if (prefersReduced()) return undefined;
    const ctx = gsap.context(() => {
      // Arriving sideways is a short hop in the direction of travel; arriving
      // from the map (or a deep link) has no direction, so it keeps the
      // original drop-in.
      const entrance =
        enterFrom === 'next' ? { x: 56 }
        : enterFrom === 'prev' ? { x: -56 }
        : { y: 26, scale: 0.97 };

      gsap.from(frameRef.current, {
        opacity: 0,
        ...entrance,
        duration: enterFrom ? 0.24 : 0.42,
        ease: 'power3.out',
      });
    }, frameRef);
    return () => ctx.revert();
    // Mount-only: `Game` keys this component by stage, so a new slide is a new
    // mount and `enterFrom` can never go stale underneath us.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Every stage starts at the top of its own scroller, never mid-way.
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, []);

  /**
   * Slide out, then run `run` — which is what actually changes the URL.
   *
   * Two things here are load-bearing. The lock, because `ArrowRight` held down
   * repeats far faster than 160ms and the later presses would otherwise fire
   * mid-tween and leave the frame departing twice. That lock only covers this
   * frame's lifetime though — it dies with the component at the swap — so the
   * burst it cannot see is caught by `Game`'s rate limiter, which survives the
   * swap. Between them, one burst moves one slide.
   *
   * The second is the timer fallback: the swap must not *depend* on an
   * animation completing. A starved frame loop (backgrounded tab, interrupted
   * rAF) would leave the deck permanently dead, with no way off it but a
   * reload. Whichever of the tween and the timer arrives first wins.
   */
  const exit = useCallback((direction, run) => {
    const frame = frameRef.current;
    if (!frame || prefersReduced()) {
      run();
      return;
    }
    if (busyRef.current) return;
    busyRef.current = true;

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      run();
    };

    // Kill rather than `overwrite: true`: an overwritten tween never fires its
    // own callbacks, so overwriting would be exactly the deadlock above. This
    // way the exit is the only tween on the frame and nothing can cancel it.
    // The mount tween may be mid-flight if the visitor is quick, so clear what
    // it left behind and leave from a clean transform.
    gsap.killTweensOf(frame);
    gsap.set(frame, { clearProps: 'y,scale' });

    gsap.to(frame, {
      x: direction === 'prev' ? 56 : -56,
      opacity: 0,
      duration: 0.16,
      ease: 'power2.in',
      onComplete: finish,
    });

    window.setTimeout(finish, 400);
  }, []);

  // Escape returns to the map, arrows walk the deck — but never while the
  // visitor is typing in the contact form.
  useEffect(() => {
    const onKeyDown = (e) => {
      const el = e.target;
      const typing =
        el instanceof HTMLElement &&
        (el.tagName === 'INPUT' ||
          el.tagName === 'TEXTAREA' ||
          el.tagName === 'SELECT' ||
          el.isContentEditable);
      if (typing) return;

      if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        exit('back', onBack);
        return;
      }

      if (e.key === 'ArrowRight' && nextKey) {
        e.preventDefault();
        exit('next', () => onNavigate(nextKey, 'next'));
      } else if (e.key === 'ArrowLeft' && prevKey) {
        e.preventDefault();
        exit('prev', () => onNavigate(prevKey, 'prev'));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [exit, onBack, onNavigate, prevKey, nextKey]);

  return (
    <div className="stage">
      <div className="stage__frame px-panel" ref={frameRef}>
        <div className="stage__bar">
          {/* "map", not "back": once there is a `prev` slide, back is
              ambiguous — this button returns to the level select. */}
          <button type="button" className="stage__back" onClick={onBack}>
            <PixelIcon name="arrowLeft" size={16} />
            map
          </button>

          <div className="stage__heading">
            <PixelArrow direction="right" size={16} className="stage__arrow" />
            <h2 className="stage__title px-title">{title}</h2>
            <PixelArrow direction="left" size={16} className="stage__arrow" />
          </div>

          <div className="stage__tail">
            {meta && <span className="stage__meta">{meta}</span>}
            <span className="stage__esc" aria-hidden="true">
              esc
            </span>
          </div>

          <div className="stage__nav">
            <button
              type="button"
              className="stage__step"
              onClick={() => exit('prev', () => onNavigate(prevKey, 'prev'))}
              disabled={!prevKey}
              aria-label="Previous stage"
            >
              <PixelArrow direction="left" size={16} />
            </button>
            <button
              type="button"
              className="stage__step"
              onClick={() => exit('next', () => onNavigate(nextKey, 'next'))}
              disabled={!nextKey}
              aria-label="Next stage"
            >
              <PixelArrow direction="right" size={16} />
            </button>
          </div>
        </div>

        {/* Deck position, drawn as the rule under the bar so it costs no
            height. Decorative — the HUD already announces `stage NN/TT`. */}
        <div className="stage__steps" aria-hidden="true">
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              className={`stage__tick${i === index - 1 ? ' stage__tick--on' : ''}`}
            />
          ))}
        </div>

        <div className="stage__scroll" ref={scrollRef} tabIndex={-1}>
          <div className="stage__content">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Stage;
