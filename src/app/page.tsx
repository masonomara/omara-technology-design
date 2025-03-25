"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import styles from "./page.module.css";

const supabase = createClient(
  "https://kyewevtwtforyytzagxx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5ZXdldnR3dGZvcnl5dHphZ3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NjM5NzcsImV4cCI6MjA1ODQzOTk3N30.nxpbqDbJWhUNpr-IdnbX07hX6nbvrjgKKCr4IFy-oD0"
);

export default function Home() {
  const [currentEnemy, setCurrentEnemy] = useState(0);
  const [score, setScore] = useState(0);
  const [spawnTime, setSpawnTime] = useState(0);
  const [nickname, setNickname] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  // Fetch the leaderboard when the game starts or after submission
  useEffect(() => {
    async function fetchLeaderboard() {
      const { data, error } = await supabase
        .from("scores")
        .select("*")
        .order("score", { ascending: false }); // Sort by score descending

      if (error) {
        console.error("Error fetching leaderboard:", error);
      } else {
        let newLeaderboard = data;

        // Simulate adding the user's score into the leaderboard
        if (nickname && score > 0) {
          newLeaderboard = [...data, { nickname, score }];
        }

        // Sort the leaderboard again after inserting the user's score
        newLeaderboard.sort((a: any, b: any) => b.score - a.score);

        setLeaderboard(newLeaderboard);
      }
    }

    fetchLeaderboard();
  }, [score, nickname]); // Re-fetch whenever score or nickname changes

  useEffect(() => {
    function positionEnemy() {
      const gameFrame = document.getElementById("gameFrame");
      const enemy = document.getElementById(`enemy${currentEnemy}`);

      if (!gameFrame || !enemy) return;

      const frameWidth = gameFrame.clientWidth;
      const frameHeight = gameFrame.clientHeight;
      const enemySize = 40; // Enemy width/height

      const randomLeft = Math.random() * (frameWidth - enemySize);
      const randomTop = Math.random() * (frameHeight - enemySize);

      enemy.style.position = "absolute";
      enemy.style.left = `${randomLeft}px`;
      enemy.style.top = `${randomTop}px`;

      setSpawnTime(performance.now());
    }

    if (currentEnemy < 10) positionEnemy();

    window.addEventListener("resize", positionEnemy);
    return () => window.removeEventListener("resize", positionEnemy);
  }, [currentEnemy]);

  function iShoot(event: React.MouseEvent) {
    const enemy = event.currentTarget as HTMLElement;
    const enemyRect = enemy.getBoundingClientRect();
    const clickX = event.clientX;
    const clickY = event.clientY;

    const centerX = enemyRect.left + enemyRect.width / 2;
    const centerY = enemyRect.top + enemyRect.height / 2;

    const maxDistance = Math.sqrt((enemyRect.width / 2) ** 2 + (enemyRect.height / 2) ** 2);
    const clickDistance = Math.sqrt((clickX - centerX) ** 2 + (clickY - centerY) ** 2);
    const accuracyScore = ((maxDistance - clickDistance) / maxDistance) * 50;

    const reactionTime = performance.now() - spawnTime;
    const maxReactionTime = 2000;
    const speedScore = Math.max(0, (1 - reactionTime / maxReactionTime) * 50);

    setScore((prev) => prev + Math.round(accuracyScore + speedScore));
    setCurrentEnemy((prev) => prev + 1);
  }

  async function submitScore() {
    if (nickname.length !== 3) return alert("Nickname must be 3 letters!");

    const { error } = await supabase.from("scores").insert([{ nickname, score: score * 1.0 }]);

    if (error) {
      console.error("Supabase Error:", error);
      alert("Error submitting score: " + error.message);
    } else {
      console.log("Score submitted successfully!");
      setSubmitted(true);
    }
  }

  function restartGame() {
    setCurrentEnemy(0);
    setScore(0);
    setSubmitted(false);
    setNickname("");
    setLeaderboard([]);
  }

  return (
    <div>
      <div className={styles.score}>Score: {score}</div>
      <div id="gameFrame" className={styles.gameFrame}>
        {currentEnemy < 10 ? (
          <div
            key={currentEnemy}
            id={`enemy${currentEnemy}`}
            className={styles.enemy}
            onClick={iShoot}
          ></div>
        ) : (
          <div className={styles.gameOver}>
            <p>Game Over! 🎯 Final Score: {score}</p>
            {!submitted ? (
              <>
                <input
                  type="text"
                  maxLength={3}
                  placeholder="Your Name"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value.toUpperCase())}
                />
                <button onClick={submitScore}>Submit Score</button>
              </>
            ) : (
              <p>Score submitted! 🎉</p>
            )}
            <button onClick={restartGame}>Restart</button>

            <div className={styles.leaderboard}>
              <h2>Leaderboard</h2>
              <ol>
                {leaderboard.map((entry, index) => (
                  <li key={index}>
                    {/* {index + 1}. {entry.nickname} - {entry.score} */}
                  {entry.nickname} - {entry.score}

                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
