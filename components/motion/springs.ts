import type { Transition } from "motion/react";

// Apple-style: critically damped by default, bounce only for momentum.
export const SPRING_SNAP: Transition = { type: "spring", duration: 0.3, bounce: 0 };
export const SPRING_SMOOTH: Transition = { type: "spring", duration: 0.45, bounce: 0 };
export const SPRING_FLICK: Transition = { type: "spring", duration: 0.4, bounce: 0.2 };
