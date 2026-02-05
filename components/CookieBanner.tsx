"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem("keinfriseur_cookie_consent");
    if (!cookieConsent) {
      // Show banner after a short delay
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("keinfriseur_cookie_consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("keinfriseur_cookie_consent", "declined");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md md:left-auto md:right-8"
        >
          <div className="relative overflow-hidden rounded-2xl border-2 border-barber-grey-200 bg-barber-white p-6 shadow-2xl">
            {/* Close button */}
            <button
              onClick={handleDecline}
              className="absolute right-3 top-3 rounded-full p-1 text-barber-grey-400 transition-colors hover:bg-barber-grey-100 hover:text-barber-grey-600"
              aria-label="Cookie-Banner schließen"
            >
              <X size={20} />
            </button>

            {/* Icon */}
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-barber-red/10">
                <Cookie className="text-barber-red" size={20} />
              </div>
              <h3 className="text-lg font-bold text-barber-black">
                Cookie-Hinweis
              </h3>
            </div>

            {/* Text */}
            <p className="mb-4 text-sm text-barber-grey-600">
              Wir verwenden Cookies, um deine Erfahrung zu verbessern und zu
              analysieren, wie unsere Website genutzt wird.
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <motion.button
                onClick={handleAccept}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 rounded-xl bg-gradient-to-r from-barber-red to-barber-darkRed px-4 py-2.5 text-sm font-semibold text-barber-white shadow-md transition-shadow hover:shadow-lg"
              >
                Akzeptieren
              </motion.button>
              <motion.button
                onClick={handleDecline}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 rounded-xl border-2 border-barber-grey-200 bg-barber-white px-4 py-2.5 text-sm font-semibold text-barber-grey-700 transition-colors hover:bg-barber-grey-50"
              >
                Ablehnen
              </motion.button>
            </div>

            {/* Decorative gradient */}
            <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-barber-red/10 to-barber-gold/10 blur-3xl" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
