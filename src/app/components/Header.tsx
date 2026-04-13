import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { id: "home", label: "Home", href: "/" },
  { id: "work", label: "Work", href: "/work" },
  { id: "about", label: "About", href: "/about" },
  { id: "process", label: "Process", href: "/process" },
  { id: "contact", label: "Contact", href: "/contact" },
];

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.contentLeft}>
          <Link href="/" className={styles.logoWrapper}>
            <Image
              className={styles.logoDesktop}
              src="/longWordmark.svg"
              width={326}
              height={20.03}
              alt="Logo"
            />
            <Image
              className={styles.logoMobile}
              src="/top-logo-spacing.svg"
              width={326}
              height={51.03}
              alt="O'Mara Technology"
            />
          </Link>
          <div className={styles.textContainer} />
        </div>
        <div className={styles.contentRight}>
          <nav className={styles.menuWrapper}>
            {NAV_LINKS.map(({ id, label, href }) => (
              <Link
                key={id}
                id={id}
                className={`${styles.menuOption}${id === "contact" ? ` ${styles.contactLink}` : ""}`}
                href={href}
              >
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
