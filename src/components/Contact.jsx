import React, { useState, useRef } from "react";
import "./Contact.css";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
  const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

  console.log(serviceId, templateId, publicKey);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    emailjs
      .send(
        serviceId,
        templateId,
        {
          from_name: form.name,
          to_name: "Alief Kurnia",
          from_email: form.email,
          to_email: "aliefkw26@gmail.com",
          message: form.message,
        },
        publicKey
      )
      .then(
        () => {
          setLoading(false);
          setSuccessMessage(
            "Thank you! I will get back to you as soon as possible."
          );
          setForm({
            name: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          setLoading(false);
          setErrorMessage("Oops! Something went wrong. Please try again.");
          console.error("EmailJS error:", error);
        }
      );
  };

  return (
    <div className="contact-container">
      <h2 className="contact-title">Contact Me</h2>
      <p>Have questions or want to work together? Feel free to reach out!</p>
      <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="What's your name?"
            aria-label="Your name"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="What's your email?"
            aria-label="Your email"
            required
          />
        </div>
        <div className="form-group">
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="What you want to say?"
            rows="5"
            aria-label="Your message"
            required
          ></textarea>
        </div>
        <button className="submit-button" type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default Contact;
