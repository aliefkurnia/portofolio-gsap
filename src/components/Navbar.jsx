import React from "react";
import "./Navbar.css";
import { github } from "./Assets";
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-logo">&lt;/&gt;</span>
      </div>
      <div className="navbar-right">
        <a
          href="https://github.com/aliefkurnia"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={github} alt="GitHub Logo" className="github-logo" />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
