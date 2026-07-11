import styles from "./Marquee.module.css";

const set = (
  <>
    <span className={styles.title}>Everything changes</span>
    <span className={styles.wave} aria-hidden="true" />
    <span className={styles.title}>Be creative</span>
    <span className={styles.wave} aria-hidden="true" />
    <span className={styles.title}>Embrace timeless work</span>
    <span className={styles.wave} aria-hidden="true" />
  </>
);

export default function Marquee() {
  return (
    <div className={styles.container}>
      <div className={styles.marquee}>
        {set}
        {set}
        {set}
        {set}
        {set}
        {set}
        {set}
        {set}
        {set}
        {set}
        {set}
        {set}
      </div>
    </div>
  );
}
