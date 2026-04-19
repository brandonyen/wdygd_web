import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface ActivityData {
  github: number; // 0-100
  slack: number; // 0-100
  linear: number; // 0-100
}

interface ProductivityGardenProps {
  activityData: ActivityData;
  /** When set, only those tools appear in the garden and legend. */
  enabledIntegrationIds?: string[];
}

export function ProductivityGarden({
  activityData,
  enabledIntegrationIds,
}: ProductivityGardenProps) {
  const [mounted, setMounted] = useState(false);

  const show = (id: keyof ActivityData) =>
    enabledIntegrationIds === undefined || enabledIntegrationIds.includes(id);

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
    });
  }, []);

  // Calculate growth based on activity levels
  const githubGrowth = (activityData.github / 100) * 80 + 20;
  const slackGrowth = (activityData.slack / 100) * 70 + 30;
  const linearGrowth = (activityData.linear / 100) * 60 + 40;

  return (
    <div
      className="garden-theme-isolated w-full h-96 relative rounded-3xl overflow-hidden"
      style={{ backgroundColor: "var(--garden-surface)" }}
    >
      {/* Ambient background gradients */}
      <div className="absolute inset-0 opacity-25">
        {show("github") && (
          <div className="absolute top-8 left-8 w-40 h-40 rounded-full blur-3xl bg-zen-sage-light" />
        )}
        {show("slack") && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-44 h-44 rounded-full blur-3xl bg-zen-blue" />
        )}
        {show("linear") && (
          <div className="absolute top-10 right-12 w-44 h-44 rounded-full blur-3xl bg-zen-purple" />
        )}
      </div>

      {/* SVG Garden Elements */}
      <svg
        className="w-full h-full"
        viewBox="0 0 800 400"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Base horizon */}
        <line
          x1="20"
          y1="300"
          x2="780"
          y2="300"
          stroke="var(--zen-sand)"
          strokeWidth="2"
          opacity="0.35"
        />

        {/* Subtle hill layers for a calmer, modern canvas */}
        <motion.path
          d="M20 300 C140 282 240 306 360 294 C480 282 600 304 780 290 L780 330 L20 330 Z"
          fill="var(--zen-off-white)"
          opacity={0.45}
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 0.45 : 0 }}
          transition={{ duration: 1 }}
        />
        <motion.path
          d="M20 302 C170 294 300 316 430 304 C560 292 680 312 780 304 L780 336 L20 336 Z"
          fill="var(--zen-sand-light)"
          opacity={0.35}
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 0.35 : 0 }}
          transition={{ duration: 1, delay: 0.1 }}
        />

        {/* GitHub - minimal tree (left) */}
        {show("github") && (
          <motion.g
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 8 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
          >
            <motion.path
              d="M170 300 L170 210"
              stroke="var(--zen-sage-dark)"
              strokeWidth="4"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: mounted ? 1 : 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            {[
              "M170 270 L130 238",
              "M170 255 L205 230",
              "M170 240 L138 214",
            ].map((d, i) => (
              <motion.path
                key={d}
                d={d}
                stroke="var(--zen-sage)"
                strokeWidth="2.4"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: mounted ? 1 : 0 }}
                transition={{ duration: 0.7, delay: 0.18 + i * 0.08 }}
              />
            ))}
            {[150, 188, 126, 210, 170].map((x, i) => (
              <motion.circle
                key={`leaf-${x}`}
                cx={x}
                cy={195 - (i % 2) * 18}
                r={6 + ((githubGrowth / 10 + i) % 4)}
                fill="var(--zen-sage)"
                opacity={0.72}
                initial={{ scale: 0 }}
                animate={{ scale: mounted ? 1 : 0 }}
                transition={{ duration: 0.45, delay: 0.55 + i * 0.05 }}
              />
            ))}
          </motion.g>
        )}

        {/* Slack - centered wave motif (middle) */}
        {show("slack") && (
          <motion.g
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.9 }}
            transition={{ duration: 0.85, delay: 0.15 }}
          >
            {[0, 1, 2, 3].map((i) => {
              const y = 278 - i * 22;
              return (
                <motion.path
                  key={`flow-${i}`}
                  d={`M270 ${y} C305 ${y - 16} 375 ${y + 16} 410 ${y} C445 ${y - 16} 495 ${y + 10} 530 ${y}`}
                  stroke="var(--zen-blue)"
                  strokeWidth="3"
                  fill="none"
                  opacity={0.52 - i * 0.09}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: mounted ? 1 : 0 }}
                  transition={{ duration: 1.1, delay: 0.3 + i * 0.1 }}
                />
              );
            })}
            {[328, 370, 414, 460].map((x, i) => (
              <motion.circle
                key={`drop-${x}`}
                cx={x}
                cy={232 + (i % 2) * 8}
                r={4 + (slackGrowth / 100) * 3}
                fill="var(--zen-blue)"
                opacity={0.35}
                initial={{ scale: 0 }}
                animate={{ scale: mounted ? 1 : 0 }}
                transition={{ duration: 0.4, delay: 0.75 + i * 0.06 }}
              />
            ))}
          </motion.g>
        )}

        {/* Linear - simplified mountain cluster (right) */}
        {show("linear") && (
          <motion.g
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 10 }}
            transition={{ duration: 0.85, delay: 0.3 }}
          >
            <motion.path
              d={`M620 300 L662 ${300 - linearGrowth * 0.78} L704 300 Z`}
              fill="var(--zen-purple)"
              opacity={0.56}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: mounted ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              style={{ transformOrigin: "center bottom" }}
            />
            <motion.path
              d={`M590 300 L635 ${300 - linearGrowth * 0.48} L680 300 Z`}
              fill="var(--zen-purple)"
              opacity={0.38}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: mounted ? 1 : 0 }}
              transition={{ duration: 0.7, delay: 0.68 }}
              style={{ transformOrigin: "center bottom" }}
            />
            <motion.path
              d={`M670 300 L700 ${300 - linearGrowth * 0.38} L730 300 Z`}
              fill="var(--zen-purple)"
              opacity={0.34}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: mounted ? 1 : 0 }}
              transition={{ duration: 0.65, delay: 0.75 }}
              style={{ transformOrigin: "center bottom" }}
            />
          </motion.g>
        )}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 flex flex-wrap gap-6 text-sm">
        {show("github") && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-zen-sage" />
            <span className="text-zen-charcoal-light">GitHub</span>
          </div>
        )}
        {show("slack") && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-zen-blue" />
            <span className="text-zen-charcoal-light">Slack</span>
          </div>
        )}
        {show("linear") && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-zen-purple" />
            <span className="text-zen-charcoal-light">Linear</span>
          </div>
        )}
      </div>
    </div>
  );
}
