"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { SPRING_FLICK } from "@/components/motion/springs";

const PHOTOS = [
  "/images/me/1.jpg",
  "/images/me/2.jpg",
  "/images/me/3.jpg",
  "/images/me/4.jpg",
] as const;

export default function AboutHeroStyleCarousel() {
  const [[index, direction], setPage] = useState<[number, number]>([0, 0]);
  const total = PHOTOS.length;

  function paginate(step: 1 | -1) {
    setPage(([value]) => [(value + step + total) % total, step]);
  }

  function onDragEnd(_: PointerEvent, info: PanInfo) {
    // Project the flick: a fast short swipe counts like a long slow one.
    const projected = info.offset.x + info.velocity.x * 0.2;
    if (projected < -60) paginate(1);
    else if (projected > 60) paginate(-1);
  }

  return (
    <div className="relative aspect-square w-full overflow-hidden bg-[#161515]/8 lg:h-full lg:min-h-[560px] lg:aspect-auto">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={PHOTOS[index]}
          custom={direction}
          className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
          variants={{
            enter: (dir: number) => ({ x: dir === 0 ? 0 : `${dir * 100}%`, opacity: dir === 0 ? 1 : 0.6 }),
            center: { x: 0, opacity: 1 },
            exit: (dir: number) => ({ x: `${dir * -30}%`, opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={SPRING_FLICK}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          dragMomentum={false}
          onDragEnd={onDragEnd}
        >
          <Image
            src={PHOTOS[index]}
            alt={`Mari Miavka portrait ${index + 1}`}
            fill
            draggable={false}
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="select-none object-cover object-left contrast-110 saturate-105"
            style={{ filter: "contrast(1.08) saturate(1.06) brightness(0.98)" }}
            priority={index === 0}
          />
        </motion.div>
      </AnimatePresence>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #161515 0.9px, transparent 0.9px)",
          backgroundSize: "4px 4px",
        }}
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 md:px-3">
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", duration: 0.2, bounce: 0 }}
          onClick={() => paginate(-1)}
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#161515]/52 select-none text-[26px] text-[#F4F4F0] backdrop-blur-[1px] transition-colors hover:bg-[#161515]/70"
          aria-label="Previous photo"
        >
          ←
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", duration: 0.2, bounce: 0 }}
          onClick={() => paginate(1)}
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#161515]/52 select-none text-[26px] text-[#F4F4F0] backdrop-blur-[1px] transition-colors hover:bg-[#161515]/70"
          aria-label="Next photo"
        >
          →
        </motion.button>
      </div>
    </div>
  );
}
