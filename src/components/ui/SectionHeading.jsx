import React from 'react';
import './SectionHeading.css';

const SectionHeading = ({ label, title, align = 'left', light = false }) => {
  return (
    <div className={`section-heading section-heading--${align} ${light ? 'section-heading--light' : ''}`}>
      {label && <span className="section-heading__label">{label}</span>}
      <h2 className="section-heading__title">{title}</h2>
    </div>
  );
};

export default SectionHeading;
