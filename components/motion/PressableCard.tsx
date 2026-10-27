"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { SPRING_SNAP } from "./springs";

/**
 * Card wrapper: spring hover-lift (fine pointers only — motion ignores
 * touch for whileHover) and an instant press response on every input.
 */
export default function PressableCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.012 }}
      whileTap={{ scale: 0.985 }}
      transition={SPRING_SNAP}
    >
      {children}
    </motion.div>
  );
}
