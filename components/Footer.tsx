"use client";

import { motion } from "framer-motion";
import { Instagram, Facebook, Mail } from "lucide-react";
import { KlaroCookieSettingsButton } from "./KlaroCookieConsent";

export const Footer = () => {
  const socialLinks = [
    {
      name: "Instagram",
      href: "https://instagram.com/skinbloom.aesthetics",
      icon: Instagram,
    },
    {
      name: "Facebook",
      href: "https://facebook.com/skinbloom.aesthetics",
      icon: Facebook,
    },
    {
      name: "Email",
      href: "mailto:info@skinbloom-aesthetics.ch",
      icon: Mail,
    },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="mt-12 pb-8 text-center"
    >
      {/* Social icons */}
      <div className="mb-4 flex items-center justify-center gap-4">
        {socialLinks.map((social, index) => (
          <motion.a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 + index * 0.1 }}
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-skinbloom-grey-200 text-skinbloom-grey-600 transition-colors hover:bg-skinbloom-black hover:text-skinbloom-white"
          >
            <social.icon size={18} />
          </motion.a>
        ))}
      </div>

      {/* Legal links */}
      <div className="mb-4 flex items-center justify-center gap-4 text-xs text-skinbloom-grey-500">
        <a
          href="/impressum"
          className="transition-colors hover:text-skinbloom-black hover:underline"
        >
          Impressum
        </a>
        <span className="text-skinbloom-grey-300">•</span>
        <a
          href="/datenschutz"
          className="transition-colors hover:text-skinbloom-black hover:underline"
        >
          Datenschutz
        </a>
        <span className="text-skinbloom-grey-300">•</span>
        <KlaroCookieSettingsButton />
      </div>

      {/* Copyright */}
      <p className="text-xs text-skinbloom-grey-400">
        © {new Date().getFullYear()} Skinbloom Aesthetics. Alle Rechte vorbehalten.
      </p>
    </motion.footer>
  );
};
