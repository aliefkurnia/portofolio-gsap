import React from 'react';
import './SectionHeading.css';

// label: mono eyebrow already including its `//` prefix (e.g. "// about")
// title: H2 heading. meta: optional right-aligned mono meta (e.g. "05 repositories")
const SectionHeading = ({ label, title, meta }) => {
  return (
    <div className="sec-head" data-reveal>
      <div className="sec-head__lead">
        {label && <span className="eyebrow sec-head__eyebrow">{label}</span>}
        <h2 className="sec-head__title">{title}</h2>
      </div>
      {meta && <span className="sec-head__meta">{meta}</span>}
    </div>
  );
};

export default SectionHeading;
