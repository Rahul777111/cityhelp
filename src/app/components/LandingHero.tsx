"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Plus, ArrowDown, MapTrifold } from "@phosphor-icons/react";

export default function LandingHero({
  onReport,
  onExplore,
}: {
  onReport?: () => void;
  onExplore?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section
      ref={ref}
      className="relative h-[84vh] min-h-[540px] w-full overflow-hidden"
    >
      <motion.div
        style={reduce ? undefined : { y, scale }}
        className="absolute inset-0"
      >
        {reduce ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/landing/hero.jpg"
            alt="City skyline at golden hour"
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/landing/hero.jpg"
            className="h-full w-full object-cover"
          >
            <source src="/landing/hero.mp4" type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/70" />
      </motion.div>

      <motion.div
        style={reduce ? undefined : { opacity }}
        className="relative z-10 mx-auto flex h-full max-w-[1180px] flex-col justify-center px-5"
      >
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80"
        >
          Hyderabad · civic reporting, in realtime
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease }}
          className="mt-3 max-w-3xl text-4xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Your city,
          <br />
          working better together.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease }}
          className="mt-4 max-w-xl text-lg text-white/85"
        >
          Report potholes, outages and overflowing bins in seconds. Track every
          fix, rally your neighbourhood, and see the whole city's health.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease }}
          className="mt-7 flex flex-wrap items-center gap-3"
        >
          <button
            onClick={onReport}
            className="flex items-center gap-2 rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[var(--brand-dark)] active:scale-[0.98]"
          >
            <Plus size={18} weight="bold" /> Report an issue
          </button>
          <button
            onClick={onExplore}
            className="flex items-center gap-2 rounded-full border border-white/40 px-5 py-3 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/10"
          >
            <MapTrifold size={18} weight="fill" /> See the city map
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        style={reduce ? undefined : { opacity }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/70"
        animate={reduce ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown size={22} />
      </motion.div>
    </section>
  );
}
