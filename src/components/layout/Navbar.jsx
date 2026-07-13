import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { navLinks } from "../../data/constants";
import "./Navbar.css";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const panelRef = useRef(null);
  const backdropRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!navRef.current) return;
    gsap.fromTo(
      navRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 2.4, ease: "power3.out" },
    );
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";

      if (panelRef.current) {
        gsap.fromTo(
          panelRef.current,
          { x: "100%" },
          { x: "0%", duration: 0.4, ease: "power3.out" },
        );
        gsap.fromTo(
          panelRef.current.querySelectorAll(".navbar__panel-item"),
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            stagger: 0.06,
            delay: 0.2,
            ease: "power3.out",
          },
        );
      }

      if (backdropRef.current) {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3 },
        );
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => {
    if (panelRef.current && backdropRef.current) {
      gsap.to(panelRef.current, {
        x: "100%",
        duration: 0.3,
        ease: "power2.in",
      });
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => setMenuOpen(false),
      });
    } else {
      setMenuOpen(false);
    }
  };

  const scrollTo = (id) => {
    closeMenu();
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 350);
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}
      >
        <div className="navbar__inner">
          <a
            href="#hero"
            className="navbar__logo"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          ></a>

          <div className="navbar__links">
            {navLinks.map((link) => (
              <button
                key={link.id}
                className="navbar__link"
                onClick={() => scrollTo(link.id)}
              >
                {link.label}
              </button>
            ))}
            <a href="/PreviewCV" className="navbar__cta">
              Resume
            </a>
          </div>

          <button
            className={`navbar__hamburger ${menuOpen ? "navbar__hamburger--open" : ""}`}
            onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="navbar__overlay">
          <div
            className="navbar__backdrop"
            ref={backdropRef}
            onClick={closeMenu}
          />
          <aside className="navbar__panel" ref={panelRef}>
            <div className="navbar__panel-header">
              <span className="navbar__panel-title">Menu</span>
              <button
                className="navbar__panel-close"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <span></span>
                <span></span>
              </button>
            </div>
            <nav className="navbar__panel-nav">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  className="navbar__panel-item"
                  onClick={() => scrollTo(link.id)}
                >
                  {link.label}
                </button>
              ))}
            </nav>
            <div className="navbar__panel-footer">
              <a href="/PreviewCV" className="navbar__panel-cta">
                Resume
              </a>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Navbar;
