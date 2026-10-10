"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const SIDE_IMAGES = ["/images/me/3.jpg", "/images/me/1.jpg"] as const;

export default function PersonalHero() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const heroEl = heroRef.current;
    const canvasEl = canvasRef.current;
    if (!heroEl || !canvasEl) return;
    const context = canvasEl.getContext("2d");
    if (!context) return;
    const hero: HTMLElement = heroEl;
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = context;

    const RED_VARIATIONS = ["#D0320E", "#B42B0C", "#D83D17", "#97220B", "#E04A25"];
    const BASE_DOT_COLOR = "#8D8B87";
    const GRID_SPACING = 24;
    const INFLUENCE_RADIUS = 120;
    const BASE_DOT = 0.85;
    const MAX_DOT = 3.6;

    type Dot = {
      x: number;
      y: number;
      r: number;
      baseR: number;
      targetR: number;
      colorT: number;
      assignedColor: string | null;
    };
    type Ring = {
      x: number;
      y: number;
      r: number;
      maxR: number;
      opacity: number;
      color: string;
      lineWidth: number;
      speed: number;
    };

    let dots: Dot[] = [];
    let rings: Ring[] = [];
    let colorIndex = 0;
    let lastRingTime = 0;
    let animationId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const pointer = {
      x: -9999,
      y: -9999,
      tx: -9999,
      ty: -9999,
    };

    function hexToRgb(hex: string): [number, number, number] {
      const n = parseInt(hex.slice(1), 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }

    function lerpColor(a: string, b: string, t: number): string {
      const ca = hexToRgb(a);
      const cb = hexToRgb(b);
      const r = Math.round(ca[0] + (cb[0] - ca[0]) * t);
      const g = Math.round(ca[1] + (cb[1] - ca[1]) * t);
      const bl = Math.round(ca[2] + (cb[2] - ca[2]) * t);
      return `rgb(${r},${g},${bl})`;
    }

    function buildGrid() {
      dots = [];
      const cols = Math.ceil(width / GRID_SPACING) + 1;
      const rows = Math.ceil(height / GRID_SPACING) + 1;
      const offsetX = (width - (cols - 1) * GRID_SPACING) / 2;
      const offsetY = (height - (rows - 1) * GRID_SPACING) / 2;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          dots.push({
            x: offsetX + col * GRID_SPACING,
            y: offsetY + row * GRID_SPACING,
            baseR: BASE_DOT,
            r: BASE_DOT,
            targetR: BASE_DOT,
            colorT: 0,
            assignedColor: null,
          });
        }
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = hero.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGrid();
    }

    function addRing(x: number, y: number) {
      const count = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        rings.push({
          x,
          y,
          r: 4 + i * 6,
          maxR: 60 + Math.random() * 70,
          opacity: 0.18 - i * 0.05,
          color: RED_VARIATIONS[(colorIndex + i) % RED_VARIATIONS.length],
          lineWidth: 0.8 + Math.random() * 0.4,
          speed: 0.6 + Math.random() * 0.4,
        });
      }
      colorIndex = (colorIndex + 1) % RED_VARIATIONS.length;
    }

    function updateDots() {
      const time = performance.now();
      pointer.x += (pointer.tx - pointer.x) * 0.14;
      pointer.y += (pointer.ty - pointer.y) * 0.14;

      for (const dot of dots) {
        const dx = dot.x - pointer.x;
        const dy = dot.y - pointer.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const idlePulse =
          0.12 *
          (0.5 + 0.5 * Math.sin((dot.x + dot.y) * 0.03 + time * 0.0018));

        if (distance < INFLUENCE_RADIUS) {
          const t = 1 - distance / INFLUENCE_RADIUS;
          const ease = t * t * (3 - 2 * t);
          dot.targetR = BASE_DOT + (MAX_DOT - BASE_DOT) * ease;
          if (ease > 0.35 && !dot.assignedColor) {
            dot.assignedColor =
              RED_VARIATIONS[Math.floor(Math.random() * RED_VARIATIONS.length)];
          }
          dot.colorT = Math.min(1, dot.colorT + 0.08);
        } else {
          dot.targetR = BASE_DOT + idlePulse;
          dot.colorT = Math.max(0, dot.colorT - 0.05);
          if (dot.colorT <= 0) dot.assignedColor = null;
        }

        dot.r += (dot.targetR - dot.r) * 0.12;
      }
    }

    function updateRings() {
      rings = rings.filter((ring) => {
        ring.r += ring.speed;
        ring.opacity *= 0.982;
        return ring.r < ring.maxR && ring.opacity > 0.01;
      });
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (const ring of rings) {
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = ring.color;
        ctx.globalAlpha = ring.opacity;
        ctx.lineWidth = ring.lineWidth;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      for (const dot of dots) {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fillStyle = lerpColor(
          BASE_DOT_COLOR,
          dot.assignedColor ?? BASE_DOT_COLOR,
          dot.colorT
        );
        ctx.fill();
      }
    }

    function tick() {
      updateDots();
      updateRings();
      draw();
      animationId = window.requestAnimationFrame(tick);
    }

    function onMove(event: MouseEvent | TouchEvent) {
      const rect = hero.getBoundingClientRect();
      const clientX =
        "touches" in event ? event.touches[0]?.clientX ?? 0 : event.clientX;
      const clientY =
        "touches" in event ? event.touches[0]?.clientY ?? 0 : event.clientY;
      pointer.tx = clientX - rect.left;
      pointer.ty = clientY - rect.top;

      const now = performance.now();
      if (now - lastRingTime > 70) {
        addRing(pointer.tx, pointer.ty);
        lastRingTime = now;
      }
    }

    function onLeave() {
      pointer.tx = -9999;
      pointer.ty = -9999;
    }

    resize();
    tick();
    window.addEventListener("resize", resize);
    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("touchmove", onMove, { passive: true });
    hero.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("resize", resize);
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("touchmove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
      window.cancelAnimationFrame(animationId);
    };
  }, [reducedMotion]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[calc(100dvh-58px)] overflow-hidden bg-[#F4F4F0] pt-6 md:min-h-[calc(100dvh-64px)] md:pt-8"
    >
      {!reducedMotion ? (
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          aria-hidden
        />
      ) : (
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-45"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(22, 21, 21, 0.34) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
          aria-hidden
        />
      )}

      <div className="mx-auto flex min-h-[calc(100dvh-58px)] w-full max-w-[1680px] flex-col px-4 pb-12 pt-5 md:min-h-[calc(100dvh-64px)] md:px-8 md:pb-16 md:pt-7 lg:px-12 lg:pb-20">
        <div className="relative z-10 mt-3 grid grid-cols-[1fr_2fr_1fr] gap-[15px] md:mt-5">
          <div className="relative min-h-0 overflow-hidden bg-[#161515]/8">
            <Image
              src={SIDE_IMAGES[0]}
              alt="Mari Miavka portrait"
              fill
              sizes="25vw"
              className="object-cover grayscale contrast-125 brightness-95"
              style={{
                filter: "grayscale(1) contrast(1.2) brightness(0.9)",
              }}
              priority
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-multiply"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, #161515 0.9px, transparent 0.9px)",
                backgroundSize: "4px 4px",
              }}
              aria-hidden
            />
          </div>

          <div className="relative aspect-video overflow-hidden bg-[#161515]">
            <Image
              src="/images/hero-photo.jpg"
              alt=""
              fill
              sizes="50vw"
              className="object-cover opacity-80"
              style={{
                filter: "grayscale(1) contrast(1.15) brightness(0.72)",
              }}
              priority
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-multiply"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, #161515 0.9px, transparent 0.9px)",
                backgroundSize: "4px 4px",
              }}
              aria-hidden
            />
            {/* Swap play button for iframe when you have a video ID */}
            <button
              type="button"
              className="absolute inset-0 flex items-center justify-center"
              aria-label="Play video (preview)"
            >
              <span className="flex h-12 w-12 items-center justify-center border-2 border-[#D0320E] bg-[#F4F4F0]/90 text-[#D0320E] transition-colors hover:bg-[#D0320E] hover:text-[#F4F4F0] md:h-16 md:w-16">
                <svg
                  viewBox="0 0 24 24"
                  className="ml-0.5 h-5 w-5 fill-current md:h-7 md:w-7"
                  aria-hidden
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          </div>

          <div className="relative min-h-0 overflow-hidden bg-[#161515]/8">
            <Image
              src={SIDE_IMAGES[1]}
              alt="Mari Miavka portrait"
              fill
              sizes="25vw"
              className="object-cover grayscale contrast-125 brightness-95"
              style={{
                filter: "grayscale(1) contrast(1.2) brightness(0.9)",
              }}
              priority
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-multiply"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, #161515 0.9px, transparent 0.9px)",
                backgroundSize: "4px 4px",
              }}
              aria-hidden
            />
          </div>
        </div>

        <h1
          className="relative z-10 mt-8 w-full uppercase text-[#161515] md:mt-10"
          style={{
            fontFamily: "'TG Girthy', Impact, sans-serif",
            fontSize: "clamp(1.65rem, 5.2vw, 3.75rem)",
            lineHeight: 1.04,
          }}
        >
          I write about thinking clearly, <span className="text-[#D0320E]">AI</span>, building
          systems, <span className="text-[#D0320E]">marketing</span> and reinventing yourself.
        </h1>
      </div>
    </section>
  );
}
