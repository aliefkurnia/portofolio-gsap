import React, { useState, useEffect, useCallback } from "react";
import { fetchLeaderboard, getPlayerName } from "./scores";
import "./Leaderboard.css";

const MEDALS = ["🥇", "🥈", "🥉"];

const Leaderboard = ({ gameId, dir = "high", formatBest }) => {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const me = getPlayerName().trim().toLowerCase();

  const load = useCallback(async () => {
    const { rows: r, error } = await fetchLeaderboard(gameId, dir, 10);
    if (error) {
      setStatus("error");
      setRows([]);
    } else {
      setRows(r);
      setStatus("ready");
    }
  }, [gameId, dir]);

  useEffect(() => {
    load();
    const onScore = (e) => {
      if (!e.detail || e.detail.gameId === gameId) load();
    };
    window.addEventListener("arcade:score", onScore);
    return () => window.removeEventListener("arcade:score", onScore);
  }, [load, gameId]);

  return (
    <div className="lb px-panel">
      <div className="lb__head">
        <h3 className="lb__title">Leaderboard</h3>
        <button className="lb__refresh" onClick={load} aria-label="Refresh">
          ↻
        </button>
      </div>

      {status === "loading" && <p className="lb__msg">Loading…</p>}

      {status === "error" && (
        <p className="lb__msg">
          Leaderboard is offline. Run the SQL in supabase-leaderboard.sql to enable it.
        </p>
      )}

      {status === "ready" && rows.length === 0 && (
        <p className="lb__msg">No scores yet — be the first!</p>
      )}

      {status === "ready" && rows.length > 0 && (
        <ol className="lb__list">
          {rows.map((row, i) => {
            const mine = me && row.player_name.trim().toLowerCase() === me;
            return (
              <li key={i} className={`lb__row${mine ? " is-me" : ""}`}>
                <span className="lb__rank">{MEDALS[i] || i + 1}</span>
                <span className="lb__name">{row.player_name}</span>
                <span className="lb__score">
                  {formatBest ? formatBest(row.score) : row.score}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

export default Leaderboard;
