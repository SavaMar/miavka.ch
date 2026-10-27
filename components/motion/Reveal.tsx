"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SPRING_SMOOTH } from "./springs";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** Set false for above-the-fold content so it stays visible pre-hydration. */
  fade?: boolean;
};

/**
 * Scroll-in reveal. `amount: "some"` + a bottom margin means very tall
 * blocks on small screens still trigger (a 30% threshold would never fire).
 */
export default function Reveal({ children, className, delay = 0, y = 14, fade = true }: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={fade ? { opacity: 0, y } : { y }}
      whileInView={fade ? { opacity: 1, y: 0 } : { y: 0 }}
      viewport={{ once: true, amount: "some", margin: "0px 0px -8% 0px" }}
      transition={{ ...SPRING_SMOOTH, delay }}
    >
      {children}
    </motion.div>
  );
}
