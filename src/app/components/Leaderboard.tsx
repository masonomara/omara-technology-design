"use client";

import { useEffect, useRef, useState } from "react";
import type { LeaderboardEntry } from "../hooks/useLeaderboard";
import styles from "./Leaderboard.module.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const BAD_WORDS = [
  "FAG",
  "FUCK",
  "TITS",
  "CUNT",
  "8=D",
  "SHIT",
  "PISS",
  "KKK",
  "COCK",
  "NIGGER",
  "NIGGA",
  "KIKE",
  "PUSSY",
  "SLUT",
  "CRAP",
  "BITCH",
];

function containsBadWord(name: string): boolean {
  return BAD_WORDS.some((word) => name.toUpperCase().includes(word));
}

/**
 * Converts a score into a human-readable rank label by counting how many
 * existing leaderboard entries scored strictly higher. Works before submission.
 */
function getRankLabel(score: number, leaderboard: LeaderboardEntry[]): string {
  const total = leaderboard.length;
  if (total === 0) return "Rank not available";

  const betterCount = leaderboard.filter((entry) => entry.score > score).length;
  const pct = (betterCount / total) * 100;

  if (pct <= 0.01) return "Top 0.01%";
  if (pct <= 0.1) return "Top 0.1%";
  if (pct <= 1) return "Top 1%";
  if (pct <= 5) return "Top 5%";
  if (pct <= 10) return "Top 10%";
  if (pct <= 25) return "Top 25%";
  if (pct <= 50) return "Top 50%";
  return "Bottom 50%";
}

// ─── Component ────────────────────────────────────────────────────────────────

interface LeaderboardProps {
  score: number;
  timeTaken: string;
  accuracy: string;
  leaderboard: LeaderboardEntry[];
  userId: string;
  submitted: boolean;
  isSubmitting: boolean;
  onSubmitScore: (nickname: string, score: number) => Promise<string | null>;
  onPlayAgain: () => void;
}

export default function Leaderboard({
  score,
  timeTaken,
  accuracy,
  leaderboard,
  userId,
  submitted,
  isSubmitting,
  onSubmitScore,
  onPlayAgain,
}: LeaderboardProps) {
  const [nickname, setNickname] = useState("");
  const [warning, setWarning] = useState("");
  const userRowRef = useRef<HTMLLIElement | null>(null);

  // Scroll to the user's row once leaderboard data arrives
  useEffect(() => {
    if (leaderboard.length > 0) {
      setTimeout(() => {
        userRowRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [leaderboard]);

  async function handleSubmit() {
    if (!nickname.trim()) {
      setWarning("Enter your nickname");
      return;
    }
    // On first bad word detection, warn and stop. On second attempt, allow through.
    if (containsBadWord(nickname) && !warning) {
      setWarning("Your nickname has a bad word. Please use a different name.");
      return;
    }
    setWarning("");
    const error = await onSubmitScore(nickname, score);
    if (error) setWarning(error);
  }

  return (
    <div className={styles.container}>
      {/* Final score */}
      <span className={styles.trophyScore}>
        {score}
        <span className={styles.trophyDetails}>points!</span>
      </span>

      {/* Quick stats: time / accuracy / percentile rank */}
      <div className={styles.statsContainer}>
        <div className={styles.statsWrapper}>
          <span className={styles.statsTitle}>{timeTaken} seconds</span>
        </div>
        <div className={styles.statsDivider} />
        <div className={styles.statsWrapper}>
          <span className={styles.statsTitle}>{accuracy}% accuracy</span>
        </div>
        <div className={styles.statsDivider} />
        <div className={styles.statsWrapper}>
          <span className={styles.statsTitle}>
            {getRankLabel(score, leaderboard)}
          </span>
        </div>
      </div>

      {/* Leaderboard table */}
      <div className={styles.header}>
        <span>Rank</span>
        <span>Name</span>
        <span>Score</span>
      </div>
      <ol className={styles.list}>
        {leaderboard.map((entry, index) => {
          const isCurrentUser = entry.user_id === userId;
          return (
            <li
              key={index}
              ref={isCurrentUser ? userRowRef : null}
              className={`${styles.entry} ${isCurrentUser ? styles.highlight : ""}`}
            >
              <div className={styles.rank}>{index + 1}</div>
              <div
                className={styles.name}
                style={
                  isCurrentUser && !entry.nickname
                    ? { opacity: 0.5 }
                    : undefined
                }
              >
                {entry.nickname
                  ? entry.nickname.toUpperCase()
                  : isCurrentUser
                    ? "NICKNAME"
                    : ""}
              </div>
              <div className={styles.score}>{entry.score}</div>
            </li>
          );
        })}
      </ol>

      {/* Nickname input or thank-you message */}
      {submitted ? (
        <div className={styles.thankYou}>Score submitted!</div>
      ) : (
        <>
          <input
            type="text"
            placeholder="Your nickname"
            className={styles.input}
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              if (warning) setWarning("");
            }}
          />
          <div className={styles.warning}>
            {warning || "Enter your nickname"}
          </div>
        </>
      )}

      {/* Action buttons */}
      <div className={styles.buttonRow}>
        {!submitted && (
          <button
            className={`${styles.button} ${styles.buttonPrimary}`}
            onClick={handleSubmit}
            disabled={!nickname.trim() || isSubmitting}
          >
            <p>{warning ? "Submit Anyway" : "Submit Score"}</p>
          </button>
        )}
        <button onClick={onPlayAgain} className={styles.button}>
          <p>Play Again</p>
        </button>
      </div>
    </div>
  );
}
