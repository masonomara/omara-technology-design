"use client";

import { useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

export const ENEMY_COUNT = 9;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GameState {
  gameStart: boolean;
  isGameActive: boolean;
  gameEnd: boolean;
  currentEnemy: number;
  enemyStates: boolean[];
  spawnTime: number;
  score: number;
  shotsTaken: number;
  successfulHits: number;
  gameStartTime: number;
  gameEndTime: number;
  timeTaken: string;
  accuracy: string;
}

export interface GameActions {
  startGame: () => void;
  resetGameState: () => void;
  recordShot: (clickX: number, clickY: number, enemyRect: DOMRect, index: number) => void;
  markEnemySpawned: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGameState(): GameState & GameActions {
  const [gameStart, setGameStart] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameEnd, setGameEnd] = useState(false);
  const [currentEnemy, setCurrentEnemy] = useState(0);
  const [enemyStates, setEnemyStates] = useState<boolean[]>(Array(ENEMY_COUNT).fill(false));
  const [spawnTime, setSpawnTime] = useState(0);
  const [score, setScore] = useState(0);
  const [shotsTaken, setShotsTaken] = useState(0);
  const [successfulHits, setSuccessfulHits] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(0);
  const [gameEndTime, setGameEndTime] = useState(0);

  const timeTaken = gameEndTime
    ? ((gameEndTime - gameStartTime) / 1000).toFixed(0)
    : "0";

  const accuracy =
    shotsTaken > 0 ? ((successfulHits / shotsTaken) * 100).toFixed(0) : "0";

  function startGame() {
    setGameStart(true);
    setIsGameActive(true);
    setGameEnd(false);
    setCurrentEnemy(0);
    setGameStartTime(performance.now());
    setEnemyStates(Array(ENEMY_COUNT).fill(false).map((_, i) => i === 0));
  }

  function resetGameState() {
    setCurrentEnemy(0);
    setScore(0);
    setShotsTaken(0);
    setSuccessfulHits(0);
    setGameStartTime(performance.now());
    setGameEndTime(0);
    setSpawnTime(0);
    setGameEnd(false);
    setGameStart(true);
    setIsGameActive(true);
    setEnemyStates(Array(ENEMY_COUNT).fill(false).map((_, i) => i === 0));
  }

  function markEnemySpawned() {
    setSpawnTime(performance.now());
  }

  function recordShot(clickX: number, clickY: number, enemyRect: DOMRect, index: number) {
    setShotsTaken((prev) => prev + 1);

    setEnemyStates((prev) => prev.map((_, i) => (i === index ? false : prev[i])));

    setCurrentEnemy((prev) => {
      const next = prev + 1;
      if (next >= ENEMY_COUNT) {
        setIsGameActive(false);
        setGameEnd(true);
        setGameEndTime(performance.now());
      }
      return next;
    });

    // Score calculation:
    //   accuracyScore  = how close to centre the click landed  (0–50 pts)
    //   speedScore     = reaction time, normalised             (0–100 pts)
    //   total          = (accuracyScore × 1.5 + speedScore) × 10
    const reactionTime = performance.now() - spawnTime;
    const centerX = enemyRect.left + enemyRect.width / 2;
    const centerY = enemyRect.top + enemyRect.height / 2;
    const distance = Math.sqrt(
      Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2),
    );
    const maxDistance = Math.max(enemyRect.width, enemyRect.height) / 2;
    const accuracyScore = Math.max(0, 50 - (distance / maxDistance) * 33);
    const speedScore = Math.max(0, (1 - reactionTime / 2000) * 67) * 1.5;

    if (accuracyScore > 30) {
      setSuccessfulHits((prev) => prev + 1);
    }

    setScore((prev) => prev + Math.round((accuracyScore * 1.5 + speedScore) * 10));
  }

  return {
    gameStart,
    isGameActive,
    gameEnd,
    currentEnemy,
    enemyStates,
    spawnTime,
    score,
    shotsTaken,
    successfulHits,
    gameStartTime,
    gameEndTime,
    timeTaken,
    accuracy,
    startGame,
    resetGameState,
    markEnemySpawned,
    recordShot,
  };
}
