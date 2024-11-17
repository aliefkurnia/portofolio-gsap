import React from "react";
import "./Footer.css"; // Pastikan untuk membuat file CSS untuk styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© 2024 Your Company Name. All Rights Reserved.</p>
        <p>
          Follow us on:{" "}
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>{" "}
          |{" "}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
