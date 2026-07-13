import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import emailjs from '@emailjs/browser';
import SectionHeading from '../ui/SectionHeading';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact__heading',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      );

      gsap.fromTo(
        '.contact__card',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.contact__card', start: 'top 85%' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
    <section className="contact section section--dark" id="contact" ref={sectionRef}>
      <div className="container container--narrow">
        <div className="contact__heading">
          <SectionHeading
            label="Get in Touch"
            title="Let's work together"
            light
            align="center"
          />
        </div>

        <div className="contact__card">
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
              ></textarea>
            </div>

            <button type="submit" className="contact__submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>

            {status === 'success' && (
              <p className="contact__status contact__status--success">
                Message sent successfully. I'll get back to you soon.
              </p>
            )}
            {status === 'error' && (
              <p className="contact__status contact__status--error">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
