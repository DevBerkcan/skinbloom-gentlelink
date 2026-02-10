"use client";

import { motion } from "framer-motion";
import { LucideIcon, Scissors } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useState } from "react";

interface LinkButtonProps {
  href: string;
  label: string;
  icon: LucideIcon;
  position: number;
  variant?: "primary" | "secondary";
}

export const LinkButton = ({
  href,
  label,
  icon: Icon,
  position,
  variant = "primary",
}: LinkButtonProps) => {
  const { trackEvent } = useAnalytics();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    trackEvent("link_click", {
      label,
      url: href,
      position,
    });
  };

  const isPrimary = variant === "primary";

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.1 * position,
        duration: 0.4,
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      whileTap={{
        scale: 0.98,
      }}
      className={`
        group relative flex w-full items-center justify-between gap-3 overflow-hidden
        rounded-2xl px-6 py-4 shadow-md transition-all duration-300
        hover:shadow-xl focus-visible:shadow-xl
        ${
          isPrimary
            ? "bg-gradient-to-r from-barber-red to-barber-darkRed text-barber-white hover:from-barber-darkRed hover:to-barber-red"
            : "border-2 border-barber-grey-200 bg-barber-white text-barber-black hover:border-barber-red hover:bg-barber-cream"
        }
      `}
      aria-label={`${label} öffnen`}
    >
      {/* Background gradient effect on hover */}
      <motion.div
        className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10 ${
          isPrimary ? "bg-barber-white" : "bg-barber-red"
        }`}
        initial={false}
      />

      {/* Icon */}
      <motion.div
        className="relative z-10"
        whileHover={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.5 }}
      >
        <Icon
          size={24}
          className={isPrimary ? "text-barber-white" : "text-barber-red"}
        />
      </motion.div>

      {/* Label */}
      <span className="relative z-10 flex-1 text-left font-semibold">
        {label}
      </span>

      {/* Arrow indicator */}
      <motion.svg
        className={`relative z-10 h-5 w-5 ${
          isPrimary ? "text-barber-white" : "text-barber-grey-400"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        initial={{ x: 0 }}
        whileHover={{ x: 5 }}
        transition={{ duration: 0.3 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </motion.svg>

      {/* Shine effect on hover */}
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
        whileHover={{
          translateX: ["100%", "200%"],
          transition: { duration: 0.6 },
        }}
      />

      {/* Scissors hover effect */}
      {isHovered && (
        <motion.div
          initial={{ x: -20, y: -10, opacity: 0, rotate: -45 }}
          animate={{ x: 5, y: -5, opacity: 0.3, rotate: -30 }}
          exit={{ x: 20, y: 0, opacity: 0, rotate: -15 }}
          transition={{ duration: 0.3 }}
          className="absolute left-2 top-2 pointer-events-none"
        >
          <Scissors
            size={16}
            className={isPrimary ? "text-barber-white" : "text-barber-red"}
          />
        </motion.div>
      )}
    </motion.a>
  );
};
