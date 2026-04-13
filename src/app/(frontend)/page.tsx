import Game from "@/app/components/Game";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.pageContainer}>
      <Game />
    </div>
  );
}
