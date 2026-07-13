import React from 'react';
import './Skeleton.css';

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

export const SkeletonCircle = ({ size = 44 }) => (
  <div
    className="skeleton"
    style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0 }}
  />
);

export const ExperienceSkeleton = () => (
  <div className="experience__timeline">
    <div className="experience__line" style={{ transform: 'scaleY(1)', opacity: 0.3 }}></div>
    {[1, 2, 3].map((i) => (
      <div key={i} className="experience__item" style={{ opacity: 1 }}>
        <div className="experience__dot" style={{ opacity: 0.3 }}></div>
        <div className="experience__card">
          <div className="experience__card-header">
            <SkeletonCircle size={44} />
            <div style={{ flex: 1 }}>
              <Skeleton width="60%" height="1.1rem" />
              <Skeleton width="40%" height="0.85rem" className="skeleton--mt-sm" />
            </div>
          </div>
          <Skeleton width="100px" height="1.5rem" radius="var(--radius-full)" className="skeleton--mt-sm" />
          <div className="skeleton--mt-md">
            <Skeleton width="95%" height="0.85rem" />
            <Skeleton width="80%" height="0.85rem" className="skeleton--mt-sm" />
            <Skeleton width="88%" height="0.85rem" className="skeleton--mt-sm" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const TechStackSkeleton = () => (
  <div className="techstack__grid">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="techstack__item">
        <SkeletonCircle size={40} />
        <Skeleton width="50px" height="0.7rem" />
      </div>
    ))}
  </div>
);

export const ProjectsSkeleton = () => (
  <div className="projects__grid">
    {[1, 2].map((i) => (
      <div key={i} className="project-card" style={{ opacity: 1 }}>
        <Skeleton height="0" className="skeleton--aspect" radius="0" />
        <div style={{ padding: 'var(--space-xl)' }}>
          <Skeleton width="70%" height="1.2rem" />
          <Skeleton width="100%" height="0.85rem" className="skeleton--mt-sm" />
          <Skeleton width="85%" height="0.85rem" className="skeleton--mt-sm" />
          <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
            <Skeleton width="60px" height="1.5rem" radius="var(--radius-full)" />
            <Skeleton width="60px" height="1.5rem" radius="var(--radius-full)" />
            <Skeleton width="60px" height="1.5rem" radius="var(--radius-full)" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const AboutImageSkeleton = () => (
  <Skeleton width="100%" height="0" className="skeleton--square" radius="var(--radius-xl)" />
);
