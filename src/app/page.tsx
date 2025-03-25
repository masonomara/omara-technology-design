"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [currentEnemy, setCurrentEnemy] = useState(0);
  const [score, setScore] = useState(0);
  const [spawnTime, setSpawnTime] = useState(0);

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

      // Store spawn time to calculate reaction time later
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

    // Calculate click accuracy (distance from center)
    const maxDistance = Math.sqrt((enemyRect.width / 2) ** 2 + (enemyRect.height / 2) ** 2);
    const clickDistance = Math.sqrt((clickX - centerX) ** 2 + (clickY - centerY) ** 2);
    const accuracyScore = ((maxDistance - clickDistance) / maxDistance) * 50;

    // Calculate reaction speed
    const reactionTime = performance.now() - spawnTime;
    const maxReactionTime = 2000; // 2 seconds for full score
    const speedScore = Math.max(0, (1 - reactionTime / maxReactionTime) * 50);

    // Update score
    setScore((prev) => prev + Math.round(accuracyScore + speedScore));

    // Move to the next enemy
    setCurrentEnemy((prev) => prev + 1);
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
          <p className={styles.gameOver}>Game Over! 🎯 Final Score: {score}</p>
        )}
      </div>
    </div>
  );
}
