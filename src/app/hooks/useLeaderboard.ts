"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  nickname: string;
  score: number;
  user_id: string;
}

// ─── Supabase client ──────────────────────────────────────────────────────────

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLeaderboard(gameEnd: boolean) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userId, setUserId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Persist a UUID in localStorage so we can identify the current user in the
  // leaderboard without requiring an account
  useEffect(() => {
    let storedId = localStorage.getItem("userId");
    if (!storedId) {
      storedId = uuidv4();
      localStorage.setItem("userId", storedId);
    }
    setUserId(storedId);
  }, []);

  // Fetch leaderboard when the game ends
  useEffect(() => {
    if (gameEnd) fetchLeaderboard();
  }, [gameEnd]);

  async function fetchLeaderboard() {
    const { data, error } = await supabase
      .from("scores")
      .select("*")
      .order("score", { ascending: false });
    if (!error && data) setLeaderboard(data as LeaderboardEntry[]);
  }

  // Returns null on success, an error message string on failure
  async function submitScore(nickname: string, score: number): Promise<string | null> {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("scores")
        .insert([{ nickname, score, user_id: userId }]);

      if (error) {
        console.error("Supabase error:", error);
        return `Error submitting score: ${error.message}`;
      }

      setSubmitted(true);
      await fetchLeaderboard();
      return null;
    } catch (err) {
      console.error("Network error:", err);
      return "Failed to connect. Please check your connection and try again.";
    } finally {
      setIsSubmitting(false);
    }
  }

  function reset() {
    setLeaderboard([]);
    setSubmitted(false);
    setIsSubmitting(false);
  }

  return { leaderboard, userId, isSubmitting, submitted, submitScore, reset };
}
