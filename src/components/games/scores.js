import { supabase } from "../../lib/supabase";

// ─── Local personal best (instant, offline) ───
const keyFor = (id) => `arcade_best_${id}`;

export function getBest(id) {
  const raw = localStorage.getItem(keyFor(id));
  return raw == null ? null : Number(raw);
}

// Save `value` if it beats the stored best. dir 'high' = bigger is better,
// 'low' = smaller is better. Returns true when a new best was set.
export function submitBest(id, value, dir = "high") {
  const cur = getBest(id);
  const isBetter = cur == null || (dir === "high" ? value > cur : value < cur);
  if (isBetter) {
    localStorage.setItem(keyFor(id), String(value));
    return true;
  }
  return false;
}

// ─── Player handle (shared across games) ───
const PLAYER_KEY = "arcade_player";

export function getPlayerName() {
  return localStorage.getItem(PLAYER_KEY) || "";
}

export function setPlayerName(name) {
  localStorage.setItem(PLAYER_KEY, name.slice(0, 24));
}

// ─── Database leaderboard (Supabase: game_scores) ───
export async function submitScore(gameId, score) {
  const name = (getPlayerName() || "Anonymous").trim().slice(0, 24) || "Anonymous";
  const { error } = await supabase
    .from("game_scores")
    .insert({ game_id: gameId, player_name: name, score });
  if (error) {
    // Table not set up yet or offline — fail quietly, local best still works.
    console.warn("Leaderboard submit failed:", error.message);
    return false;
  }
  window.dispatchEvent(new CustomEvent("arcade:score", { detail: { gameId } }));
  return true;
}

// Returns top entries, one row per player (their best). dir controls ranking.
export async function fetchLeaderboard(gameId, dir = "high", limit = 10) {
  const { data, error } = await supabase
    .from("game_scores")
    .select("player_name, score, created_at")
    .eq("game_id", gameId)
    .order("score", { ascending: dir === "low" })
    .limit(200);

  if (error || !data) return { rows: [], error: error?.message || null };

  const seen = new Set();
  const rows = [];
  for (const row of data) {
    const key = row.player_name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push(row);
    if (rows.length >= limit) break;
  }
  return { rows, error: null };
}
