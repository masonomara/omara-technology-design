"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeIn } from "../lib/motion";
import { useGameState, ENEMY_COUNT } from "../hooks/useGameState";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { getEnemyPosition, toFrameCoords } from "../lib/enemyPosition";
import Leaderboard from "./Leaderboard";
import styles from "./Game.module.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const ENEMY_IMAGES = ["/canOne.svg", "/canTwo.svg", "/canThree.svg"];

// ─── Types ────────────────────────────────────────────────────────────────────

interface BangMarker {
  x: number;
  y: number;
  id: number;
  rotation: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Game() {
  const game = useGameState();
  const lb = useLeaderboard(game.gameEnd);

  const [bangs, setBangs] = useState<BangMarker[]>([]);
  const [handImage, setHandImage] = useState("/thumbsUp.svg");
  const [videoLoaded, setVideoLoaded] = useState(false);

  // ─── Click / bang effect ─────────────────────────────────────────────────────

  // Attach a mousedown listener to the whole game frame so every click (whether
  // it hits an enemy or not) spawns a bang graphic and briefly flips the hand
  useEffect(() => {
    const gameFrame = document.getElementById("gameFrameWrapper");
    if (!gameFrame) return;

    const handleFrameClick = (event: MouseEvent) => {
      if (!game.isGameActive) return;
      const rect = gameFrame.getBoundingClientRect();
      const bangId = Date.now() + Math.random();
      const rotation = Math.random() * 20 - 10;

      setBangs((prev) => [
        ...prev,
        { x: event.clientX - rect.left, y: event.clientY - rect.top, id: bangId, rotation },
      ]);

      setHandImage("/thumbsDown.svg");
      setTimeout(() => setHandImage("/thumbsUp.svg"), 250);

      setTimeout(() => {
        setBangs((prev) => prev.filter((bang) => bang.id !== bangId));
      }, 250);
    };

    gameFrame.addEventListener("mousedown", handleFrameClick);
    return () => gameFrame.removeEventListener("mousedown", handleFrameClick);
  }, [game.isGameActive]);

  // ─── Enemy spawning ──────────────────────────────────────────────────────────

  // Mark which enemy slot is active whenever currentEnemy advances
  useEffect(() => {
    if (game.isGameActive && game.currentEnemy < ENEMY_COUNT) {
      // enemyStates is already updated by the hook; this effect triggers positioning
    }
  }, [game.currentEnemy, game.isGameActive]);

  // Position the active enemy at a random spot that doesn't overlap the hand or
  // score display. Re-runs on resize so the position stays valid.
  useEffect(() => {
    if (!game.isGameActive || game.currentEnemy >= ENEMY_COUNT) return;

    const positionEnemy = () => {
      const gameFrame = document.getElementById("gameFrame");
      const enemy = document.getElementById(`enemy${game.currentEnemy}`);
      if (!gameFrame || !enemy) return;

      enemy.classList.remove(styles.upcomingEnemy);

      const handWrapper = document.querySelector("." + styles.handWrapper);
      const scoreWrapper = document.querySelector("." + styles.scoreWrapper);
      if (!handWrapper || !scoreWrapper) return;

      const { clientWidth: frameWidth, clientHeight: frameHeight } = gameFrame;
      const frameRect = gameFrame.getBoundingClientRect();

      const avoidRects = [
        toFrameCoords(handWrapper.getBoundingClientRect(), frameRect),
        toFrameCoords(scoreWrapper.getBoundingClientRect(), frameRect),
      ];

      const { x: enemyX, y: enemyY } = getEnemyPosition(
        frameWidth,
        frameHeight,
        67,
        120,
        avoidRects,
      );

      Object.assign(enemy.style, {
        display: "flex",
        position: "absolute",
        width: "clamp(51px, 9.7vw, 67px)",
        height: "clamp(91px, 17.3vw, 120px)",
        backgroundImage: `url(${ENEMY_IMAGES[game.currentEnemy % ENEMY_IMAGES.length]})`,
        backgroundSize: "contain",
        left: `${enemyX}px`,
        top: `${enemyY}px`,
      });

      game.markEnemySpawned();
    };

    positionEnemy();
    window.addEventListener("resize", positionEnemy);
    return () => window.removeEventListener("resize", positionEnemy);
  }, [game.isGameActive, game.currentEnemy]);

  // ─── Shooting ────────────────────────────────────────────────────────────────

  const handleEnemyShot = (event: React.MouseEvent, index: number) => {
    const enemy = event.currentTarget as HTMLElement;

    // Animate the enemy flying off screen
    enemy.classList.add(styles.enemyHit);
    setTimeout(() => {
      enemy.classList.remove(styles.enemyHit);
      enemy.classList.add(styles.hidden);
    }, 500);
    enemy.style.transition = "transform 0.5s cubic-bezier(0,0.66,.66,1), opacity 0.5s linear";
    enemy.style.transform = `rotate(${Math.random() * 90}deg) scale(.75) translate(${(Math.random() - 0.75) * 300}px, ${(Math.random() - 0.5) * 500}px)`;
    enemy.style.opacity = "0";
    enemy.style.pointerEvents = "none";

    // Delegate all state updates + score calculation to the hook
    game.recordShot(event.clientX, event.clientY, enemy.getBoundingClientRect(), index);
  };

  // ─── Restart ─────────────────────────────────────────────────────────────────

  // Resetting a game requires both state resets (handled by the hook) and DOM resets
  // (handled here, because the enemy elements are mutated directly during play).
  function handleRestart() {
    // Reset all enemy DOM nodes that were mutated during the previous round
    const allEnemies = document.querySelectorAll<HTMLElement>(`.${styles.enemy}`);
    allEnemies.forEach((enemy) => {
      enemy.style.transition = "";
      enemy.style.transform = "";
      enemy.style.opacity = "";
      enemy.style.pointerEvents = "";
      enemy.style.left = "";
      enemy.style.top = "";
      enemy.style.display = "none";
      enemy.classList.remove(styles.enemyHit, styles.hidden, styles.active);
      enemy.classList.add(styles.upcomingEnemy);
    });

    lb.reset();
    game.resetGameState();
    setBangs([]);
    setHandImage("/thumbsUp.svg");
  }

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div id="gameFrameWrapper" className={styles.gameFrameWrapper}>
      {/* ── Score display (slides up when isGameActive becomes true) ── */}
      <div className={styles.scoreWrapper}>
        <div
          className={`${styles.score} ${game.isGameActive ? styles.scoreWrapperActiveOne : ""}`}
        >
          {game.score}
          <span className={styles.scoreDetails}>POINTS</span>
        </div>
        <div
          className={`${styles.cans} ${game.isGameActive ? styles.scoreWrapperActiveTwo : ""}`}
        >
          {game.currentEnemy}/9
          <span className={styles.scoreDetails}>CANS</span>
        </div>
      </div>

      {/* ── Hand (bottom-right corner, animates in when game starts) ── */}
      <div className={`${styles.handWrapper} ${game.isGameActive ? styles.handWrapperActive : ""}`}>
        <Image
          src={handImage}
          alt="Line drawing of hand"
          priority
          width={450}
          height={438}
          className={`${styles.hand} ${handImage === "/thumbsDown.svg" ? styles.thumbsDown : ""}`}
        />
      </div>

      {/* ── Main game frame (enemies, bangs, overlays, modals all live here) ── */}
      <div id="gameFrame" className={styles.gameFrame}>
        {/* Bang markers — appear at click position and animate out */}
        {bangs.map((bang) => (
          <div
            key={bang.id}
            className={styles.bangMarker}
            style={
              {
                left: bang.x - 60,
                top: bang.y - 60,
                transform: `rotate(${bang.rotation}deg)`,
                "--rotation": `${bang.rotation}deg`,
              } as React.CSSProperties
            }
          >
            <Image src="/bang.svg" priority height={120} width={120} alt="Bang" />
          </div>
        ))}

        {/* Enemy target slots — positioned by the spawning useEffect above */}
        {game.enemyStates.map((_isActive, index) => (
          <div
            key={index}
            id={`enemy${index}`}
            className={styles.enemy}
            onMouseDown={(e) => handleEnemyShot(e, index)}
            style={{
              backgroundImage: `url(${ENEMY_IMAGES[index % ENEMY_IMAGES.length]})`,
            }}
          />
        ))}

        {/* ── Start screen (visible before the first game begins) ── */}
        {!game.gameEnd && !game.isGameActive && !game.gameStart && (
          <motion.div
            variants={fadeIn("up", 0.05, 0.5)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className={`${styles.startContainer} ${game.gameStart ? styles.startContainerClose : ""}`}
          >
            <div className={styles.startTopWrapper}>
              <img
                src="/wordmark.svg"
                className={styles.startWordmark}
                alt="O'Mara Technology Design"
              />
              <p className={styles.startTagline}>
                Product design and development studio for apps, websites, and
                software.
              </p>
            </div>
            <div className={styles.buttonWrapper}>
              <button className={styles.primaryButton} onClick={game.startGame}>
                Play Game
              </button>
              <div className={styles.secondaryButtonWrapper}>
                <Link className={styles.secondaryButton} href="/about" target="_top">
                  <p>About Us</p>
                </Link>
                <Link className={styles.secondaryButton} href="/work" target="_top">
                  <p>View Work</p>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Video background (fades out once the game goes active) ── */}
        <div
          className={`${styles.videoWrapper} ${game.isGameActive ? styles.videoWrapperClose : ""} ${!videoLoaded ? styles.videoLoading : ""}`}
        >
          <div className={styles.videoScreenOverlay} />
          <div className={styles.videoMultiplyOverlay} />
          <video
            width="320"
            height="240"
            poster="/mason-poster.jpg"
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
            onCanPlayThrough={() => setVideoLoaded(true)}
            className={styles.videoSource}
          >
            <source src="/mason.webm" type="video/webm" />
            <source src="/mason.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* ── Game over screen (fades in after the last enemy is shot) ── */}
        {game.gameStart && (
          <div
            className={`${styles.gameOver} ${!game.gameEnd ? styles.gameOverClose : ""}`}
          >
            <Leaderboard
              score={game.score}
              timeTaken={game.timeTaken}
              accuracy={game.accuracy}
              leaderboard={lb.leaderboard}
              userId={lb.userId}
              submitted={lb.submitted}
              isSubmitting={lb.isSubmitting}
              onSubmitScore={lb.submitScore}
              onPlayAgain={handleRestart}
            />
          </div>
        )}
      </div>
    </div>
  );
}
