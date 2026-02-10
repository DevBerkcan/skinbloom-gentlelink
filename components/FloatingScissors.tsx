"use client";

import { motion } from "framer-motion";
import { Scissors } from "lucide-react";

interface FloatingScissorsProps {
  delay?: number;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size?: number;
}

export const FloatingScissors = ({
  delay = 0,
  position = "top-right",
  size = 40,
}: FloatingScissorsProps) => {
  const positions = {
    "top-left": "top-10 left-10",
    "top-right": "top-10 right-10",
    "bottom-left": "bottom-10 left-10",
    "bottom-right": "bottom-10 right-10",
  };

  return (
    <motion.div
      className={`pointer-events-none fixed ${positions[position]} z-10 text-barber-red/20`}
      initial={{ opacity: 0, scale: 0, rotate: -45 }}
      animate={{
        opacity: [0.1, 0.3, 0.1],
        scale: [1, 1.1, 1],
        rotate: [-45, -35, -45],
        y: [0, -20, 0],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <motion.div
        animate={{
          rotate: [0, 15, 0, -15, 0],
        }}
        transition={{
          duration: 2,
          delay: delay + 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Scissors size={size} strokeWidth={1.5} />
      </motion.div>
    </motion.div>
  );
};

export const AnimatedScissorsDecor = () => {
  return (
    <>
      {/* Mehrere schwebende Scheren an verschiedenen Positionen */}
      <FloatingScissors position="top-left" delay={0} size={35} />
      <FloatingScissors position="top-right" delay={1} size={45} />
      <FloatingScissors position="bottom-left" delay={2} size={40} />
      <FloatingScissors position="bottom-right" delay={1.5} size={38} />
    </>
  );
};
