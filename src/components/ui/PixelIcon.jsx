import React from 'react';

/**
 * Pixel-art icons, drawn as hard-edged rects on a 16-unit grid.
 *
 * Each icon is a list of [x, y, width, height] rects filled with
 * currentColor, so an icon inherits whatever colour its context sets.
 * `shapeRendering="crispEdges"` keeps every edge on a hard pixel boundary —
 * the whole point of the aesthetic.
 */

const GRID = '0 0 16 16';

/**
 * Chevrons are stacked rects forming a ">"; cx is the left edge of the
 * chevron's bounding box, which is 5 wide by 8 tall.
 *
 * Two separate things made these render as speckle rather than as arrows, and
 * both had to be fixed.
 *
 * The first was scale. They used to sit on an 18x16 viewBox and render at
 * 16-22px, so the scale was fractional (1.22x, 1.375x) and every shared edge
 * snapped to a different device pixel. They now live on the same 16-unit grid
 * as every other icon, where sizes of 16 and 32 give exact 1x and 2x.
 *
 * The second was the geometry, which is the subtler one. The arms were built
 * from 2x2 blocks stepping +2 in x and +2 in y, so consecutive blocks met at a
 * *single corner point* — the diagonal came apart into a dotted line of loose
 * squares even at a perfect integer scale. Stepping +1 in x and +1 in y
 * instead, with 2-wide by 1-tall rects, makes each block share a full 1-unit
 * edge with the next, so the arm reads as one continuous stroke.
 *
 * Each arm is exactly 2 units thick, and the two arms meet across a full edge
 * at the apex (both are 2 tall there), so the chevron is one solid glyph.
 */
const chevronRight = (cx) => [
  [cx, 4, 2, 1],
  [cx + 1, 5, 2, 1],
  [cx + 2, 6, 2, 1],
  [cx + 3, 7, 2, 1],
  [cx + 3, 8, 2, 1],
  [cx + 2, 9, 2, 1],
  [cx + 1, 10, 2, 1],
  [cx, 11, 2, 1],
];

// Derived as the exact mirror within the 16-unit grid — a rect covering
// [x, x+w) mirrors to [16-x-w, 16-x) — so the two arrows cannot drift apart.
const chevronLeft = (cx) =>
  chevronRight(cx).map(([x, y, w, h]) => [16 - x - w, y, w, h]);

