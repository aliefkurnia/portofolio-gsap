import React from 'react';
import './SectionHeading.css';

// label: eyebrow text (any legacy "// " prefix is stripped automatically)
// title: H2 heading. meta: optional right-aligned meta (e.g. "05 repositories")
const SectionHeading = ({ label, title, meta }) => {
  const cleanLabel = label ? label.replace(/^\/\/\s*/, '') : label;
  return (
    <div className="sec-head" data-reveal>
      <div className="sec-head__lead">
        {cleanLabel && <span className="eyebrow sec-head__eyebrow">{cleanLabel}</span>}
        <h2 className="sec-head__title">{title}</h2>
      </div>
      {meta && <span className="sec-head__meta">{meta}</span>}
    </div>
  );
};

export default SectionHeading;
