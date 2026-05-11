import GameLoader from "@/app/components/GameLoader";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.pageContainer}>
      <GameLoader />
    </div>
  );
}
