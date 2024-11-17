import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-logo">Logo Saya</span>
      </div>
      <div className="navbar-right">
        <span className="navbar-madeby">Made by Alief</span>
      </div>
    </nav>
  );
};

export default Navbar;
