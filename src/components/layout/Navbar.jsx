import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { navLinks } from "../../data/constants";
import "./Navbar.css";

const RESUME_URL = "/PreviewCV";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  // Nav drops in on load (Hero timeline handles the rest of the page)
  useEffect(() => {
    if (!navRef.current) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;
    // gsap.context + explicit fromTo keeps this StrictMode-safe (double-invoked
    // effects in dev would otherwise leave the bar stuck offscreen at y:-68).
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: -68 },
        { y: 0, duration: 0.7, delay: 0.1, ease: "power3.out" }
      );
    }, navRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Smooth-scroll with a fixed 60px offset (never scrollIntoView)
  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const scrollTop = () => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <nav className="nav" ref={navRef}>
        <div className="nav__inner">
          <button className="nav__logo" onClick={scrollTop}>
            alief<span className="nav__logo-dot">.</span>dev
          </button>

          <div className="nav__links">
            {navLinks.map((link) => (
              <button
                key={link.id}
                className="nav__link"
                onClick={() => scrollTo(link.id)}
              >
                {link.label.toLowerCase()}
              </button>
            ))}
            <a href={RESUME_URL} className="nav__resume">
              resume <span className="nav__arrow">↗</span>
            </a>
          </div>

          <button
            className="nav__burger"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            ≡
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="nav-overlay">
          <button
            className="nav-overlay__close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
          <nav className="nav-overlay__links">
            {navLinks.map((link) => (
              <button
                key={link.id}
                className="nav-overlay__link"
                onClick={() => scrollTo(link.id)}
              >
                {link.label.toLowerCase()}
              </button>
            ))}
          </nav>
          <a href={RESUME_URL} className="nav-overlay__resume">
            resume ↗
          </a>
        </div>
      )}
    </>
  );
};

export default Navbar;
