import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="contact-container">
      <h2 className="contact-title">Contact Me</h2>
      <p>Have questions or want to work together? Feel free to reach out!</p>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="text" placeholder="Your Name" required />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Your Email" required />
        </div>
        <div className="form-group">
          <textarea placeholder="Your Message" rows="5" required></textarea>
        </div>
        <button className="submit-button" type="submit">
          Send Message
        </button>
      </form>
      {formSubmitted && (
        <p className="success-message">
          Thank you! Your message has been sent.
        </p>
      )}
    </div>
  );
};

export default Contact;
