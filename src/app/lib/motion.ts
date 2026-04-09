import { Variants } from "framer-motion";

type AnimationType = "spring" | "tween" | "inertia" | "keyframes";

export const staggerContainer = (
  staggerChildren: number = 0.2,
  delayChildren: number = 0.2
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
  type: AnimationType,
  delay: number,
  duration: number
): Variants => ({
  hidden: {
    x: direction === "left" ? 60 : direction === "right" ? -60 : 0,
    y: direction === "up" ? 60 : direction === "down" ? -60 : 0,
    opacity: 0,
    scale: 0.97,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type,
      delay,
      duration,
      bounce: 0,
      ease: [0.17, 0.67, 0.83, 0.67],
    },
  },
});

export const fadeInButton = (
  direction: "left" | "right" | "up" | "down",
  type: AnimationType,
  delay: number,
  duration: number
): Variants => ({
  hidden: {
    x: direction === "left" ? 24 : direction === "right" ? -24 : 0,
    y: direction === "up" ? 24 : direction === "down" ? -24 : 0,
    opacity: 0,
    scale: 0.98,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type,
      delay,
      duration,
      bounce: 0,
      ease: [0.17, 0.67, 0.83, 0.67],
    },
  },
});

export const textFadeUp = (
  _direction: string,
  type: AnimationType,
  delay: number,
  duration: number
): Variants => ({
  hidden: {
    x: 0,
    y: 100,
    opacity: 0,
    scale: 0.98,
    skewY: 2,
    originY: "100%",
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    scale: 1,
    skewY: 0,
    transition: {
      bounce: 0,
      type,
      delay,
      duration,
      ease: [0.17, 0.67, 0.83, 0.67],
    },
  },
});

export const textFadeUpSmall = (
  _direction: string,
  type: AnimationType,
  delay: number,
  duration: number
): Variants => ({
  hidden: {
    x: 0,
    y: 33,
    opacity: 0,
    scale: 0.95,
    originY: "100%",
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      bounce: 0,
      type,
      delay,
      duration,
      ease: [0.17, 0.67, 0.83, 0.67],
    },
  },
});
