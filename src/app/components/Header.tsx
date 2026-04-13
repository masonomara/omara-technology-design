"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { id: "home", label: "Home", href: "/" },
  { id: "work", label: "Work", href: "/work" },
  { id: "about", label: "About", href: "/about" },
  { id: "services", label: "Services", href: "/services" },
  { id: "contact", label: "Contact", href: "/contact" },
];

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const update = () => {
      const height = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty(
        "--header-height",
        `${height}px`,
      );
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles.content}>
        <div className={styles.logoContent}>
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
          <div className={styles.textContainer}>
            Product Design &
            <br />
            Development Studio
          </div>
        </div>
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
    </header>
  );
}
