"use client";

import { motion } from "framer-motion";

/**
 * The HomeFeast signature element: a stack of tiffin tins.
 * Each tin is annotated with the subscription cadence it represents
 * (daily / weekly / monthly) — the stack itself IS the plan selector metaphor.
 */
export function TiffinStack({ className = "" }: { className?: string }) {
  const tins = [
    { label: "Monthly", color: "#2C4A3B", width: 100 },
    { label: "Weekly", color: "#3E6350", width: 88 },
    { label: "Daily", color: "#D8A320", width: 76 },
  ];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {tins.map((tin, i) => (
        <motion.div
          key={tin.label}
          initial={{ opacity: 0, y: -16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut" }}
          className="relative -mt-1 first:mt-0"
          style={{ width: `${tin.width}%` }}
        >
          <div
            className="h-16 sm:h-20 rounded-2xl shadow-soft border border-black/10 flex items-center justify-between px-5"
            style={{ backgroundColor: tin.color }}
          >
            <span className="font-mono text-[11px] tracking-widest uppercase text-white/70">
              {tin.label}
            </span>
            <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
          </div>
        </motion.div>
      ))}
      {/* handle */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="h-4 w-14 rounded-t-full border-2 border-b-0 border-ink/20 -mt-1"
      />
    </div>
  );
}

/** Compact 3-dot version used as the logo mark in the navbar/footer */
export function TiffinMark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-[3px] ${className}`}>
      <span className="h-2 w-6 rounded-full bg-leaf" />
      <span className="h-2 w-5 rounded-full bg-leaf-light ml-0.5" />
      <span className="h-2 w-4 rounded-full bg-turmeric ml-1" />
    </div>
  );
}
