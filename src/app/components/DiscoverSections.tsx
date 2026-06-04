"use client";

import { motion } from "motion/react";
import { MapPin, CheckCircle } from "@phosphor-icons/react";
import { AREAS, CIVIC_WALL, galleryUrl } from "@/lib/gallery";

export function AreasStrip() {
  return (
    <section className="mx-auto max-w-[1180px] px-5 py-10">
      <h2 className="text-xl font-semibold tracking-tight text-[var(--text)] sm:text-2xl">
        Across the city
      </h2>
      <p className="mt-1 text-sm text-[var(--text-dim)]">
        How neighbourhoods around Hyderabad are doing this month.
      </p>
      <div className="no-scrollbar mt-5 flex gap-4 overflow-x-auto pb-2">
        {AREAS.map((a, i) => {
          const rate = Math.round((a.resolved / a.reports) * 100);
          return (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: (i % 8) * 0.04 }}
              className="w-44 shrink-0"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--muted)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={galleryUrl(a.photo, 500)}
                  alt={a.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <p className="absolute bottom-2 left-3 flex items-center gap-1 text-sm font-semibold text-white">
                  <MapPin size={13} weight="fill" /> {a.name}
                </p>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-[var(--text-dim)]">
                <span>{a.reports} reports</span>
                <span className="flex items-center gap-1 font-medium text-[var(--resolved)]">
                  <CheckCircle size={12} weight="fill" /> {rate}%
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
                <div
                  className="h-full rounded-full bg-[var(--resolved)]"
                  style={{ width: `${rate}%` }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export function ImpactWall() {
  return (
    <section className="mx-auto max-w-[1180px] px-5 py-10">
      <h2 className="text-xl font-semibold tracking-tight text-[var(--text)] sm:text-2xl">
        Your city, in motion
      </h2>
      <p className="mt-1 text-sm text-[var(--text-dim)]">
        Streets, parks and infrastructure across the wards residents care for.
      </p>
      <div className="mt-5 columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
        {CIVIC_WALL.map((p, i) => (
          <motion.div
            key={`${p}-${i}`}
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: (i % 12) * 0.02 }}
            className="overflow-hidden rounded-2xl bg-[var(--muted)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={galleryUrl(p, 600)}
              alt="City"
              loading="lazy"
              className="w-full object-cover transition duration-500 hover:scale-[1.03]"
              style={{ aspectRatio: i % 3 === 0 ? "4 / 3" : i % 3 === 1 ? "1 / 1" : "3 / 4" }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
