"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import styles from "./../page.module.css";
import { v4 as uuidv4 } from "uuid";


// Initialize Supabase client with environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface LeaderboardEntry {
  nickname: string;
  score: number;
  user_id: string;
}

// Enemy images and bad words list for filtering nicknames
const enemyImages = ["/canOne.svg", "/canTwo.svg", "/canThree.svg"];
const badWords = ["FAG", "FUCK", "TITS", "CUNT", "8=D", "SHIT", "PISS", "FUCK", "KKK", "COCK", "NIGGER", "NIGGA", "KIKE", "PUSSY", "SLUT", "CRAP", "BITCH"];

export default function Home() {
  // State variables for game logic
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
  const [gameStart, setGameStart] = useState(false);
  const [gameAction, setGameAction] = useState(false);
  const [gameEnd, setGameEnd] = useState(false);

  const [gameStartTime, setGameStartTime] = useState(0);
  const [gameEndTime, setGameEndTime] = useState(0);
  const [shotsTaken, setShotsTaken] = useState(0);
  const [successfulHits, setSuccessfulHits] = useState(0);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    let storedId = localStorage.getItem("userId");
    if (!storedId) {
      storedId = uuidv4();
      localStorage.setItem("userId", storedId);
    }
    setUserId(storedId);
  }, []);

  const userScoreRef = useRef<HTMLLIElement | null>(null);


  useEffect(() => {
    if (gameEnd) {
      setTimeout(() => {
        console.log("Scrolling to user score...");
        userScoreRef?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100); // Optional delay
    }
  }, [gameEnd]);


  // Auto-scroll to user's leaderboard position when game ends
  useEffect(() => {
    if (currentEnemy >= 9 && userScoreRef.current) {
      console.log("Scrolling to user score...");
      userScoreRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentEnemy]);

  // Function to check if a nickname contains banned words
  const containsBadWord = (nickname: string) => {
    return badWords.some((word) => nickname.includes(word));
  };

  // Fetch leaderboard from Supabase, sort by highest score
  const fetchLeaderboard = useCallback(async () => {
    console.log("Fetching leaderboard...");
    const { data, error } = await supabase.from("scores").select("*").order("score", { ascending: false });
    if (!error) {
      if (score > 0) {
        data.push({ nickname, score });
        data.sort((a, b) => b.score - a.score);
      }
      setLeaderboard(data);
      console.log("Leaderboard updated", data);
    } else {
      console.error("Error fetching leaderboard:", error);
    }
  }, [score, nickname]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  async function submitScore() {
    if (!nickname.trim()) {
      setWarning("Please enter a nickname before submitting.");
      return;
    }

    if (containsBadWord(nickname) && !warning) {
      setWarning("Your nickname contains a bad word. Please consider a different name.");
      return;
    }

    setWarning("");
    console.log("Submitting score for", nickname);
    const { error } = await supabase.from("scores").insert([{ nickname, score, user_id: userId }]);
    if (error) alert("Error submitting score: " + error.message);
    else setSubmitted(true);
  }




  // Handles user clicking on the game frame
  useEffect(() => {
    const gameFrame = document.getElementById("gameFrameWrapper");
    if (!gameFrame) return;

    const handleClick = (event: MouseEvent) => {
      if (!gameAction) return; // Prevents clicks before game starts
      console.log("User clicked on game frame at:", event.clientX, event.clientY);
      const rect = gameFrame.getBoundingClientRect();
      const bangId = Date.now() + Math.random();
      const rotation = Math.random() * 20 - 10;
      setBangs((prev) => [...prev, { x: event.clientX - rect.left, y: event.clientY - rect.top, id: bangId, rotation }]);
      setHandImage("/thumbsDown.svg");
      setTimeout(() => setHandImage("/thumbsUp.svg"), 250);
      setTimeout(() => {
        setBangs((prev) => prev.filter((bang) => bang.id !== bangId));
      }, 250);
    };

    gameFrame.addEventListener("click", handleClick);
    return () => gameFrame.removeEventListener("click", handleClick);
  }, [gameAction]);



  // Spawns an enemy
  useEffect(() => {
    if (gameAction && currentEnemy < 9) {
      setEnemyStates((prev) => prev.map((_, index) => index === currentEnemy));
      setSpawnTime(performance.now());
    }
  }, [currentEnemy, gameAction]);



  // Positions the enemies to shoot
  useEffect(() => {
    if (!gameAction || currentEnemy >= 9) return;

    const positionEnemy = () => {
      const gameFrame = document.getElementById("gameFrame");
      const enemy = document.getElementById(`enemy${currentEnemy}`);
      if (!gameFrame || !enemy) return;

      enemy.classList.remove(styles.upcomingEnemy);
      const handWrapper = document.querySelector("." + styles.handWrapper);
      const scoreWrapper = document.querySelector("." + styles.scoreWrapper);

      if (!gameFrame || !enemy || !handWrapper || !scoreWrapper) return;
      const { clientWidth: frameWidth, clientHeight: frameHeight } = gameFrame;
      const handRect = handWrapper.getBoundingClientRect();
      const scoreRect = scoreWrapper.getBoundingClientRect();
      let enemyX, enemyY, overlap;
      do {
        enemyX = Math.random() * (frameWidth - 67);
        enemyY = Math.random() * (frameHeight - 120);
        overlap =
          enemyX < handRect.right &&
          enemyX + 67 > handRect.left &&
          enemyY < handRect.bottom &&
          enemyY + 120 > handRect.top &&
          enemyX < scoreRect.right &&
          enemyX + 67 > scoreRect.left &&
          enemyY < scoreRect.bottom &&
          enemyY + 120 > scoreRect.top;
      } while (overlap);

      Object.assign(enemy.style, {
        display: "flex",
        position: "absolute",
        width: "clamp(51px, 9.7vw, 67px)",
        height: "clamp(91px, 17.3vw, 120px)",
        backgroundImage: `url(${enemyImages[currentEnemy % enemyImages.length]})`,
        backgroundSize: "contain",
        left: `${enemyX}px`,
        top: `${enemyY}px`,
      });

      setSpawnTime(performance.now());
    };

    positionEnemy();
    window.addEventListener("resize", positionEnemy);
    return () => window.removeEventListener("resize", positionEnemy);
  }, [gameAction, currentEnemy]);

  // Hits the enemy, then goes to the next enemy, then scores the user on how they hit the enemy, and then adjusts the score
  const iShoot = (event: React.MouseEvent, index: number) => {
    setShotsTaken(prev => prev + 1); // Increment shots taken
    setEnemyStates((prev) => prev.map((_, i) => (i === index ? false : prev[i])));
    setCurrentEnemy((prev) => {
      const newEnemy = prev + 1;
      if (newEnemy >= 9) {
        setGameAction(false);
        setGameEnd(true);
        setGameEndTime(performance.now()); // Game ends, record the end time
      }
      return newEnemy;
    });

    const enemy = event.currentTarget as HTMLElement;
    enemy.classList.add(styles.enemyHit);

    setTimeout(() => {
      enemy.classList.remove(styles.enemyHit);
      enemy.classList.add(styles.hidden);
    }, 500);

    enemy.style.transition = "transform 0.5s cubic-bezier(0,0.66,.66,1), opacity 0.5s linear";
    enemy.style.transform = `rotate(${Math.random() * 90}deg) scale(.75) translate(${(Math.random() - 0.75) * 300}px, ${(Math.random() - 0.5) * 500}px)`;
    enemy.style.opacity = "0";
    enemy.style.pointerEvents = "none";

    const reactionTime = performance.now() - spawnTime;
    const enemyRect = enemy.getBoundingClientRect();
    const enemyCenterX = enemyRect.left + enemyRect.width / 2;
    const enemyCenterY = enemyRect.top + enemyRect.height / 2;
    const distance = Math.sqrt(
      Math.pow(event.clientX - enemyCenterX, 2) + Math.pow(event.clientY - enemyCenterY, 2)
    );
    const maxDistance = Math.max(enemyRect.width, enemyRect.height) / 2;
    const accuracyScore = Math.max(0, 50 - (distance / maxDistance) * 33);
    const speedScore = (Math.max(0, (1 - reactionTime / 2000) * 67) * 1.5);
    const hitSuccess = accuracyScore > 30; // if accuracy is greater than 30, it's considered a hit
    if (hitSuccess) {
      setSuccessfulHits(prev => prev + 1); // Increment successful hits
    }
    setScore((prev) => prev + Math.round(((accuracyScore * 1.5) + speedScore) * 10));
  }

  // Restarts game
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
    setGameStartTime(performance.now()); // Add this line to record new start time
    setGameEnd(false);
    setEnemyStates(Array(9).fill(false));
    setEnemyStates((prev) => prev.map((_, index) => index === 0));
    const allEnemies: NodeListOf<HTMLElement> = document.querySelectorAll(`.${styles.enemy}`);
    allEnemies.forEach((enemy: HTMLElement) => {
      enemy.style.transition = "";
      enemy.style.transform = "";
      enemy.style.opacity = "";
      enemy.style.pointerEvents = "";
      enemy.style.left = "";
      enemy.style.top = "";
      enemy.style.display = 'none';
      enemy.classList.remove(styles.enemyHit);
      enemy.classList.remove(styles.hidden);
      enemy.classList.remove(styles.active);
      enemy.classList.add(styles.upcomingEnemy);
    });
  }

  // Starts game
  function startGame() {
    setGameStart(true);
    setGameAction(true);
    setGameEnd(false);
    setCurrentEnemy(0);
    setGameStartTime(performance.now()); // Add this line to record start time
    setEnemyStates((prev) => prev.map((_, index) => index === 0));
  }

  const timeTaken = gameEndTime ? ((gameEndTime - gameStartTime) / 1000).toFixed(0) : "0"; // Time in seconds
  const accuracy = shotsTaken > 0 ? ((successfulHits / shotsTaken) * 100).toFixed(0) : "0"; // Accuracy as a percentage

  return (
    <div className="pageContainer">
      <div id="gameFrameWrapper" className={styles.gameFrameWrapper}>
        <div className={styles.scoreWrapper}>
          <div className={`${styles.score} ${gameEnd ? styles["hand--gameDone"] : ""} ${gameAction ? styles.scoreWrapperActiveOne : ""}`}>
            {score}
            <span className={styles.scoreDetails}>POINTS</span>
          </div>
          <div className={`${styles.cans} ${gameEnd ? styles["hand--gameDone"] : ""} ${gameAction ? styles.scoreWrapperActiveTwo : ""}`}>
            {currentEnemy}/9
            <span className={styles.scoreDetails}>CANS</span>
          </div>
        </div>

        <div className={`${styles.handWrapper} ${gameAction ? styles.handWrapperActive : ""}`}>
          <Image
            src={handImage}
            alt="Hand Trigger"
            layout="intrinsic"
            width={450}
            height={438}
            className={`${styles.hand} ${currentEnemy === 9 ? styles["hand--gameDone"] : ""} ${handImage === "/thumbsDown.svg" ? styles.thumbsDown : ""}`}
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
                "--rotation": `${bang.rotation}deg`,
              } as React.CSSProperties
              }
            >
              <Image src="/bang.svg" height={120} width={120} alt="bang" />
            </div>
          ))}

          {enemyStates.map((isActive, index) => (
            <div
              key={index}
              id={`enemy${index}`}
              className={styles.enemy}
              onMouseDown={(e) => iShoot(e, index)}
              style={{ backgroundImage: `url(${enemyImages[index % enemyImages.length]})` }}
            />
          ))}

          {/* Show Start Game button only if game hasn't started */}
          {!gameEnd &&
            (<div className={`${styles.startContainer} ${gameStart ? styles.startContainerClose : ""}`}>
              <div className={styles.startTopWrapper}>
                <Image src="/wordmark.svg" height={167} width={463} alt="bang" className={styles.startLogo} />
                <p className={styles.startDescription}>
                  Fractional business & technology strategy, design, and development
                </p>
              </div>
              {/* <div className={styles.startDivider} /> */}
              <div className={styles.startButtonWrapper}>
                <button className={styles.primaryButton} onClick={startGame}>
                  <p>Start Game</p>
                  {/* <Image src="/redArrow.svg" height={11.4} width={7.03} alt="start" /> */}
                </button>
                <button className={styles.primaryButton} onClick={startGame}>
                  <p>Contact US</p>
                  {/* <Image src="/redArrow.svg" height={11.4} width={7.03} alt="start" /> */}

                </button>
              </div>
            </div>)
          }


          <div className={`${styles.videoWrapper} ${gameAction ? styles.videoWrapperClose : ""}`}>
            <div className={styles.videoScreenOverlay} />
            <div className={styles.videoMultiplyOverlay} />
            <video width="320" height="240" autoPlay muted playsInline loop preload="none" className={styles.videoSource}>
              <source src="/mason.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>


          {gameStart &&
            <div className={`${styles.gameOver} ${!gameEnd ? styles.gameOverClose : ""}`}>
              <div className={styles.leaderboardContainer}>

                <span className={styles.trophyScore}>{score}<span className={styles.scoreDetails}>points!</span></span>
                <div className={styles.statsContainer}>
                  <div className={styles.statsWrapper}>
                    <span className={styles.statsTitle} >{timeTaken} seconds</span>
                  </div>
                  <div className={styles.statsDivider} />
                  <div className={styles.statsWrapper}>
                    <span className={styles.statsTitle}>{accuracy}% accuracy</span>
                  </div>
                  <div className={styles.statsDivider} />
                  <div className={styles.statsWrapper}>
                    <span className={styles.statsTitle}>
                      {(() => {
                        const totalEntries = leaderboard.length;
                        const userRank = leaderboard.findIndex(entry => entry.score === score);

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
                      })()}
                    </span>
                  </div>
                </div>

                <div className={styles.leaderboardHeader}>
                  <span>Rank</span>
                  <span>Name</span>
                  <span>Score</span>
                </div>
                <ol className={styles.leaderboardList}>
                  {leaderboard.map((entry, index) => {
                    const isUser = entry.score === score;
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
                {submitted ? (
                  <p>Score submitted! 🎉</p>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Nickname"
                      className={styles.input}
                      value={nickname}
                      onChange={(e) => {
                        setNickname(e.target.value.toUpperCase());
                        if (warning) setWarning("");
                      }} />
                    {warning ? (<div className={styles.warning}>{warning}</div>) : (<div className={styles.warning}>Enter your nickname</div>)}
                    <div className={styles.endButtonWrapper}>
                      <button className={styles.primaryButton} onClick={submitScore}>
                        <p>{warning ? "Submit Anyway" : "Submit Score"}</p>
                      </button>
                      <button onClick={restartGame} className={styles.primaryButton}>
                        <p>Restart Game</p>
                      </button>
                    </div>
                  </>
                )}
              </div>

            </div>
          }
        </div>
      </div>
    </div >
  );
}
