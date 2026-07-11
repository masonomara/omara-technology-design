import GameLoader from "@/app/components/GameLoader";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.pageContainer}>
      <h1 className="srOnly">
        O’Mara Technology — product design and development studio
      </h1>
      {/* The game's background <video> lives in an ssr:false chunk, so its
          poster isn't in the initial HTML. Preload it here (hoisted to <head>
          by React) so the LCP image is discoverable immediately. */}
      <link
        rel="preload"
        as="image"
        href="/mason-poster.jpg"
        fetchPriority="high"
      />
      <GameLoader />
    </main>
  );
}
