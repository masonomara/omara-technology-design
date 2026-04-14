"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "./components/Header";
import styles from "./not-found.module.css";

export default function NotFound() {
  const router = useRouter();
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      router.push("/");
      return;
    }
    const timer = setTimeout(() => setCount(count - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, router]);

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <h1 className={styles.heading}>404 — Page Not Found</h1>
        <p className={styles.message}>
          Redirecting to homepage in {count}…{" "}
          <Link href="/" className={styles.link}>
            Take me there
          </Link>
        </p>
      </div>
    </>
  );
}
