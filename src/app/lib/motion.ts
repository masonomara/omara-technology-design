import { Variants } from "framer-motion";

export const navVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -50,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 140,
    },
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      delay: 1,
    },
  },
};

export const slideIn = (
  direction: "left" | "right" | "up" | "down",
  type: string,
  delay: number,
  duration: number
): Variants => ({
  hidden: {
    x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
    y: direction === "up" ? "100%" : direction === "down" ? "100%" : 0,
  },
  show: {
    x: 0,
    y: 0,
    transition: {
      type,
      delay,
      duration,
      ease: "easeOut",
    },
  },
});

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

export const textVariant = (delay: number): Variants => ({
  hidden: {
    y: 50,
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 1,
      delay,
    },
  },
});

export const textContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  show: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.01, delayChildren: i * 0.0 },
  }),
};

export const grow: Variants = {
  hidden: {
    width: "0px",
  },
  show: {
    width: "100%",
  },
};

export const growDown: Variants = {
  hidden: {
    height: "0px",
  },
  show: {
    height: "calc(100% - 24px)",
    transition: {
      type: "spring",
      delay: 0,
      duration: 1.6,
      bounce: 0,
      ease: [0.17, 0.67, 0.83, 0.67],
    },
  },
};

export const growDownSub = growDown;

export const growRight: Variants = {
  hidden: {
    width: "0px",
  },
  show: {
    width: "50%",
    transition: {
      type: "spring",
      delay: 1.6,
      duration: 0.8,
      bounce: 0,
      ease: [0.17, 0.67, 0.83, 0.67],
    },
  },
};

export const textVariant2: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "tween",
      ease: "easeIn",
    },
  },
};

export const fade = (
  type: string,
  delay: number,
  duration: number,
  opacity: number
): Variants => ({
  hidden: {
    opacity: 0,
  },
  show: {
    opacity,
    transition: {
      type,
      delay,
      duration,
      bounce: 0,
      ease: [0.17, 0.67, 0.83, 0.67],
    },
  },
});

export const fadeIn = (
  direction: "left" | "right" | "up" | "down",
  type: string,
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

export const ringGrow = (
  direction: string,
  type: string,
  delay: number,
  duration: number,
  opacity: number = 1
): Variants => ({
  hidden: {
    x: 0,
    y: 0,
    opacity: 0,
    scale: 0.5,
    originY: "100%",
  },
  show: {
    x: 0,
    y: 0,
    opacity,
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
  type: string,
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

export const fadeInIcon = fadeInButton;

export const textFadeUp = (
  direction: string,
  type: string,
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
  direction: string,
  type: string,
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

export const planetVariants = (
  direction: "left" | "right"
): Variants => ({
  hidden: {
    x: direction === "left" ? "-100%" : "100%",
    rotate: 120,
  },
  show: {
    x: 0,
    rotate: 0,
    transition: {
      type: "spring",
      duration: 1.8,
      delay: 0.5,
    },
  },
});

export const zoomIn = (
  delay: number,
  duration: number
): Variants => ({
  hidden: {
    scale: 0,
    opacity: 0,
  },
  show: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "tween",
      delay,
      duration,
      ease: "easeOut",
    },
  },
});

export const footerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 140,
    },
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      delay: 0.5,
    },
  },
};
