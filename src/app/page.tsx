"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import styles from "./page.module.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface LeaderboardEntry {
  nickname: string;
  score: number;
}

const enemyImages = ["/canOne.svg", "/canTwo.svg", "/canThree.svg"];
const badWords = ["FAG", "FUCK", "TITS", "CUNT", "8=D", "SHIT", "PISS", "FUCK", "KKK", "COCK", "NIGGER", "NIGGA", "KIKE", "PUSSY", "SLUT", "CRAP", "BITCH"];

export default function Home() {
  const [bangs, setBangs] = useState<{ x: number; y: number; id: number; rotation: number }[]>([]);
  const [currentEnemy, setCurrentEnemy] = useState(0);
  const [score, setScore] = useState(0);
  const [spawnTime, setSpawnTime] = useState(0);
  const [nickname, setNickname] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [warning, setWarning] = useState<string>("");
  const [enemyStates, setEnemyStates] = useState(Array(9).fill(false));
  const [handImage, setHandImage] = useState("/thumbsUp.svg");
  const [gameAction, setGameAction] = useState(false);


  const userScoreRef = useRef<HTMLLIElement | null>(null);

  // autoscrolls to the user's position on the leaderboard
  useEffect(() => {
    if (currentEnemy >= 9 && userScoreRef.current) {
      userScoreRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentEnemy]);

  // checks if a user added a bad word
  const containsBadWord = (nickname: string) => badWords.some((word) => nickname.includes(word));

  // adds the hand change and bang effect whenever a user clicks the frame and where the user clicks the frame
  useEffect(() => {
    const gameFrame = document.getElementById("gameFrameWrapper");
    const handleClick = (event: MouseEvent) => {
      if (!gameFrame) return;
      const rect = gameFrame.getBoundingClientRect();
      const bangId = Date.now() + Math.random();
      const rotation = Math.random() * 20 - 10;
      setBangs((prev) => [...prev, { x: event.clientX - rect.left, y: event.clientY - rect.top, id: bangId, rotation }]);
      setHandImage("/thumbsDown.svg");
      setTimeout(() => setHandImage("/thumbsUp.svg"), 250);
      setTimeout(() => setBangs((prev) => prev.filter((bang) => bang.id !== bangId)), 250);
    };
    gameFrame?.addEventListener("click", handleClick);
    return () => gameFrame?.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (gameAction) {
      setEnemyStates((prev) => prev.map((_, index) => index === currentEnemy));
      setSpawnTime(performance.now());
    }
  }, [currentEnemy, gameAction]);

  // fetches the leaderboard from supabase in order of the player's score
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
  }, [score]);

  // positions the enemies to shoot
  useEffect(() => {
    const positionEnemy = () => {
      const gameFrame = document.getElementById("gameFrame");
      const enemy = document.getElementById(`enemy${currentEnemy}`);
      if (enemy) {
        enemy.classList.remove(styles.upcomingEnemy);
      }
      const handWrapper = document.querySelector("." + styles.handWrapper);
      if (!gameFrame || !enemy || !handWrapper) return;
      const { clientWidth: frameWidth, clientHeight: frameHeight } = gameFrame;
      const handRect = handWrapper.getBoundingClientRect();
      let enemyX, enemyY;
      let overlap;
      do {
        enemyX = Math.random() * (frameWidth - 67);
        enemyY = Math.random() * (frameHeight - 120);
        overlap =
          enemyX < handRect.right &&
          enemyX + 67 > handRect.left &&
          enemyY < handRect.bottom &&
          enemyY + 120 > handRect.top;
      } while (overlap);
      enemy.style.display = "flex"
      enemy.style.position = "absolute";
      enemy.style.width = "clamp(51px, 9.7vw, 67px)";
      enemy.style.height = "clamp(91px, 17.3vw, 120px)";
      enemy.style.backgroundImage = `url(${enemyImages[currentEnemy % enemyImages.length]})`;
      enemy.style.backgroundSize = "contain";
      enemy.style.backgroundPosition = "center";
      enemy.style.left = `${enemyX}px`;
      enemy.style.top = `${enemyY}px`;
      setSpawnTime(performance.now());
    };

    if (gameAction && currentEnemy < 9) positionEnemy();
    window.addEventListener("resize", positionEnemy);
    return () => window.removeEventListener("resize", positionEnemy);
  }, [gameAction, currentEnemy]);

  // hits the enemy, then goes to the next enemy, then scores the user on how they hit the enemy, and then adjusts the score
  function iShoot(event: React.MouseEvent, index: number) {
    setEnemyStates((prev) => prev.map((_, i) => (i === index ? false : prev[i])));
    setCurrentEnemy((prev) => prev + 1);

    const enemy = event.currentTarget as HTMLElement;
    enemy.classList.add(styles.enemyHit);

    setTimeout(() => {
      enemy.classList.remove(styles.enemyHit);
      enemy.classList.add(styles.hidden);
    }, 500);

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
    const accuracyScore = Math.max(0, 50 - (distance / maxDistance) * 33);
    const speedScore = Math.max(0, (1 - reactionTime / 2000) * 67);
    setScore((prev) => prev + Math.round((accuracyScore + speedScore) * 10));
  }

  async function submitScore() {
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
    setBangs([]);
    setHandImage("/thumbsUp.svg");
    setGameAction(true);
    setEnemyStates(Array(9).fill(false));
    setEnemyStates((prev) => prev.map((_, index) => index === 0));
    const allEnemies: NodeListOf<HTMLElement> = document.querySelectorAll(`.${styles.enemy}`);
    allEnemies.forEach((enemy: HTMLElement) => {
      enemy.style.transition = "";
      enemy.style.transform = "";
      enemy.style.opacity = "";
      enemy.style.left = "";
      enemy.style.top = "";
      enemy.style.display = 'none';
      enemy.classList.remove(styles.enemyHit);
      enemy.classList.remove(styles.hidden);
      enemy.classList.remove(styles.active);
      enemy.classList.add(styles.upcomingEnemy);
    });
  }

  function startGame() {
    setGameAction(true);
    setEnemyStates((prev) => prev.map((_, index) => index === 0));
  }

  return (
    <div className={"pageContainer"}>
      <div id="gameFrameWrapper" className={styles.gameFrameWrapper}>
        <div className={styles.scoreWrapper}>
          <div className={`${styles.score} ${currentEnemy === 9 ? styles["hand--gameDone"] : ""}`}>
            {score}<span className={styles.scoreDetails}>points</span>
          </div>
          <div className={`${styles.cans} ${currentEnemy === 9 ? styles["hand--gameDone"] : ""}`}>
            {currentEnemy}/9<span className={styles.scoreDetails}>CANS</span>
          </div>
        </div>

        <div className={styles.handWrapper}>
          <Image
            src={handImage}
            alt="Hand Trigger"
            layout="intrinsic"
            width={450}
            height={438}
            className={`${styles.hand} ${currentEnemy === 9 ? styles["hand--gameDone"] : ""}`}
          />
        </div>
        <div id="gameFrame" className={styles.gameFrame}>
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
              <Image src={"/bang.svg"} height={120} width={120} alt="bang" /> {/* Updated to SVG */}
            </div>
          ))}
          {enemyStates.map((isActive, index) => (
            <div
              key={index}
              id={`enemy${index}`}
              className={`${styles.enemy}`}
              onMouseDown={(e) => iShoot(e, index)}
              style={{ backgroundImage: `url(${enemyImages[index % enemyImages.length]})` }}
            />
          ))}
          <div className={styles.gameOver}>
            <p>Game Over! 🎯 Final Score: {score}</p>

            {/* Show leaderboard if all 9 enemies are shot */}
            {currentEnemy === 9 && (
              <div className={styles.leaderboard}>
                <h2>Leaderboard</h2>
                <div className={styles.leaderboardHeader}>
                  <span>Rank</span>
                  <span>Name</span>
                  <span>Score</span>
                </div>
                <ol className={styles.leaderboardList}>
                  {leaderboard.map((entry, index) => {
                    const isUser = entry.nickname === nickname && entry.score === score;
                    return (
                      <li
                        key={index}
                        ref={isUser ? userScoreRef : null}
                        className={`${styles.leaderboardEntry} ${isUser ? styles.highlight : ""}`}
                      >
                        <div className={styles.leaderboardRank}>{index + 1}</div>
                        <div className={styles.leaderboardName}>{entry.nickname}</div>
                        <div className={styles.leaderboardScore}>{entry.score}</div>
                      </li>
                    );
                  })}
                </ol>
                <>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value.toUpperCase())}
                  />
                  {warning && <div className={styles.warning}>{warning}</div>}
                  <button className={styles.button} onClick={submitScore}>
                    {warning ? "Submit Anyway" : "Submit Score"}
                  </button>
                </>
              </div>
            )}



            {/* If score has been submitted, show confirmation */}
            {submitted && <p>Score submitted! 🎉</p>}

            {/* Restart button */}
            <button onClick={restartGame}>Restart</button>

            {/* Show Start Game button only if game hasn't started */}
            {!gameAction && (
              <button className={styles.button} onClick={startGame}>
                Start Game
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}