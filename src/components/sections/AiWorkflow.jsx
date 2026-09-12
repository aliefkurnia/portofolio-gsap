import React, { useRef } from 'react';
import SectionHeading from '../ui/SectionHeading';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { useReveals } from '../../hooks/useScrollReveal';
import './AiWorkflow.css';

const AiWorkflow = () => {
  const sectionRef = useRef(null);
  const { aiTools, loading } = usePortfolioData();

  useReveals(sectionRef, [aiTools.length, loading]);

  // Section only shows once there are tools to display.
  if (!loading && aiTools.length === 0) return null;

  return (
    <section className="aiflow section" id="ai-workflow" ref={sectionRef}>
      <div className="aiflow__glow" aria-hidden="true" />
      <div className="container">
        <SectionHeading label="AI Workflow" title="AI Tools" />

        <p className="aiflow__intro" data-reveal>
          Tools I use as a daily copilot — for pair programming, reviews, and
          debugging. Every AI output is reviewed and tested before it reaches
          the codebase.
        </p>

        <div className="aiflow__grid" data-reveal>
          {aiTools.map((tool) => (
            <div className="aiflow__tile" key={tool.id}>
              <div className="aiflow__icon-box">
                {tool.icon_url ? (
                  <img
                    src={tool.icon_url}
                    alt={tool.name}
                    className="aiflow__icon"
                    loading="lazy"
                  />
                ) : (
                  <span className="aiflow__icon-fallback">
                    {tool.name?.charAt(0) || '?'}
                  </span>
                )}
              </div>
              <span className="aiflow__name">{tool.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AiWorkflow;
