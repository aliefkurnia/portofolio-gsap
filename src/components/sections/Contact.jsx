import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { useReveals } from '../../hooks/useScrollReveal';
import './Contact.css';

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
    <section className="contact section" id="contact" ref={sectionRef}>
      <div className="container container--narrow">
        <span className="eyebrow" data-reveal>// get in touch</span>
        <h2 className="contact__title" data-reveal>Let's build something reliable.</h2>
        <p className="contact__subtitle" data-reveal>
          Have a project, a role, or a question? Drop a message and I'll get back to you.
        </p>

        <div className="contact__window" data-reveal>
          <div className="contact__titlebar">
            <span className="contact__dot contact__dot--red" />
            <span className="contact__dot contact__dot--yellow" />
            <span className="contact__dot contact__dot--green" />
            <span className="contact__caption">new-message.sh</span>
          </div>

          {status === 'success' ? (
            <div className="contact__done">
              <p className="contact__done-line">
                <span className="contact__prompt">$</span> ./new-message.sh
              </p>
              <p className="contact__done-ok">✓ message sent</p>
              <p className="contact__done-note">
                Thanks — I'll reply to you soon.
              </p>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="contact__form">
              <div className="contact__field">
                <label htmlFor="name" className="contact__label">name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="your name"
                  required
                  className="contact__input"
                />
              </div>

              <div className="contact__field">
                <label htmlFor="email" className="contact__label">email</label>
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
                <label htmlFor="message" className="contact__label">message</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="what can I help you with?"
                  rows="5"
                  required
                  className="contact__input contact__textarea"
                />
              </div>

              <button type="submit" className="contact__submit" disabled={loading}>
                {loading ? '$ sending…' : '$ send message'}
              </button>

              {status === 'error' && (
                <p className="contact__error">
                  ✕ something went wrong. Please try again.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
