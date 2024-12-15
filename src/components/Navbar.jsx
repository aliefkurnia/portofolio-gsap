import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { github, cvIcon } from "./Assets";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-logo">&lt;/&gt;</span>
      </div>
      <div className="navbar-right">
        <Link to="/PreviewCV" className="cv-link">
          <img src={cvIcon} alt="Download CV" className="cv-icon" />
        </Link>
        <a
          href="https://github.com/aliefkurnia"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
        >
          <img src={github} alt="GitHub Logo" className="github-logo" />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
