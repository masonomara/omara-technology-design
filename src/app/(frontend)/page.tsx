import GameLoader from "@/app/components/GameLoader";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.pageContainer}>
      <h1 className="srOnly">
        O’Mara Technology — product design and development studio
      </h1>
      <GameLoader />
    </div>
  );
}
