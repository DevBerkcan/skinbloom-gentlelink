"use client";

import { motion } from "framer-motion";
import { Scissors } from "lucide-react";
import Image from "next/image";

export const ProfileCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative mb-8 text-center"
    >
      {/* Floating scissors decoration with cutting animation */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [-25, -20, -25],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-6 right-8 text-barber-red opacity-40"
        aria-hidden="true"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Scissors size={36} strokeWidth={2} />
        </motion.div>
      </motion.div>

      {/* Second scissors on the left for balance */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: 0.3,
          scale: 1,
          y: [0, 10, 0],
          rotate: [155, 160, 155],
        }}
        transition={{
          opacity: { delay: 0.3, duration: 0.5 },
          scale: { delay: 0.3, duration: 0.5 },
          y: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
          rotate: {
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          },
        }}
        className="absolute -top-4 left-6 text-barber-gold opacity-30"
        aria-hidden="true"
      >
        <Scissors size={28} strokeWidth={2} />
      </motion.div>

      {/* Logo/Avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mx-auto mb-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full shadow-lg ring-4 ring-barber-white"
      >
        <Image
          src="/logo.jpg"
          alt="Skinbloom Aesthetics Logo"
          width={96}
          height={96}
          className="h-full w-full object-cover"
          priority
        />
      </motion.div>

      {/* Salon Name */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-3 text-3xl font-extrabold tracking-tight text-barber-black"
      >
        SKINBLOOM AESTHETICS<span className="text-barber-red">.</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-4 px-4 text-base text-barber-grey-600 text-balance"
      >
        Dein Skinbloom Aesthetics
      </motion.p>

      {/* Location & Booking Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-center justify-center gap-2 text-sm text-barber-grey-500"
      >
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-barber-red" />
          <span>Elisabethenstrasse 41, 4051 Basel, Schweiz</span>
        </div>
        <span className="text-xs">Termin nur mit Online-Buchung</span>
      </motion.div>

      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mx-auto mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-barber-red via-barber-gold to-barber-red"
      />
    </motion.div>
  );
};
