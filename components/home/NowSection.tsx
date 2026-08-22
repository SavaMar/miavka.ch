"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BookOpen, Network, Star } from "lucide-react";
import { Fraunces } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default function NowSection({
  nowLastUpdated,
}: {
  nowLastUpdated: string;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

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

    const sectionEl = sectionRef.current;
    const canvasEl = canvasRef.current;
    if (!sectionEl || !canvasEl) return;

    const context = canvasEl.getContext("2d");
    if (!context) return;

    const section = sectionEl;
    const canvas = canvasEl;
    const ctx: CanvasRenderingContext2D = context;

    const DOT_COLOR = "#878681";
    const ACTIVE_COLORS = ["#D0320E", "#B42B0C", "#D83D17"];
    const SPACING = 22;
    const BASE_DOT = 0.8;
    const MAX_DOT = 3.4;
    const RADIUS = 110;

    type Dot = {
      x: number;
      y: number;
      r: number;
      targetR: number;
      colorT: number;
      color: string | null;
    };

    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationId = 0;

    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

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
      const cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;
      const offsetX = (width - (cols - 1) * SPACING) / 2;
      const offsetY = (height - (rows - 1) * SPACING) / 2;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          dots.push({
            x: offsetX + col * SPACING,
            y: offsetY + row * SPACING,
            r: BASE_DOT,
            targetR: BASE_DOT,
            colorT: 0,
            color: null,
          });
        }
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = section.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGrid();
    }

    function updateDots() {
      pointer.x += (pointer.tx - pointer.x) * 0.14;
      pointer.y += (pointer.ty - pointer.y) * 0.14;
      for (const dot of dots) {
        const dx = dot.x - pointer.x;
        const dy = dot.y - pointer.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < RADIUS) {
          const t = 1 - dist / RADIUS;
          const eased = t * t * (3 - 2 * t);
          dot.targetR = BASE_DOT + (MAX_DOT - BASE_DOT) * eased;
          if (eased > 0.35 && !dot.color) {
            dot.color =
              ACTIVE_COLORS[Math.floor(Math.random() * ACTIVE_COLORS.length)];
          }
          dot.colorT = Math.min(1, dot.colorT + 0.08);
        } else {
          dot.targetR = BASE_DOT;
          dot.colorT = Math.max(0, dot.colorT - 0.05);
          if (dot.colorT <= 0) dot.color = null;
        }
        dot.r += (dot.targetR - dot.r) * 0.13;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (const dot of dots) {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fillStyle = lerpColor(
          DOT_COLOR,
          dot.color ?? DOT_COLOR,
          dot.colorT
        );
        ctx.fill();
      }
    }

    function tick() {
      updateDots();
      draw();
      animationId = window.requestAnimationFrame(tick);
    }

    function onMove(event: MouseEvent | TouchEvent) {
      const rect = section.getBoundingClientRect();
      const clientX =
        "touches" in event ? (event.touches[0]?.clientX ?? 0) : event.clientX;
      const clientY =
        "touches" in event ? (event.touches[0]?.clientY ?? 0) : event.clientY;
      pointer.tx = clientX - rect.left;
      pointer.ty = clientY - rect.top;
    }

    function onLeave() {
      pointer.tx = -9999;
      pointer.ty = -9999;
    }

    resize();
    tick();
    window.addEventListener("resize", resize);
    section.addEventListener("mousemove", onMove);
    section.addEventListener("touchmove", onMove, { passive: true });
    section.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("resize", resize);
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("touchmove", onMove);
      section.removeEventListener("mouseleave", onLeave);
      window.cancelAnimationFrame(animationId);
    };
  }, [reducedMotion]);

  const buttonClassName =
    "w-fit border border-[#161515] px-4 py-2 text-[11px] uppercase text-[#161515] transition-colors hover:bg-[#D0320E] hover:text-[#161515]";
  const buttonStyle = {
    fontFamily:
      "'JetBrains Mono', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
    letterSpacing: "0.08em",
  } as const;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#F4F4F0] px-4 py-10 md:px-8 md:py-12 lg:px-12"
    >
      {!reducedMotion ? (
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          aria-hidden
        />
      ) : (
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-35"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(22, 21, 21, 0.26) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
          aria-hidden
        />
      )}
      <div className="relative z-10 mx-auto w-full max-w-[1680px]">
        <div className="pt-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2
              className={`${fraunces.className} text-2xl text-[#161515] md:text-3xl`}
            >
              What I&apos;m up to
            </h2>
            <p className="inline-flex items-center gap-2 text-base text-[#161515]/85">
              <span className="relative inline-flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#67B77A] opacity-60 [animation-duration:2500ms]" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#67B77A]" />
              </span>
              Last updated:{" "}
              <strong className="text-[#161515]">{nowLastUpdated}</strong>
            </p>
          </div>
          <div className="mt-6 rounded-[10px] bg-[#FAFAF8] px-6 py-7 text-[#161515] shadow-[0_18px_45px_rgba(15,23,42,0.28)] md:px-8">
            <div className="grid gap-3">
              <p className="flex items-start gap-3 text-[16px] uppercase">
                <span
                  className="mt-[0.22em] inline-flex h-4 w-4 shrink-0 items-center justify-center text-[#D0320E]"
                  aria-hidden
                >
                  <BookOpen className="h-4 w-4" strokeWidth={2} />
                </span>
                <span className="normal-case">
                  <strong>Reading:</strong> Thinking In Systems: A Primer -
                  Donella Meadows.
                  <Link
                    href="/books"
                    className="ml-2 text-[#D0320E] underline underline-offset-2 transition-colors hover:text-[#A9270C]"
                  >
                    [ &gt;&gt;&gt; SEE ALL BOOKS ]
                  </Link>
                </span>
              </p>

              <p className="flex items-start gap-3 text-[16px] uppercase">
                <span
                  className="mt-[0.22em] inline-flex h-4 w-4 shrink-0 items-center justify-center text-[#D0320E]"
                  aria-hidden
                >
                  <Network className="h-4 w-4" strokeWidth={2} />
                </span>
                <span className="normal-case">
                  <strong>Listening: </strong> Listening to &apos;Effective
                  Executive&apos; by Peter Drucker
                </span>
              </p>

              <p className="flex items-start gap-3 text-[16px] uppercase">
                <span
                  className="mt-[0.22em] inline-flex h-4 w-4 shrink-0 items-center justify-center text-[#D0320E]"
                  aria-hidden
                >
                  <Star className="h-4 w-4" strokeWidth={2} />
                </span>
                <span className="normal-case">
                  <strong>Life: </strong>I started working at Creaholic, the
                  company founded by Swatch co-inventor Elmar Mock. <br />{" "}
                  Currently, I&apos;m rebuilding the website, planning sales
                  funnels, and building a complete digital system to serve
                  Creaholic&apos;s needs in the digital world.
                </span>
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/now" className={buttonClassName} style={buttonStyle}>
                &gt;&gt;&gt; SEE CHRONOLOGY
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
