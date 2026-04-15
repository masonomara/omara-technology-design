"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "../lib/constants";
import styles from "./Header.module.css";

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const update = () => {
      const height = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--header-height", `${height}px`);
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
          {NAV_LINKS.map(({ id, label, href }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={id}
                id={id}
                className={`${styles.menuOption}${id === "contact" ? ` ${styles.contactLink}` : ""}${isActive ? ` ${styles.menuOptionActive}` : ""}`}
                href={href}
              >
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