export const ICONS = {
  /* ── Hero level cards ── */
  person: {
    viewBox: GRID,
    rects: [
      [6, 2, 4, 4],
      [4, 7, 8, 1],
      [3, 8, 10, 1],
      [2, 9, 12, 5],
    ],
  },
  folder: {
    viewBox: GRID,
    rects: [
      [2, 3, 6, 2],
      [2, 5, 12, 8],
      [4, 7, 4, 1],
      [4, 9, 8, 1],
    ],
  },
  gamepad: {
    viewBox: GRID,
    rects: [
      [4, 5, 8, 1],
      [2, 6, 12, 4],
      [1, 7, 2, 3],
      [13, 7, 2, 3],
      [4, 10, 3, 1],
      [9, 10, 3, 1],
      [5, 7, 1, 3],
      [4, 8, 3, 1],
      [11, 7, 1, 1],
      [10, 8, 1, 1],
    ],
  },
  envelope: {
    viewBox: GRID,
    rects: [
      [2, 4, 12, 1],
      [2, 5, 1, 7],
      [13, 5, 1, 7],
      [2, 11, 12, 1],
      [3, 5, 3, 1],
      [6, 6, 4, 1],
      [10, 5, 3, 1],
    ],
  },
  /* Document with a stepped corner fold — the CV / resume mark. */
  file: {
    viewBox: GRID,
    rects: [
      [4, 1, 6, 1],
      [3, 2, 1, 11],
      [9, 2, 1, 1],
      [10, 3, 1, 1],
      [11, 4, 1, 1],
      [12, 5, 1, 8],
      [3, 13, 10, 1],
      [5, 6, 6, 1],
      [5, 9, 6, 1],
      [5, 11, 4, 1],
    ],
  },

  /* ── Section marks ── */
  briefcase: {
    viewBox: GRID,
    rects: [
      [6, 2, 4, 2],
      [2, 4, 12, 9],
      [2, 7, 12, 1],
      [7, 7, 2, 3],
    ],
  },
  cpu: {
    viewBox: GRID,
    rects: [
      [4, 4, 8, 8],
      [6, 6, 4, 4],
      [7, 1, 2, 3],
      [7, 12, 2, 3],
      [1, 7, 3, 2],
      [12, 7, 3, 2],
    ],
  },
  sparkle: {
    viewBox: GRID,
    rects: [
      [7, 1, 2, 5],
      [7, 10, 2, 5],
      [1, 7, 5, 2],
      [10, 7, 5, 2],
      [6, 6, 4, 4],
    ],
  },

  /* ── Controls ── */
  sun: {
    viewBox: GRID,
    rects: [
      [6, 5, 4, 6],
      [7, 4, 2, 1],
      [7, 11, 2, 1],
      [7, 1, 2, 2],
      [7, 13, 2, 2],
      [1, 7, 2, 2],
      [13, 7, 2, 2],
      [3, 3, 2, 2],
      [11, 3, 2, 2],
      [3, 11, 2, 2],
      [11, 11, 2, 2],
    ],
  },
  /* A disc with a bite taken out of the upper right. The previous version was
     a thin 3px arc, which at 16-18px collapsed into something indistinguishable
     from a `‹` chevron — in the HUD that made the theme switch look like a back
     button. Solid enough to read as a moon at any size. */
  moon: {
    viewBox: GRID,
    rects: [
      [5, 3, 3, 1],
      [4, 4, 4, 1],
      [3, 5, 5, 1],
      [3, 6, 5, 1],
      [2, 7, 7, 1],
      [2, 8, 11, 1],
      [3, 9, 10, 1],
      [3, 10, 10, 1],
      [4, 11, 8, 1],
      [5, 12, 6, 1],
    ],
  },
  /* Both arrows span x 0-16 and y 4-12, so they are exact mirrors. The shaft
     runs into the first chevron's mouth (they overlap across x 5-6), and the
     two chevrons are left a 1-unit gap so they read as `>>` rather than
     merging into a single thick wedge. */
  arrowRight: {
    viewBox: GRID,
    rects: [[0, 7, 6, 2], ...chevronRight(5), ...chevronRight(11)],
  },
  arrowLeft: {
    viewBox: GRID,
    rects: [[10, 7, 6, 2], ...chevronLeft(5), ...chevronLeft(11)],
  },

  /* ── Social ── */
  code: {
    viewBox: GRID,
    rects: [
      [5, 3, 2, 2],
      [3, 5, 2, 2],
      [1, 7, 2, 2],
      [3, 9, 2, 2],
      [5, 11, 2, 2],
      [9, 3, 2, 2],
      [11, 5, 2, 2],
      [13, 7, 2, 2],
      [11, 9, 2, 2],
      [9, 11, 2, 2],
    ],
  },
  link: {
    viewBox: GRID,
    rects: [
      [2, 6, 4, 1],
      [1, 7, 1, 2],
      [2, 9, 4, 1],
      [10, 6, 4, 1],
      [14, 7, 1, 2],
      [10, 9, 4, 1],
      [7, 7, 2, 2],
    ],
  },
  external: {
    viewBox: GRID,
    rects: [
      [3, 3, 6, 2],
      [3, 3, 2, 10],
      [3, 11, 10, 2],
      [9, 8, 2, 2],
      [11, 6, 2, 2],
      [13, 2, 2, 4],
      [9, 2, 6, 2],
    ],
  },
};

const PixelIcon = ({ name, size = 24, className = '', title, ...rest }) => {
  const icon = ICONS[name];
  if (!icon) return null;

  const labelled = Boolean(title);

  return (
    <svg
      className={`px-icon${className ? ` ${className}` : ''}`}
      width={size}
      height={size}
      viewBox={icon.viewBox}
      fill="currentColor"
      shapeRendering="crispEdges"
      role={labelled ? 'img' : undefined}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
      {...rest}
    >
      {labelled && <title>{title}</title>}
      {icon.rects.map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} />
      ))}
    </svg>
  );
};

/**
 * Standalone arrow used to flank section titles (`->>` … `<<-`).
 *
 * `size` must be a multiple of 16 — the arrows are chains of rects that touch
 * edge to edge, and any other size scales them fractionally so the joins come
 * apart into speckle. 16 and 32 are the useful ones.
 */
export const PixelArrow = ({ direction = 'right', size = 16, className = '' }) => (
  <PixelIcon
    name={direction === 'left' ? 'arrowLeft' : 'arrowRight'}
    size={size}
    className={`px-arrow${className ? ` ${className}` : ''}`}
  />
);

export default PixelIcon;
