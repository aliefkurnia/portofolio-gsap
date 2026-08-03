import React from "react";
import { navLinks, socialLinks } from "../../data/constants";
import "./Footer.css";

const Footer = () => {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer__glow" aria-hidden="true" />
      <div className="container">
        <div className="footer__card glass">
          <div className="footer__body">
            <div className="footer__brand">
              <button className="footer__logo" onClick={scrollTop}>
                alief<span className="footer__logo-dot">.</span>dev
              </button>
              <p className="footer__tagline">
                .NET software developer building reliable, scalable systems.
                Open to new opportunities.
              </p>
              <div className="footer__socials">
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__social"
                >
                  GitHub ↗
                </a>
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__social"
                >
                  LinkedIn ↗
                </a>
                <a href={`mailto:${socialLinks.email}`} className="footer__social">
                  Email ↗
                </a>
              </div>
            </div>

            <nav className="footer__nav">
              <span className="footer__nav-title">Navigate</span>
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  className="footer__nav-link"
                  onClick={() => scrollTo(link.id)}
                >
                  {link.label}
                </button>
              ))}
              <a href="/play" className="footer__nav-link">Play</a>
            </nav>
          </div>

          <div className="footer__bar">
            <p className="footer__copy">
              © {new Date().getFullYear()} Muchammad Alief Kurnia Wijaya
            </p>
            <button className="footer__top" onClick={scrollTop}>
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
