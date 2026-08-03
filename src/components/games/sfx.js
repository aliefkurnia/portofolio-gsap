// Tiny Web Audio sound kit — no asset files, synthesised on the fly.
const MUTE_KEY = "arcade_muted";

export function isMuted() {
  return localStorage.getItem(MUTE_KEY) === "1";
}

export function setMuted(muted) {
  localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
}

let ctx;
function audio() {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

// A single short tone.
export function blip(freq = 440, dur = 0.08, type = "square", gain = 0.05) {
  if (isMuted()) return;
  const c = audio();
  if (!c) return;
  try {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime);
    g.gain.setValueAtTime(gain, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    osc.connect(g);
    g.connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + dur);
  } catch {
    /* ignore */
  }
}

// Squash hit — pitch climbs with the combo for a satisfying streak.
export function hit(combo = 0) {
  const base = 300 + Math.min(combo, 24) * 26;
  blip(base, 0.07, "square", 0.05);
}

// Combo milestone flourish (two quick rising notes).
export function comboUp(combo = 0) {
  const base = 420 + Math.min(combo, 24) * 24;
  blip(base, 0.09, "triangle", 0.06);
  setTimeout(() => blip(base * 1.5, 0.09, "triangle", 0.05), 70);
}

export function fail() {
  blip(180, 0.22, "sawtooth", 0.05);
}

export function win() {
  [523, 659, 784, 1046].forEach((f, i) =>
    setTimeout(() => blip(f, 0.12, "triangle", 0.05), i * 90)
  );
}

// Simon pad tones (classic four voices).
const PAD_TONES = [329.63, 415.3, 493.88, 659.25];
export function pad(i) {
  blip(PAD_TONES[i] || 440, 0.28, "sine", 0.07);
}

// Memory Match — card flip + pair matched.
export function flip() {
  blip(430, 0.05, "sine", 0.04);
}
export function match() {
  blip(660, 0.09, "triangle", 0.05);
  setTimeout(() => blip(880, 0.1, "triangle", 0.045), 90);
}

// Typing — per-keystroke feedback.
export function typeKey(ok) {
  if (ok) blip(520, 0.02, "square", 0.02);
  else blip(150, 0.09, "sawtooth", 0.045);
}

// Reaction — the "go" cue.
export function go() {
  blip(740, 0.12, "triangle", 0.06);
}

// Snake — food eaten.
export function eat() {
  blip(680, 0.05, "square", 0.05);
}
