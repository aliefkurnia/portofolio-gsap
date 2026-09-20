import React from 'react';
import './Skeleton.css';

/**
 * Loading placeholders.
 *
 * Each one mirrors the real markup of the section it stands in for — same
 * grid, same row structure, same class names — so the swap to real content
 * doesn't reflow the stage. Keep these in step when a section's markup
 * changes.
 */

export const Skeleton = ({ width, height, radius, className = '' }) => (
  <div
    className={`skeleton ${className}`}
    style={{
      width: width || '100%',
      height: height || '1rem',
      borderRadius: radius || 'var(--radius-md)',
    }}
  />
);

/** Square stand-in — pixel art has no circles. */
export const SkeletonSquare = ({ size = 44 }) => (
  <div
    className="skeleton"
    style={{
      width: size,
      height: size,
      borderRadius: 'var(--radius-md)',
      flexShrink: 0,
    }}
  />
);

export const AboutImageSkeleton = () => (
  <Skeleton width="100%" height="100%" radius="var(--radius-md)" />
);

export const TechStackSkeleton = () => (
  <div className="techstack__grid">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="techstack__tile">
        <Skeleton width="54px" height="54px" radius="var(--radius-md)" />
        <Skeleton width="60%" height="0.75rem" />
      </div>
    ))}
  </div>
);

export const ProjectsSkeleton = () => (
  <div className="projects__grid">
    {[1, 2].map((i) => (
      <div key={i} className="project-card">
        <div className="project-card__media">
          <Skeleton width="100%" height="100%" radius="0" />
        </div>
        <div className="project-card__body">
          <Skeleton width="65%" height="1.15rem" />
          <Skeleton width="100%" height="0.85rem" className="skeleton--mt-sm" />
          <Skeleton width="85%" height="0.85rem" className="skeleton--mt-sm" />
        </div>
      </div>
    ))}
  </div>
);

export const ExperienceSkeleton = () => (
  <div className="experience__list">
    {[1, 2, 3].map((i) => (
      <div key={i} className="experience__row">
        <div className="experience__meta">
          <Skeleton width="92px" height="0.85rem" />
          <Skeleton width="66px" height="66px" radius="var(--radius-md)" />
        </div>
        <div className="experience__detail">
          <Skeleton width="55%" height="1.2rem" />
          <Skeleton width="35%" height="0.85rem" className="skeleton--mt-sm" />
          <div className="skeleton--mt-md">
            <Skeleton width="95%" height="0.8rem" />
            <Skeleton width="88%" height="0.8rem" className="skeleton--mt-sm" />
            <Skeleton width="70%" height="0.8rem" className="skeleton--mt-sm" />
          </div>
        </div>
      </div>
    ))}
  </div>
);
