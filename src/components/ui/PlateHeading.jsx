import React from 'react';
import PixelIcon from './PixelIcon';
import './PlateHeading.css';

/**
 * `[plate] [ PLAQUE ] ──────` — the section marker from the reference.
 *
 * The icon sits on a filled plate, the label on an outlined plaque, and a
 * rule runs out to the edge. Used by the home profile card and the CV
 * document, so the two read as the same document.
 */
const PlateHeading = ({ icon, children, as: Tag = 'h3', className = '' }) => (
  <Tag className={`plate-head${className ? ` ${className}` : ''}`}>
    <span className="plate-head__plate">
      <PixelIcon name={icon} size={17} />
    </span>
    <span className="plate-head__title">{children}</span>
    <span className="plate-head__rule" aria-hidden="true" />
  </Tag>
);

export default PlateHeading;
