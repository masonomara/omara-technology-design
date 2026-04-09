import { Variants } from "framer-motion";

const EASE = [0.25, 0.1, 0.25, 1] as const;

export const staggerContainer = (
  staggerChildren: number = 0.05,
  delayChildren: number = 0,
): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const fadeIn = (
  direction: "left" | "right" | "up" | "down",
  delay: number,
  duration: number,
): Variants => ({
  hidden: {
    x: direction === "left" ? 20 : direction === "right" ? -20 : 0,
    y: direction === "up" ? 20 : direction === "down" ? -20 : 0,
    opacity: 0,
    scale: 0.98,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "tween",
      delay,
      duration,
      ease: EASE,
    },
  },
});

export const fadeInButton = (
  direction: "left" | "right" | "up" | "down",
  delay: number,
  duration: number,
): Variants => ({
  hidden: {
    x: direction === "left" ? 12 : direction === "right" ? -12 : 0,
    y: direction === "up" ? 12 : direction === "down" ? -12 : 0,
    opacity: 0,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type: "tween",
      delay,
      duration,
      ease: EASE,
    },
  },
});

export const textFadeUp = (delay: number, duration: number): Variants => ({
  hidden: {
    y: 24,
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "tween",
      delay,
      duration,
      ease: EASE,
    },
  },
});

export const textFadeUpSmall = (delay: number, duration: number): Variants => ({
  hidden: {
    y: 16,
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "tween",
      delay,
      duration,
      ease: EASE,
    },
  },
});
