import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Hud from './Hud';
import TitleScreen from './TitleScreen';
import Stage from './Stage';
import { STAGES, getStage } from './screens';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import AiAssistant from '../ui/AiAssistant';
import './Game.css';

/**
 * The game shell.
 *
 * One screen at a time on a viewport that never scrolls: either the title
 * screen (level select) or one slide of the stage deck.
 *
 * The stages form a single linear deck — Tech Stack → AI Workflow →
 * Experience → Projects → Contact — walked with the arrow keys or the
 * prev/next buttons in the stage bar. `Stage` plays the sideways transition
 * and this component only decides *where* to land, which is why `navigate`
 * records the direction alongside the destination: the incoming slide reads
 * it to know which side to enter from.
 *
 * The current screen lives in the URL as `?stage=<key>` rather than in local
 * state. That buys three things for free: the browser Back button steps
 * backwards through the slides you visited, a stage is deep-linkable, and
 * nothing has to be hand-synced with the History API.
 */
const Game = () => {
  const data = usePortfolioData();
  const [params, setParams] = useSearchParams();
  const [dir, setDir] = useState(null);
  const navLockRef = useRef(0);

  const stage = getStage(params.get('stage'));

  /**
   * `direction` is `'next'`, `'prev'`, or `null` for a jump that has no
   * direction of travel — arriving from the map, the logo, or a deep link.
   * A null direction is what keeps those entrances dropping in from above
   * instead of sliding sideways for no reason.
   *
   * Deck navigation is rate-limited here, and it has to be here rather than in
   * `Stage`. `Stage`'s own lock covers the outgoing frame's lifetime, but the
   * frame unmounts at the swap — so a burst of arrow presses that straddles
   * the swap finds a *fresh* lock on the far side and fires a second slide.
   * Measured: five presses 45ms apart moved two slides, not one. This lock
   * lives on the component that survives the swap, so the burst lands inside
   * one window wherever it falls. 240ms is the 160ms exit tween plus enough
   * margin that a deliberate second press is never swallowed.
   */
  const navigate = useCallback(
    (key, direction = null) => {
      if (direction) {
        const now = Date.now();
        if (now - navLockRef.current < 240) return;
        navLockRef.current = now;
      }
      setDir(direction);
      setParams({ stage: key });
    },
    [setParams]
  );

  // Guarded so clicking the logo while already home doesn't stack duplicate
  // history entries (setParams pushes by default). Clears the params outright
  // rather than setting `stage: null`, so the URL stays clean.
  const goHome = useCallback(() => {
    if (!params.get('stage')) return;
    setDir(null);
    setParams({});
  }, [params, setParams]);

  const stageList = STAGES.filter((s) => !s.hidden?.(data));
  const idx = stage ? stageList.findIndex((s) => s.key === stage.key) : -1;
  const index = idx + 1;
  const prevKey = idx > 0 ? stageList[idx - 1].key : null;
  const nextKey = idx >= 0 && idx < stageList.length - 1 ? stageList[idx + 1].key : null;
  const ActiveComponent = stage?.Component;

  // The browser tab follows the stage, the way a game names its current level.
  useEffect(() => {
    document.title = stage
      ? `${stage.label} — Alief Kurnia`
      : 'Alief Kurnia — .NET Software Developer';
  }, [stage]);

  return (
    <div className="shell">
      <Hud stage={stage} index={index} total={stageList.length} onHome={goHome} />

      <div className="shell__body">
        {stage && ActiveComponent ? (
          <Stage
            key={stage.key}
            title={stage.label}
            meta={stage.meta?.(data)}
            index={index}
            total={stageList.length}
            enterFrom={dir}
            prevKey={prevKey}
            nextKey={nextKey}
            onBack={goHome}
            onNavigate={navigate}
          >
            <ActiveComponent />
          </Stage>
        ) : (
          <TitleScreen data={data} onStart={(key) => navigate(key, null)} />
        )}
      </div>

      <AiAssistant />
    </div>
  );
};

export default Game;
