import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { useReveals } from '../../hooks/useReveals';
import './Contact.css';

/** The Contact stage. The stage frame supplies the title bar. */
const Contact = () => {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  useReveals(sectionRef, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    emailjs
      .send(
        serviceId,
        templateId,
        {
          from_name: form.name,
          to_name: 'Alief Kurnia',
          from_email: form.email,
          to_email: 'aliefkw26@gmail.com',
          message: form.message,
        },
        publicKey
      )
      .then(
        () => {
          setLoading(false);
          setStatus('success');
          setForm({ name: '', email: '', message: '' });
        },
        () => {
          setLoading(false);
          setStatus('error');
        }
      );
  };

  return (
    <div className="contact" ref={sectionRef}>
      <div className="contact__intro">
        <h3 className="contact__title" data-reveal>Let's build something reliable.</h3>
        <p className="contact__subtitle" data-reveal>
          Have a project, a role, or a question? Drop a message and I'll get back to you.
        </p>
      </div>

      <div className="contact__card" data-reveal>
        {status === 'success' ? (
          <div className="contact__done">
            <div className="contact__done-check">✓</div>
            <h3 className="contact__done-title">Message sent</h3>
            <p className="contact__done-note">Thanks — I'll reply to you soon.</p>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="contact__form">
            <div className="contact__field">
              <label htmlFor="name" className="contact__label">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                className="contact__input"
              />
            </div>

            <div className="contact__field">
              <label htmlFor="email" className="contact__label">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="contact__input"
              />
            </div>

            <div className="contact__field">
              <label htmlFor="message" className="contact__label">Message</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="What can I help you with?"
                rows="5"
                required
                className="contact__input contact__textarea"
              />
            </div>

            <button type="submit" className="contact__submit px-btn" disabled={loading}>
              {loading ? 'Sending…' : 'Send message'}
            </button>

            {status === 'error' && (
              <p className="contact__error">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;
