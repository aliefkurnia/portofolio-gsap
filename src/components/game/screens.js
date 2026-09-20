import TechStack from '../sections/TechStack';
import AiWorkflow, { LOOP } from '../sections/AiWorkflow';
import Experience from '../sections/Experience';
import Projects from '../sections/Projects';
import Contact from '../sections/Contact';

/**
 * The level-select registry.
 *
 * Order here is the order the cards appear on the title screen (four per row),
 * so the first row is the four "story" stages and the second row finishes the
 * stages and adds the two destinations that leave the game shell.
 *
 * There is deliberately no About stage: the profile card sits on the title
 * screen itself, so a stage that repeated it was a card you could click to
 * arrive back where you already were.
 *
 * `meta(data)` feeds the stage header bar with a live count; it receives the
 * shared portfolio payload. `hidden(data)` drops a card entirely — the AI
 * Workflow stage disappears when the admin has no tools configured.
 */
export const STAGES = [
  {
    key: 'techstack',
    label: 'Tech Stack',
    icon: 'cpu',
    card: 2,
    Component: TechStack,
    meta: (d) => `${d.technologies.length || 15} tools`,
  },
  {
    key: 'ai-workflow',
    label: 'AI Workflow',
    icon: 'sparkle',
    card: 3,
    Component: AiWorkflow,
    // The loop, not the tool count. "2 tools" was accurate and deflating: it
    // measured how short the stage was instead of what the stage explains.
    meta: () => `${LOOP.length}-step loop`,
    hidden: (d) => !d.loading && d.aiTools.length === 0,
  },
  {
    key: 'experience',
    label: 'Experience',
    icon: 'briefcase',
    card: 4,
    Component: Experience,
    meta: (d) => `${d.experiences.length} roles`,
  },
  {
    key: 'projects',
    label: 'Projects',
    icon: 'folder',
    card: 1,
    Component: Projects,
    meta: (d) => `${d.projects.length} repos`,
  },
  {
    key: 'contact',
    label: 'Contact',
    icon: 'envelope',
    card: 2,
    Component: Contact,
    meta: () => 'say hi',
  },
];

/**
 * Cards that leave the shell for a real route. These carry a plain `note`
 * string for the card footer — deliberately *not* `meta`, which on a stage is
 * a function and would be illegal to render as a React child.
 */
export const LINKS = [
  { key: 'arcade', label: 'Arcade', icon: 'gamepad', card: 3, href: '/play', note: '6 games' },
  { key: 'resume', label: 'Resume', icon: 'code', card: 4, href: '/PreviewCV', note: 'view cv' },
];

/** Every card on the title screen, in display order. */
export const ALL_CARDS = [...STAGES, ...LINKS];

export const getStage = (key) => STAGES.find((s) => s.key === key) || null;
