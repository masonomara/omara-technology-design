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
  const [warning, setWarning] = useState<string>("");
  const [bangVisible, setBangVisible] = useState(false);
  const [enemyHit, setEnemyHit] = useState(false);

  // List of bad words
  const badWords = ["FAG", "FCK", "FUK", "ASS", "8=D", "DIK", "SHT", "CNT", "KKK",]; // Replace with actual bad words

  // Function to check if the nickname contains a bad word
  const containsBadWord = (nickname: string) => {
    return badWords.some((word) => nickname.includes(word));
  };

  // Fetch leaderboard when game starts or after submission
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
        if (score > 0) {
          newLeaderboard = [...data, { nickname, score }];
        }

        // Sort leaderboard again after inserting the user's score
        newLeaderboard.sort((a: any, b: any) => b.score - a.score);

        setLeaderboard(newLeaderboard);
      }
    }

    fetchLeaderboard();
  }, [score, nickname]);

  useEffect(() => {
    function positionEnemy() {
      const gameFrame = document.getElementById("gameFrame");
      const enemy = document.getElementById(`enemy${currentEnemy}`);

      if (!gameFrame || !enemy) return;

      const frameWidth = gameFrame.clientWidth;
      const frameHeight = gameFrame.clientHeight;
      const enemySize = 40;

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
    setBangVisible(true);
    setEnemyHit(true);

    setTimeout(() => {
      setBangVisible(false);
      setCurrentEnemy((prev) => prev + 1);
      setEnemyHit(false);
    }, 500);

    const enemy = event.currentTarget;
    enemy.style.transition = "transform 0.5s ease-out, opacity 0.5s ease-out";

    const randomAngle = Math.random() * 360;
    const randomX = (Math.random() - 0.5) * 300;
    const randomY = (Math.random() - 0.5) * 300;
    enemy.style.transform = `rotate(${randomAngle}deg) translate(${randomX}px, ${randomY}px)`;
    enemy.style.opacity = "0";

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
  }

  async function submitScore() {
    if (nickname.length !== 3) return alert("Nickname must be 3 letters!");

    // If the nickname contains a bad word, show the warning, but allow submission on subsequent clicks
    if (containsBadWord(nickname)) {
      if (warning === "") {
        setWarning("Your nickname contains a bad word. Please consider a different name.");
        return;
      }
    } else {
      setWarning(""); // Clear any previous warning
    }

    // Proceed to submit the score regardless of the bad word
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
    setWarning(""); // Clear any previous warning
  }


  // Function to format the nickname when it's not fully entered
  const formatNickname = (nickname: string) => {
    if (nickname.length === 0) {
      return "_  ";
    } else if (nickname.length === 1) {
      return `${nickname}_ `;
    } else if (nickname.length === 2) {
      return `${nickname}_`;
    } else {
      return nickname;
    }
  };

  return (
    <div>
      <div className={styles.score}>{score} points</div>
      <div id="gameFrame" className={styles.gameFrame}>
        {currentEnemy < 10 ? (
          <>
            {bangVisible && <div className={styles.bang}>BANG!</div>}
            <div
              key={currentEnemy}
              id={`enemy${currentEnemy}`}
              className={`${styles.enemy} ${enemyHit ? styles.enemyHit : ""}`}
              onClick={iShoot}
            ></div>
          </>
        ) : (
          <div className={styles.gameOver}>
            <p>Game Over! 🎯 Final Score: {score}</p>
            <div className={styles.leaderboard}>
              <h2>Leaderboard</h2>
              <ol>
                {leaderboard.map((entry, index) => (
                  <li key={index} className={styles.leaderboardEntry}>
                    <div>{formatNickname(entry.nickname)}</div><div>{entry.score}</div>
                  </li>
                ))}
              </ol>
            </div>
            {!submitted ? (
              <>
                <input
                  type="text"
                  maxLength={3}
                  placeholder="Your Name"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value.toUpperCase())}
                />
                {warning && <div className={styles.warning}>{warning}</div>} {/* Show the warning */}
                <button className={styles.button} onClick={submitScore}>{warning ? "Submit Anyway" : "Submit Score"}
                </button>
              </>
            ) : (
              <p>Score submitted! 🎉</p>
            )}
            <button onClick={restartGame}>Restart</button>
          </div>
        )}
      </div>
    </div>
  );
}
