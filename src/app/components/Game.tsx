"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import styles from "./../styles/game.module.css";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeIn } from "../lib/motion";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// ─── Types ────────────────────────────────────────────────────────────────────

interface LeaderboardEntry {
  nickname: string;
  score: number;
  user_id: string;
}

interface BangMarker {
  x: number;
  y: number;
  id: number;
  rotation: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ENEMY_COUNT = 9;
const ENEMY_IMAGES = ["/canOne.svg", "/canTwo.svg", "/canThree.svg"];

// Bad words stored base64 so they don't appear as plain text in the source
const BAD_WORDS = atob(
  "RkFHLEZVQ0ssVElUUyxDVU5ULDg9RCxTSElULFBJU1MsS0tLLENPQ0ssTklHR0VSLE5JR0dBLEtJS0UsUFVTU1ksU0xVVCxDUkFQLEJJVENI",
).split(",");

// ─── Helpers ──────────────────────────────────────────────────────────────────

function containsBadWord(name: string): boolean {
  return BAD_WORDS.some((word) => name.includes(word));
}

/**
 * Converts a player's leaderboard position into a human-readable rank label.
 * Returns "Rank not available" if the score isn't yet in the fetched leaderboard
 * (e.g. the player hasn't submitted yet).
 */
function getRankLabel(score: number, leaderboard: LeaderboardEntry[]): string {
  const totalEntries = leaderboard.length;
  const userRank = leaderboard.findIndex((entry) => entry.score === score);

  if (userRank === -1) return "Rank not available";

  const rankPercentage = (userRank / totalEntries) * 100;
  if (rankPercentage <= 0.01) return "Top 0.01%";
  if (rankPercentage <= 0.1) return "Top 0.1%";
  if (rankPercentage <= 1) return "Top 1%";
  if (rankPercentage <= 5) return "Top 5%";
  if (rankPercentage <= 10) return "Top 10%";
  if (rankPercentage <= 25) return "Top 25%";
  if (rankPercentage <= 50) return "Top 50%";
  return "Bottom 50%";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Game() {
  // ── Game flow ──────────────────────────────────────────────────────────────
  const [gameStart, setGameStart] = useState(false); // true once the player has clicked Play at least once
  const [isGameActive, setIsGameActive] = useState(false); // true while enemies are spawning
  const [gameEnd, setGameEnd] = useState(false); // true when all 9 enemies have been shot

  // ── Enemy state ────────────────────────────────────────────────────────────
  const [currentEnemy, setCurrentEnemy] = useState(0); // index of the enemy currently on screen (0–8)
  const [enemyStates, setEnemyStates] = useState(
    Array(ENEMY_COUNT).fill(false),
  ); // which enemy slot is active
  const [spawnTime, setSpawnTime] = useState(0); // performance.now() when the current enemy appeared

  // ── Scoring ────────────────────────────────────────────────────────────────
  const [score, setScore] = useState(0);
  const [shotsTaken, setShotsTaken] = useState(0);
  const [successfulHits, setSuccessfulHits] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(0);
  const [gameEndTime, setGameEndTime] = useState(0);

  // ── Leaderboard & submission ───────────────────────────────────────────────
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [nickname, setNickname] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warning, setWarning] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  // ── UI ─────────────────────────────────────────────────────────────────────
  const [bangs, setBangs] = useState<BangMarker[]>([]); // click-flash markers
  const [handImage, setHandImage] = useState("/thumbsUp.svg"); // swaps to thumbsDown on fire
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Ref used to auto-scroll the leaderboard to the current user's row
  const userScoreRef = useRef<HTMLLIElement | null>(null);

  // ─── Derived display values ──────────────────────────────────────────────────

  const timeTaken = gameEndTime
    ? ((gameEndTime - gameStartTime) / 1000).toFixed(0)
    : "0";
  const accuracy =
    shotsTaken > 0 ? ((successfulHits / shotsTaken) * 100).toFixed(0) : "0";

  // ─── One-time setup ──────────────────────────────────────────────────────────

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

  // ─── Scroll leaderboard to user's row ────────────────────────────────────────

  useEffect(() => {
    if (gameEnd) {
      setTimeout(() => {
        userScoreRef?.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [gameEnd]);

  useEffect(() => {
    if (currentEnemy >= ENEMY_COUNT && userScoreRef.current) {
      userScoreRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentEnemy]);

  // ─── Supabase ────────────────────────────────────────────────────────────────

  async function fetchLeaderboard() {
    const { data, error } = await supabase
      .from("scores")
      .select("*")
      .order("score", { ascending: false });
    if (!error) setLeaderboard(data);
  }

  useEffect(() => {
    if (gameEnd) fetchLeaderboard();
  }, [gameEnd]);

  async function submitScore() {
    if (!nickname.trim()) {
      setWarning("Please enter a nickname before submitting.");
      return;
    }

    if (containsBadWord(nickname)) {
      if (!warning) {
        setWarning(
          "Your nickname contains a bad word. Please consider a different name.",
        );
        return;
      }
    }

    setWarning("");
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("scores")
        .insert([{ nickname, score, user_id: userId }]);

      if (error) {
        console.error("Supabase error:", error);
        alert("Error submitting score: " + error.message);
      } else {
        setSubmitted(true);
        await fetchLeaderboard();
      }
    } catch (err) {
      console.error("Network error:", err);
      alert(
        "Failed to connect to the server. Please check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // ─── Click / bang effect ─────────────────────────────────────────────────────

  // Attach a mousedown listener to the whole game frame so every click (whether
  // it hits an enemy or not) spawns a bang graphic and briefly flips the hand
  useEffect(() => {
    const gameFrame = document.getElementById("gameFrameWrapper");
    if (!gameFrame) return;

    const handleFrameClick = (event: MouseEvent) => {
      if (!isGameActive) return;
      const rect = gameFrame.getBoundingClientRect();
      const bangId = Date.now() + Math.random();
      const rotation = Math.random() * 20 - 10;

      setBangs((prev) => [
        ...prev,
        {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          id: bangId,
          rotation,
        },
      ]);

      // Flip hand to thumbs-down briefly, then back
      setHandImage("/thumbsDown.svg");
      setTimeout(() => setHandImage("/thumbsUp.svg"), 250);

      // Remove this bang marker after its animation finishes
      setTimeout(() => {
        setBangs((prev) => prev.filter((bang) => bang.id !== bangId));
      }, 250);
    };

    gameFrame.addEventListener("mousedown", handleFrameClick);
    return () => gameFrame.removeEventListener("mousedown", handleFrameClick);
  }, [isGameActive]);

  // ─── Enemy spawning ──────────────────────────────────────────────────────────

  // Mark which enemy slot should be active whenever currentEnemy advances
  useEffect(() => {
    if (isGameActive && currentEnemy < ENEMY_COUNT) {
      setEnemyStates((prev) => prev.map((_, index) => index === currentEnemy));
      setSpawnTime(performance.now());
    }
  }, [currentEnemy, isGameActive]);

  // Position the active enemy at a random spot that doesn't overlap the hand or
  // score display. Re-runs on resize so the position stays valid.
  useEffect(() => {
    if (!isGameActive || currentEnemy >= ENEMY_COUNT) return;

    const positionEnemy = () => {
      const gameFrame = document.getElementById("gameFrame");
      const enemy = document.getElementById(`enemy${currentEnemy}`);
      if (!gameFrame || !enemy) return;

      enemy.classList.remove(styles.upcomingEnemy);

      const handWrapper = document.querySelector("." + styles.handWrapper);
      const scoreWrapper = document.querySelector("." + styles.scoreWrapper);
      if (!handWrapper || !scoreWrapper) return;

      const { clientWidth: frameWidth, clientHeight: frameHeight } = gameFrame;
      const frameRect = gameFrame.getBoundingClientRect();

      // Convert a DOMRect from page coords into coords relative to the game frame
      const toFrameCoords = (rect: DOMRect) => ({
        left: rect.left - frameRect.left,
        right: rect.right - frameRect.left,
        top: rect.top - frameRect.top,
        bottom: rect.bottom - frameRect.top,
      });

      const hand = toFrameCoords(handWrapper.getBoundingClientRect());
      const scoreRect = toFrameCoords(scoreWrapper.getBoundingClientRect());

      // Keep re-rolling until we find a position that doesn't overlap the hand
      // or the score display
      let enemyX: number, enemyY: number, overlap: boolean;
      do {
        enemyX = Math.random() * (frameWidth - 67);
        enemyY = Math.random() * (frameHeight - 120);

        const overlapHand =
          enemyX < hand.right &&
          enemyX + 67 > hand.left &&
          enemyY < hand.bottom &&
          enemyY + 120 > hand.top;

        const overlapScore =
          enemyX < scoreRect.right &&
          enemyX + 67 > scoreRect.left &&
          enemyY < scoreRect.bottom &&
          enemyY + 120 > scoreRect.top;

        overlap = overlapHand || overlapScore;
      } while (overlap);

      Object.assign(enemy.style, {
        display: "flex",
        position: "absolute",
        width: "clamp(51px, 9.7vw, 67px)",
        height: "clamp(91px, 17.3vw, 120px)",
        backgroundImage: `url(${ENEMY_IMAGES[currentEnemy % ENEMY_IMAGES.length]})`,
        backgroundSize: "contain",
        left: `${enemyX}px`,
        top: `${enemyY}px`,
      });

      setSpawnTime(performance.now());
    };

    positionEnemy();
    window.addEventListener("resize", positionEnemy);
    return () => window.removeEventListener("resize", positionEnemy);
  }, [isGameActive, currentEnemy]);

  // ─── Shooting ────────────────────────────────────────────────────────────────

  /**
   * Called when the player clicks directly on an enemy element.
   *
   * Score formula:
   *   accuracyScore  = how close to the centre the click landed  (0–50 pts)
   *   speedScore     = how fast the player reacted               (0–100 pts)
   *   total          = (accuracyScore × 1.5 + speedScore) × 10
   *
   * A hit is counted as "successful" when the click lands within 60% of the
   * enemy's radius (accuracyScore > 30).
   */
  const handleEnemyShot = (event: React.MouseEvent, index: number) => {
    setShotsTaken((prev) => prev + 1);

    // Deactivate the enemy that was just shot
    setEnemyStates((prev) =>
      prev.map((_, i) => (i === index ? false : prev[i])),
    );

    // Advance to the next enemy; end the game if this was the last one
    setCurrentEnemy((prev) => {
      const newEnemy = prev + 1;
      if (newEnemy >= ENEMY_COUNT) {
        setIsGameActive(false);
        setGameEnd(true);
        setGameEndTime(performance.now());
      }
      return newEnemy;
    });

    // Animate the enemy flying off screen
    const enemy = event.currentTarget as HTMLElement;
    enemy.classList.add(styles.enemyHit);

    setTimeout(() => {
      enemy.classList.remove(styles.enemyHit);
      enemy.classList.add(styles.hidden);
    }, 500);

    enemy.style.transition =
      "transform 0.5s cubic-bezier(0,0.66,.66,1), opacity 0.5s linear";
    enemy.style.transform = `rotate(${Math.random() * 90}deg) scale(.75) translate(${(Math.random() - 0.75) * 300}px, ${(Math.random() - 0.5) * 500}px)`;
    enemy.style.opacity = "0";
    enemy.style.pointerEvents = "none";

    // ── Score calculation ──────────────────────────────────────────────────
    const reactionTime = performance.now() - spawnTime;
    const enemyRect = enemy.getBoundingClientRect();
    const enemyCenterX = enemyRect.left + enemyRect.width / 2;
    const enemyCenterY = enemyRect.top + enemyRect.height / 2;

    // Distance from click to enemy centre, normalised against the enemy's radius
    const distance = Math.sqrt(
      Math.pow(event.clientX - enemyCenterX, 2) +
        Math.pow(event.clientY - enemyCenterY, 2),
    );
    const maxDistance = Math.max(enemyRect.width, enemyRect.height) / 2;

    const accuracyScore = Math.max(0, 50 - (distance / maxDistance) * 33);
    const speedScore = Math.max(0, (1 - reactionTime / 2000) * 67) * 1.5;

    const hitSuccess = accuracyScore > 30;
    if (hitSuccess) {
      setSuccessfulHits((prev) => prev + 1);
    }

    setScore(
      (prev) => prev + Math.round((accuracyScore * 1.5 + speedScore) * 10),
    );
  };

  // ─── Game lifecycle ──────────────────────────────────────────────────────────

  function startGame() {
    setGameStart(true);
    setIsGameActive(true);
    setGameEnd(false);
    setCurrentEnemy(0);
    setGameStartTime(performance.now());
    setEnemyStates((prev) => prev.map((_, index) => index === 0));
  }

  /**
   * Restarts the game from scratch.
   *
   * This can't just call startGame() because enemy elements are positioned and
   * animated via direct DOM manipulation (not React state), so we have to
   * manually reset their inline styles and class lists here. React owns the
   * reactive state; the DOM manipulation lives outside of it.
   */
  function restartGame() {
    // Reset all React state
    setCurrentEnemy(0);
    setScore(0);
    setSubmitted(false);
    setNickname("");
    setLeaderboard([]);
    setWarning("");
    setBangs([]);
    setHandImage("/thumbsUp.svg");
    setIsGameActive(true);
    setGameStart(true);
    setGameStartTime(performance.now());
    setGameEnd(false);
    setShotsTaken(0);
    setSuccessfulHits(0);
    setGameEndTime(0);
    setEnemyStates(Array(ENEMY_COUNT).fill(false));
    setEnemyStates((prev) => prev.map((_, index) => index === 0));

    // Reset all enemy DOM nodes that were mutated during the previous round
    const allEnemies: NodeListOf<HTMLElement> = document.querySelectorAll(
      `.${styles.enemy}`,
    );
    allEnemies.forEach((enemy: HTMLElement) => {
      enemy.style.transition = "";
      enemy.style.transform = "";
      enemy.style.opacity = "";
      enemy.style.pointerEvents = "";
      enemy.style.left = "";
      enemy.style.top = "";
      enemy.style.display = "none";
      enemy.classList.remove(styles.enemyHit);
      enemy.classList.remove(styles.hidden);
      enemy.classList.remove(styles.active);
      enemy.classList.add(styles.upcomingEnemy);
    });
  }

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div id="gameFrameWrapper" className={styles.gameFrameWrapper}>
      {/* ── Score display (slides up when isGameActive becomes true) ── */}
      <div className={styles.scoreWrapper}>
        <div
          className={`${styles.score} ${gameEnd ? styles["hand--gameDone"] : ""} ${isGameActive ? styles.scoreWrapperActiveOne : ""}`}
        >
          {score}
          <span className={styles.scoreDetails}>POINTS</span>
        </div>
        <div
          className={`${styles.cans} ${gameEnd ? styles["hand--gameDone"] : ""} ${isGameActive ? styles.scoreWrapperActiveTwo : ""}`}
        >
          {currentEnemy}/9
          <span className={styles.scoreDetails}>CANS</span>
        </div>
      </div>

      {/* ── Hand (bottom-right corner, animates in when game starts) ── */}
      <div
        className={`${styles.handWrapper} ${isGameActive ? styles.handWrapperActive : ""}`}
      >
        <Image
          src={handImage}
          alt="Line drawing of hand"
          layout="intrinsic"
          priority
          width={450}
          height={438}
          className={`${styles.hand} ${currentEnemy === ENEMY_COUNT ? styles["hand--gameDone"] : ""} ${handImage === "/thumbsDown.svg" ? styles.thumbsDown : ""}`}
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
            <Image
              src="/bang.svg"
              priority
              height={120}
              width={120}
              alt="Bang"
            />
          </div>
        ))}

        {/* Enemy target slots — positioned by the spawning useEffect above */}
        {enemyStates.map((_isActive, index) => (
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
        {!gameEnd && !isGameActive && !gameStart && (
          <motion.div
            variants={fadeIn("up", 0.05, 0.5)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className={`${styles.startContainer} ${gameStart ? styles.startContainerClose : ""}`}
          >
            <div className={styles.startTopWrapper}>
              <p className={styles.startGameTitle}>Bean Shooter</p>
              <p className={styles.startGameByline}>
                by O&apos;Mara Technology and Design
              </p>
              <p className={styles.startGameType}>a product studio</p>
            </div>
            <div className={styles.buttonWrapper}>
              <button className={styles.primaryButton} onClick={startGame}>
                Play Game
              </button>
              <div className={styles.secondaryButtonWrapper}>
                <Link
                  className={styles.secondaryButton}
                  href="/about"
                  target="_top"
                >
                  <p>About Us</p>
                </Link>
                <Link
                  className={styles.secondaryButton}
                  href="/work"
                  target="_top"
                >
                  <p>View Work</p>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Video background (fades out once the game goes active) ── */}
        <div
          className={`${styles.videoWrapper} ${isGameActive ? styles.videoWrapperClose : ""} ${!videoLoaded ? styles.videoLoading : ""}`}
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
        {gameStart && (
          <div
            className={`${styles.gameOver} ${!gameEnd ? styles.gameOverClose : ""}`}
          >
            <div className={styles.leaderboardContainer}>
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
                  <span className={styles.statsTitle}>
                    {accuracy}% accuracy
                  </span>
                </div>
                <div className={styles.statsDivider} />
                <div className={styles.statsWrapper}>
                  <span className={styles.statsTitle}>
                    {getRankLabel(score, leaderboard)}
                  </span>
                </div>
              </div>

              {/* Leaderboard */}
              <div className={styles.leaderboardHeader}>
                <span>Rank</span>
                <span>Name</span>
                <span>Score</span>
              </div>
              <ol className={styles.leaderboardList}>
                {leaderboard.map((entry, index) => {
                  const isCurrentUser = entry.user_id === userId;
                  return (
                    <li
                      key={index}
                      ref={isCurrentUser ? userScoreRef : null}
                      className={`${styles.leaderboardEntry} ${isCurrentUser ? styles.highlight : ""}`}
                    >
                      <div className={styles.leaderboardRank}>{index + 1}</div>
                      <div
                        className={styles.leaderboardName}
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
                      <div className={styles.leaderboardScore}>
                        {entry.score}
                      </div>
                    </li>
                  );
                })}
              </ol>

              {/* Nickname input / thank-you message */}
              {submitted ? (
                <div className={styles.inputThankYou}>Score submitted!</div>
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
                  {warning ? (
                    <div className={styles.warning}>{warning}</div>
                  ) : (
                    <div className={styles.warning}>Enter your nickname</div>
                  )}
                </>
              )}

              {/* Action buttons */}
              <div className={styles.endButtonWrapper}>
                {!submitted && (
                  <button
                    className={styles.primaryButton}
                    onClick={submitScore}
                    disabled={!nickname.trim() || isSubmitting}
                  >
                    <p>{warning ? "Submit Anyway" : "Submit Score"}</p>
                  </button>
                )}
                <button onClick={restartGame} className={styles.primaryButton}>
                  <p>Play Again</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
