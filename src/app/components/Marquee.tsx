import Image from "next/image";
import styles from "./Marquee.module.css";

const set = (
  <>
    <span className={styles.title}>Everything changes</span>
    <Image
      className={styles.wave}
      src="/waves-background.svg"
      alt=""
      height={22}
      width={22}
    />
    <span className={styles.title}>Be creative</span>
    <Image
      className={styles.wave}
      src="/waves-background.svg"
      alt=""
      height={22}
      width={22}
    />
    <span className={styles.title}>Explore timeless work</span>
    <Image
      className={styles.wave}
      src="/waves-background.svg"
      alt=""
      height={22}
      width={22}
    />
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
