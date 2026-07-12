import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { ReactComponent as CvIcon } from "./Assets/cvIcon.svg";
import { ReactComponent as GithubIcon } from "./Assets/github.svg";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          &lt;/&gt;
        </Link>
      </div>

      <div className={`navbar-right ${menuOpen ? "open" : "close"}`}>
        <div className={`sidebar ${menuOpen ? "open" : "close"}`}>
          <Link to="/PreviewCV" className="cv-link">
            <div className="cv-text">
              <label>My CV &gt;</label>
            </div>
            <CvIcon className="cv-icon" width="40" height="40" />
          </Link>

          <a
            href="https://github.com/aliefkurnia"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            <GithubIcon className="github-logo" width="40" height="40" />
          </a>
        </div>
        <div className="hamburger" onClick={toggleMenu}>
          <div className={`line ${menuOpen ? "open" : ""}`}></div>
          <div className={`line ${menuOpen ? "open" : ""}`}></div>
          <div className={`line ${menuOpen ? "open" : ""}`}></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
