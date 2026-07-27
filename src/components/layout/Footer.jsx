import React from "react";
import { socialLinks } from "../../data/constants";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <p className="footer__copy">
          © {new Date().getFullYear()} Muchammad Alief Kurnia Wijaya
        </p>
        <nav className="footer__links">
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            github ↗
          </a>
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            linkedin ↗
          </a>
          <a href={`mailto:${socialLinks.email}`} className="footer__link">
            email ↗
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
