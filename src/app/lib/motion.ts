import { Variants } from "framer-motion";

export const navVariants = {
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
  direction: any,
  type: any,
  delay: any,
  duration: any
) => ({
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

export const textVariant = (delay: any) => ({
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

export const textContainer = {
  hidden: {
    opacity: 0,
  },
  show: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.01, delayChildren: i * 0.0 },
  }),
};

export const grow = {
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
export const growDownSub: Variants = {
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

export const textVariant2 = {
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

export const fade = (type: any, delay: any, duration: any, opacity: any) => ({
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: opacity,
    transition: {
      type,
      delay,
      duration,
      bounce: 0,
      ease: [0.17, 0.67, 0.83, 0.67], // Proper easing type as an array
    },
  },
});

export const fadeIn = (
  direction: any,
  type: any,
  delay: any,
  duration: any
) => ({
  hidden: {
    x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
    y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
    opacity: 0,
    scale: 0.98,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type,
      delay,
      duration,
      bounce: 0,
      ease: [0.17, 0.67, 0.83, 0.67], // Proper easing type as an array
    },
    scale: 1,
  },
});

export const ringGrow = (
  direction: any,
  type: any,
  delay: any,
  duration: any,
  opacity?: any
) => ({
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
    opacity: opacity || 1,
    transition: {
      type,
      delay,
      duration,
      bounce: 0,
      ease: [0.17, 0.67, 0.83, 0.67], // Proper easing type as an array
    },
    scale: 1,
  },
});

export const fadeInButton = (
  direction: any,
  type: any,
  delay: any,
  duration: any
) => ({
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
    transition: {
      type,
      delay,
      duration,
      bounce: 0,
      ease: [0.17, 0.67, 0.83, 0.67], // Proper easing type as an array
    },
    scale: 1,
  },
});

export const fadeInIcon = (
  direction: any,
  type: any,
  delay: any,
  duration: any
) => ({
  hidden: {
    x: direction === "left" ? 0 : direction === "right" ? -0 : 0,
    y: direction === "up" ? 0 : direction === "down" ? -0 : 0,
    opacity: 0,
    scale: 0.98,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type,
      delay,
      duration,
      bounce: 0,
      ease: [0.17, 0.67, 0.83, 0.67], // Proper easing type as an array
    },
    scale: 1,
  },
});

export const textFadeUp = (
  direction: any,
  type: any,
  delay: any,
  duration: any
) => ({
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
    transition: {
      bounce: 0,
      type,
      delay,
      duration,
      ease: [0.17, 0.67, 0.83, 0.67], // Proper easing type as an array
    },
    scale: 1,
    skewY: 0,
  },
});
export const textFadeUpSmall = (
  direction: any,
  type: any,
  delay: any,
  duration: any
) => ({
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
    transition: {
      bounce: 0,
      type,
      delay,
      duration,
      ease: [0.17, 0.67, 0.83, 0.67], // Proper easing type as an array
    },
    scale: 1,
  },
});

export const planetVariants = (direction: any) => ({
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

export const zoomIn = (delay: any, duration: any) => ({
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

export const footerVariants = {
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
