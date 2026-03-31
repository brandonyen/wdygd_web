import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface ActivityData {
  github: number; // 0-100
  slack: number; // 0-100
  linear: number; // 0-100
}

interface ProductivityGardenProps {
  activityData: ActivityData;
}

export function ProductivityGarden({ activityData }: ProductivityGardenProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate growth based on activity levels
  const githubGrowth = (activityData.github / 100) * 80 + 20;
  const slackGrowth = (activityData.slack / 100) * 70 + 30;
  const linearGrowth = (activityData.linear / 100) * 60 + 40;

  return (
    <div className="w-full h-96 relative rounded-3xl overflow-hidden bg-zen-off-white">
      {/* Ambient background gradients */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute bottom-0 left-0 w-1/3 h-1/2 rounded-full blur-3xl bg-zen-sage-light"
        />
        <div 
          className="absolute bottom-0 right-0 w-1/3 h-1/2 rounded-full blur-3xl bg-zen-blue"
        />
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-1/3 h-1/3 rounded-full blur-3xl bg-zen-purple"
        />
      </div>

      {/* SVG Garden Elements */}
      <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
        {/* Ground line */}
        <line
          x1="0"
          y1="300"
          x2="800"
          y2="300"
          stroke="var(--zen-sand)"
          strokeWidth="2"
          opacity="0.3"
        />

        {/* GitHub - Organic tree-like structure (left) */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.8 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Stem */}
          <motion.path
            d="M100 300 Q100 250 100 200"
            stroke="var(--zen-sage-dark)"
            strokeWidth="4"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: mounted ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          
          {/* Branches */}
          {[...Array(5)].map((_, i) => {
            const y = 300 - (i * githubGrowth / 5);
            const angle = i % 2 === 0 ? 30 : -30;
            const endX = 100 + (angle > 0 ? 40 : -40);
            return (
              <motion.path
                key={i}
                d={`M100 ${y} Q${100 + angle} ${y - 20} ${endX} ${y - 30}`}
                stroke="var(--zen-sage)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: mounted ? 1 : 0, 
                  opacity: mounted ? 0.8 : 0 
                }}
                transition={{ 
                  duration: 1, 
                  delay: 0.5 + i * 0.1,
                  ease: "easeOut" 
                }}
              />
            );
          })}

          {/* Leaves */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45) + (i % 2) * 20;
            const radius = 60 + (i % 3) * 15;
            const x = 100 + Math.cos((angle * Math.PI) / 180) * radius;
            const y = 220 - Math.abs(Math.sin((angle * Math.PI) / 180)) * radius;
            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r={8 + (i % 3) * 3}
                fill="var(--zen-sage)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: mounted ? 1 : 0, 
                  opacity: mounted ? 0.7 : 0 
                }}
                transition={{ 
                  duration: 0.6, 
                  delay: 1 + i * 0.08,
                  ease: "easeOut"
                }}
              />
            );
          })}
        </motion.g>

        {/* Slack - Flowing water-like structure (center) */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        >
          {/* Wave paths */}
          {[...Array(4)].map((_, i) => {
            const yOffset = 280 - (i * slackGrowth / 4);
            return (
              <motion.path
                key={i}
                d={`M400 ${yOffset} Q430 ${yOffset - 15} 460 ${yOffset} T520 ${yOffset}`}
                stroke="var(--zen-blue)"
                strokeWidth="3"
                fill="none"
                opacity={0.6 - i * 0.1}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: mounted ? 1 : 0 }}
                transition={{ 
                  duration: 1.5, 
                  delay: 0.6 + i * 0.15,
                  ease: "easeInOut" 
                }}
              />
            );
          })}

          {/* Bubbles */}
          {[...Array(12)].map((_, i) => {
            const x = 420 + (i % 4) * 30;
            const y = 270 - (Math.floor(i / 4) * 30);
            const size = 4 + (i % 3) * 2;
            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r={size}
                fill="var(--zen-blue)"
                opacity={0.4}
                initial={{ scale: 0, y: 20 }}
                animate={{ 
                  scale: mounted ? 1 : 0,
                  y: mounted ? 0 : 20
                }}
                transition={{ 
                  duration: 0.8, 
                  delay: 1.2 + i * 0.06,
                  ease: "easeOut"
                }}
              />
            );
          })}
        </motion.g>

        {/* Linear - Geometric crystal structure (right) */}
        <motion.g
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.9 }}
          transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
        >
          {/* Main crystal */}
          <motion.path
            d={`M600 300 L580 ${300 - linearGrowth * 0.5} L600 ${300 - linearGrowth} L620 ${300 - linearGrowth * 0.5} Z`}
            fill="var(--zen-purple)"
            opacity={0.6}
            initial={{ scaleY: 0, transformOrigin: "center bottom" }}
            animate={{ scaleY: mounted ? 1 : 0 }}
            transition={{ duration: 1.2, delay: 0.9, ease: "easeOut" }}
          />

          {/* Side crystals */}
          <motion.path
            d={`M570 300 L560 ${300 - linearGrowth * 0.3} L570 ${300 - linearGrowth * 0.6} L580 ${300 - linearGrowth * 0.3} Z`}
            fill="var(--zen-purple)"
            opacity={0.5}
            initial={{ scaleY: 0, transformOrigin: "center bottom" }}
            animate={{ scaleY: mounted ? 1 : 0 }}
            transition={{ duration: 1, delay: 1.1, ease: "easeOut" }}
          />

          <motion.path
            d={`M620 300 L630 ${300 - linearGrowth * 0.3} L620 ${300 - linearGrowth * 0.6} L610 ${300 - linearGrowth * 0.3} Z`}
            fill="var(--zen-purple)"
            opacity={0.5}
            initial={{ scaleY: 0, transformOrigin: "center bottom" }}
            animate={{ scaleY: mounted ? 1 : 0 }}
            transition={{ duration: 1, delay: 1.1, ease: "easeOut" }}
          />

          {/* Small accent crystals */}
          {[...Array(6)].map((_, i) => {
            const baseX = 550 + i * 20;
            const height = 15 + (i % 3) * 10;
            return (
              <motion.path
                key={i}
                d={`M${baseX} 300 L${baseX - 4} ${300 - height} L${baseX} ${300 - height - 8} L${baseX + 4} ${300 - height} Z`}
                fill="var(--zen-purple)"
                opacity={0.3}
                initial={{ scaleY: 0, transformOrigin: "center bottom" }}
                animate={{ scaleY: mounted ? 1 : 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 1.3 + i * 0.08,
                  ease: "easeOut" 
                }}
              />
            );
          })}
        </motion.g>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-zen-sage" />
          <span className="text-zen-charcoal-light">GitHub</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-zen-blue" />
          <span className="text-zen-charcoal-light">Slack</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-zen-purple" />
          <span className="text-zen-charcoal-light">Linear</span>
        </div>
      </div>
    </div>
  );
}