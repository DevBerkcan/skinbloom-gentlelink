"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export const ProfileCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative mb-8 text-center"
    >

      {/* Logo/Avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mx-auto mb-6 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full shadow-lg ring-4 ring-skinbloom-white bg-skinbloom-white"
      >
        <Image
          src="/logo.png"
          alt="Skinbloom Aesthetics Logo"
          width={128}
          height={128}
          className="h-full w-full object-contain p-2"
          priority
        />
      </motion.div>

      {/* Salon Name */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-3 text-3xl font-extrabold tracking-tight text-skinbloom-black"
      >
        SKINBLOOM AESTHETICS
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-4 px-4 text-base text-skinbloom-grey-600 text-balance"
      >
        Professionelle ästhetische Behandlungen – natürliche Schönheit & individuelle Beratung
      </motion.p>

      {/* Location & Booking Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-center justify-center gap-2 text-sm text-skinbloom-grey-500"
      >
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-skinbloom-black" />
          <span>Elisabethenstrasse 41, Basel</span>
        </div>
        <span className="text-xs">Termin nur mit Online-Buchung</span>
      </motion.div>

      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mx-auto mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-skinbloom-grey-700 via-skinbloom-black to-skinbloom-grey-700"
      />
    </motion.div>
  );
};
