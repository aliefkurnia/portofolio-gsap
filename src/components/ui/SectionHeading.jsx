import React from 'react';
import { PixelArrow } from './PixelIcon';
import './SectionHeading.css';

/**
 * Section header in the reference's signature shape:
 *
 *        [ EYEBROW ]
 *   ->>   BIG TITLE   <<-
 *            meta
 *
 * `label` accepts a legacy "// " prefix and strips it.
 */
const SectionHeading = ({ label, title, meta }) => {
  const cleanLabel = label ? label.replace(/^\/\/\s*/, '') : label;

  return (
    <div className="sec-head" data-reveal>
      {cleanLabel && <span className="eyebrow sec-head__eyebrow">{cleanLabel}</span>}

      <div className="sec-head__row">
        <PixelArrow direction="right" size={32} className="sec-head__arrow" />
        <h2 className="sec-head__title px-title">{title}</h2>
        <PixelArrow direction="left" size={32} className="sec-head__arrow" />
      </div>

      {meta && <span className="sec-head__meta">{meta}</span>}
    </div>
  );
};

export default SectionHeading;
