import React, { useRef } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { useReveals } from '../../hooks/useReveals';
import './AiWorkflow.css';

/**
 * The four beats an AI-assisted change goes through.
 *
 * These are stage content rather than data, and deliberately so. The section is
 * named for a *workflow*, but all it ever rendered was the tool list — so with
 * two tools configured it read as two chips and a sentence, and the header bar
 * cheerfully advertised "2 tools". The loop is the part that actually explains
 * how the tools are used, and it costs no rows in the database: `ai_tools`
 * holds only `name`, `icon_url` and `sort_order`, so there is nothing per-tool
 * to say beyond the name.
 *
 * It is written as the general shape of the practice rather than as a claim
 * about any particular employer, and step 03/04 restate what the intro already
 * asserts: nothing ships unreviewed.
 *
 * Exported so `screens.js` can label the stage from the same source — the
 * header bar used to read "2 tools", which advertised how short the stage was
 * rather than what it contains.
 */
export const LOOP = [
  {
    no: '01',
    title: 'Scope',
    body: 'Decide what the model is allowed to touch before an editor is open.',
  },
  {
    no: '02',
    title: 'Prompt',
    body: 'One change at a time, with the surrounding code in context rather than described.',
  },
  {
    no: '03',
    title: 'Review',
    body: 'Read every diff line by line. Nothing merges because it looked plausible.',
  },
  {
    no: '04',
    title: 'Verify',
    body: 'Run it — tests, types, the real screen. A confident answer is not evidence.',
  },
];

/**
 * The lines that do not move, however good the model gets.
 *
 * The loop above says what happens; this says what is off the table. It also
 * gives the stage a floor — the loop plus a two-tool toolbox left the bottom
 * quarter of the screen empty, which read as an unfinished page rather than a
 * deliberately short one.
 */
const RULES = [
  'No generated code is merged unread — the diff is the review.',
  'Keys, secrets and customer data never go into a prompt.',
  'If I cannot explain a change line by line, it does not ship.',
];

/** The AI Workflow stage. The stage frame supplies the title bar. */const AiWorkflow = () => {
  const sectionRef = useRef(null);
  const { aiTools, loading } = usePortfolioData();

  useReveals(sectionRef, [aiTools.length, loading]);

  // With no tools configured the stage is dropped from the level select
  // entirely (see screens.js), so this is only a guard for a direct hit.
  if (!loading && aiTools.length === 0) return null;

  return (
    <div className="aiflow" ref={sectionRef}>
      <p className="aiflow__intro" data-reveal>
        AI is a daily copilot here — for pair programming, reviews, and
        debugging. Every output is reviewed and tested before it reaches the
        codebase, and the loop below is what that looks like in practice.
      </p>

      <ol className="aiflow__steps" data-stagger>
        {LOOP.map((step) => (
          <li className="aiflow__step" key={step.no}>
            <span className="aiflow__step-no">{step.no}</span>
            <h3 className="aiflow__step-title">{step.title}</h3>
            <p className="aiflow__step-body">{step.body}</p>
          </li>
        ))}
      </ol>

      {/* Only rendered once there is something in it — an empty "Toolbox"
          heading over nothing is worse than no heading at all. */}
      {aiTools.length > 0 && (
        <section className="aiflow__tools">
          <h3 className="aiflow__label">Toolbox</h3>
          <div className="aiflow__grid" data-stagger>
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
        </section>
      )}

      <section className="aiflow__rules">
        <h3 className="aiflow__label">Ground rules</h3>
        <ul className="aiflow__list" data-bullets>
          {RULES.map((rule) => (
            <li className="aiflow__rule" key={rule}>
              {rule}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AiWorkflow;
