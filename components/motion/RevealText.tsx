"use client";

import { motion, useReducedMotion } from "motion/react";

type RevealTextProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
};

/**
 * Headline that rises word by word as it scrolls into view. Words sit inside
 * clipped lines so the motion reads as a mask, not a fade. The full text stays
 * on the element as an aria-label; the animated spans are hidden from readers.
 */
export default function RevealText({
  text,
  as = "h2",
  className,
  style,
  delay = 0,
}: RevealTextProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  if (reduce) {
    const Plain = as;
    return (
      <Plain className={className} style={style}>
        {text}
      </Plain>
    );
  }

  const words = text.split(" ");

  return (
    <Tag
      className={className}
      style={style}
      aria-label={text}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: "some", margin: "0px 0px -8% 0px" }}
      transition={{ staggerChildren: 0.045, delayChildren: delay }}
    >
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          aria-hidden
          className="inline-block overflow-hidden pb-[0.08em] align-bottom"
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "105%" },
              shown: { y: "0%" },
            }}
            transition={{ type: "spring", duration: 0.7, bounce: 0 }}
          >
            {word}
            {index < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
