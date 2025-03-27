"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import styles from "./page.module.css";
import Image from "next/image";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface LeaderboardEntry {
  nickname: string;
  score: number;
}

const enemyImages = ["/can1.png", "/can2.png", "/can3.png"];

export default function Home() {
  const [bangs, setBangs] = useState<{ x: number; y: number; id: number; rotation: number }[]>([]);
  const [currentEnemy, setCurrentEnemy] = useState(0);
  const [score, setScore] = useState(0);
  const [spawnTime, setSpawnTime] = useState(0);
  const [nickname, setNickname] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [warning, setWarning] = useState<string>("");
  const [enemyHit, setEnemyHit] = useState(false);

  const badWords = ["FAG", "FCK", "FUK", "ASS", "8=D", "DIK", "SHT", "CNT", "KKK"];

  const containsBadWord = (nickname: string) =>
    badWords.some((word) => nickname.includes(word));

  // This effect is for DOM manipulation related to the "bang" markers
  useEffect(() => {
    const gameFrame = document.getElementById("gameFrame");
    const handleClick = (event: MouseEvent) => {
      if (!gameFrame) return;

      const rect = gameFrame.getBoundingClientRect();
      const bangId = Date.now() + Math.random(); // Ensures uniqueness
      const rotation = Math.random() * 20 - 10; // Random rotation

      setBangs((prev) => [
        ...prev,
        { x: event.clientX - rect.left, y: event.clientY - rect.top, id: bangId, rotation },
      ]);

      setTimeout(() => {
        setBangs((prev) => prev.filter((bang) => bang.id !== bangId));
      }, 250);
    };

    gameFrame?.addEventListener("click", handleClick);
    return () => gameFrame?.removeEventListener("click", handleClick);
  }, []);


  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase.from("scores").select("*").order("score", { ascending: false });
      if (error) {
        console.error("Error fetching leaderboard:", error);
      } else {
        if (score > 0) {
          data.push({ nickname, score });
          data.sort((a, b) => b.score - a.score);
        }
        setLeaderboard(data);
      }
    };
    fetchLeaderboard();
  }, [score, nickname]);

  // useEffect(() => {
  //   const handleClick = (event: MouseEvent) => {
  //     const gameFrame = document.getElementById("gameFrame");
  //     if (!gameFrame) return;

  //     const rect = gameFrame.getBoundingClientRect();
  //     const x = event.clientX - rect.left;
  //     const y = event.clientY - rect.top;
  //     const bangId = Date.now() * Math.random();

  //     setBangs((prev) => [...prev, { x, y, id: bangId }]);

  //     setTimeout(() => {
  //       setBangs((prev) => prev.filter((bang) => bang.id !== bangId));
  //     }, 250);
  //   };

  //   const gameFrame = document.getElementById("gameFrame");
  //   gameFrame?.addEventListener("click", handleClick);

  //   return () => gameFrame?.removeEventListener("click", handleClick);
  // }, []);

  useEffect(() => {
    const positionEnemy = () => {
      const gameFrame = document.getElementById("gameFrame");
      const enemy = document.getElementById(`enemy${currentEnemy}`);
      if (!gameFrame || !enemy) return;

      const { clientWidth: frameWidth, clientHeight: frameHeight } = gameFrame;
      enemy.style.position = "absolute";
      enemy.style.width = "70px";
      enemy.style.height = "120px";
      enemy.style.backgroundImage = `url(${enemyImages[currentEnemy % enemyImages.length]})`;
      enemy.style.backgroundSize = "cover";
      enemy.style.backgroundPosition = "center";
      enemy.style.left = `${Math.random() * (frameWidth - 70)}px`;
      enemy.style.top = `${Math.random() * (frameHeight - 120)}px`;
      setSpawnTime(performance.now());
    };

    if (currentEnemy < 9) positionEnemy();
    window.addEventListener("resize", positionEnemy);
    return () => window.removeEventListener("resize", positionEnemy);
  }, [currentEnemy]);

  // const handleClick = useCallback((event: MouseEvent) => {
  //   const gameFrame = document.getElementById("gameFrame");
  //   if (!gameFrame) return;

  //   const rect = gameFrame.getBoundingClientRect();
  //   const bangId = Date.now();
  //   setBangs((prev) => [...prev, { x: event.clientX - rect.left, y: event.clientY - rect.top, id: bangId }]);
  //   setTimeout(() => setBangs((prev) => prev.filter((bang) => bang.id !== bangId)), 250);
  // }, []);

  // useEffect(() => {
  //   const gameFrame = document.getElementById("gameFrame");
  //   gameFrame?.addEventListener("click", handleClick);
  //   return () => gameFrame?.removeEventListener("click", handleClick);
  // }, [handleClick]);

  function iShoot(event: React.MouseEvent) {
    setEnemyHit(true);

    setTimeout(() => {
      setEnemyHit(false);
      setCurrentEnemy((prev) => prev + 1);
    }, 500);

    const enemy = event.currentTarget as HTMLElement;
    enemy.style.transition = "transform 0.5s ease-out, opacity 0.5s ease-out";
    enemy.style.transform = `rotate(${Math.random() * 90}deg) scale(.75) translate(${(Math.random() - 0.75) * 300}px, ${(Math.random() - 0.5) * 500}px)`;
    enemy.style.opacity = "0";

    const reactionTime = performance.now() - spawnTime;
    const enemyRect = enemy.getBoundingClientRect();
    const enemyCenterX = enemyRect.left + enemyRect.width / 2;
    const enemyCenterY = enemyRect.top + enemyRect.height / 2;
    const distance = Math.sqrt(
      Math.pow(event.clientX - enemyCenterX, 2) + Math.pow(event.clientY - enemyCenterY, 2)
    );
    const maxDistance = Math.max(enemyRect.width, enemyRect.height) / 2;
    const accuracyScore = Math.max(0, 50 - (distance / maxDistance) * 50);
    const speedScore = Math.max(0, (1 - reactionTime / 2000) * 50);

    setScore((prev) => prev + Math.round((accuracyScore + speedScore) * 10));
  }

  async function submitScore() {
    // if (nickname.length !== 3) return alert("Nickname must be 3 letters!");
    if (containsBadWord(nickname) && !warning) {
      setWarning("Your nickname contains a bad word. Please consider a different name.");
      return;
    }
    setWarning("");
    const { error } = await supabase.from("scores").insert([{ nickname, score }]);
    if (error) alert("Error submitting score: " + error.message);
    else setSubmitted(true);
  }

  function restartGame() {
    setCurrentEnemy(0);
    setScore(0);
    setSubmitted(false);
    setNickname("");
    setLeaderboard([]);
    setWarning("");
  }

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
        {currentEnemy < 9 ? (
          <>
            <div
              key={currentEnemy}
              id={`enemy${currentEnemy}`}
              className={`${styles.enemy} ${enemyHit ? styles.enemyHit : ""}`}
              onClick={iShoot}
            />
            {bangs.map((bang) => (
              <div
                key={bang.id}
                className={styles.bangMarker}
                style={{
                  left: bang.x - 60,
                  top: bang.y - 60,
                  transform: `rotate(${bang.rotation}deg)`,
                  ...({ "--rotation": `${bang.rotation}deg` } as React.CSSProperties),
                }}
              >
                <Image src={"/bang.png"} height={120} width={120} alt="bang" />
              </div>
            ))}
          </>
        ) : (
          <div className={styles.gameOver}>
            <p>Game Over! 🎯 Final Score: {score}</p>
            <div className={styles.leaderboard}>
              <h2>Leaderboard</h2>
              <div className={styles.leaderboardHeader}>
                <span>Rank</span>
                <span>Name</span>
                <span>Score</span>
              </div>
              <ol className={styles.leaderboardList}>
                {leaderboard.map((entry, index) => (
                  <li
                    key={index}
                    className={`${styles.leaderboardEntry} ${nickname === entry.nickname ? styles.editing : ""}`}
                  >
                    <div className={styles.leaderboardRank}>{index + 1}</div>
                    <div className={styles.leaderboardName}>{formatNickname(entry.nickname)}</div>
                    <div className={styles.leaderboardScore}>{entry.score}</div>
                  </li>
                ))}
              </ol>
            </div>

            {!submitted ? (
              <>
                <input
                  type="text"
                  // maxLength={3}
                  placeholder="Your Name"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value.toUpperCase())}
                />
                {warning && <div className={styles.warning}>{warning}</div>}
                <button className={styles.button} onClick={submitScore}>
                  {warning ? "Submit Anyway" : "Submit Score"}
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
