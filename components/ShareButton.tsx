"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  Check,
  Copy,
  X,
  MessageCircle,
  Send,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  type LucideIcon
} from "lucide-react";
import { siteConfig } from "@/lib/config";

interface ShareButtonProps {
  variant?: "floating" | "inline";
}

export const ShareButton = ({ variant = "floating" }: ShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : siteConfig.url;
  const shareTitle = siteConfig.name;
  const shareText = siteConfig.description;

  /**
   * Native Web Share API
   * Funktioniert auf Mobile Devices (iOS, Android)
   */
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // User hat abgebrochen oder Fehler
        console.log("Share cancelled:", error);
      }
    } else {
      // Fallback: Öffne Share-Menü
      setIsOpen(true);
    }
  };

  /**
   * Link in Zwischenablage kopieren
   */
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  /**
   * Social Media Share URLs
   */
  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
  };

  if (variant === "inline") {
    return (
      <motion.button
        onClick={handleNativeShare}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 rounded-xl border-2 border-barber-grey-200 bg-barber-white px-4 py-2 text-sm font-semibold text-barber-black transition-colors hover:border-barber-red hover:bg-barber-cream"
      >
        <Share2 size={18} />
        <span>Teilen</span>
      </motion.button>
    );
  }

  return (
    <>
      {/* Floating Share Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-barber-red to-barber-darkRed text-barber-white shadow-lg transition-shadow hover:shadow-xl"
        aria-label="Seite teilen"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="share"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Share2 size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Share Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
            />

            {/* Share Panel */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-24 right-6 z-40 w-80 rounded-2xl border-2 border-barber-grey-200 bg-barber-white p-6 shadow-2xl"
            >
              <h3 className="mb-4 text-lg font-bold text-barber-black">
                Seite teilen
              </h3>

              {/* Copy Link */}
              <button
                onClick={copyToClipboard}
                className="mb-4 flex w-full items-center justify-between rounded-xl border-2 border-barber-grey-200 bg-barber-grey-50 px-4 py-3 text-sm transition-colors hover:border-barber-red"
              >
                <span className="truncate font-medium text-barber-grey-700">
                  {shareUrl.replace(/^https?:\/\//, "")}
                </span>
                {copied ? (
                  <Check size={18} className="text-green-600" />
                ) : (
                  <Copy size={18} className="text-barber-grey-400" />
                )}
              </button>

              {copied && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-3 text-center text-sm text-green-600"
                >
                  ✓ Link kopiert!
                </motion.p>
              )}

              {/* Social Share Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <ShareLink
                  href={shareLinks.whatsapp}
                  label="WhatsApp"
                  icon={MessageCircle}
                  color="bg-green-500"
                />
                <ShareLink
                  href={shareLinks.telegram}
                  label="Telegram"
                  icon={Send}
                  color="bg-blue-500"
                />
                <ShareLink
                  href={shareLinks.facebook}
                  label="Facebook"
                  icon={Facebook}
                  color="bg-blue-600"
                />
                <ShareLink
                  href={shareLinks.twitter}
                  label="Twitter"
                  icon={Twitter}
                  color="bg-sky-500"
                />
                <ShareLink
                  href={shareLinks.linkedin}
                  label="LinkedIn"
                  icon={Linkedin}
                  color="bg-blue-700"
                />
                <ShareLink
                  href={shareLinks.email}
                  label="E-Mail"
                  icon={Mail}
                  color="bg-barber-grey-600"
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

interface ShareLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
  color: string;
}

const ShareLink = ({ href, label, icon: Icon, color }: ShareLinkProps) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
    className={`flex flex-col items-center justify-center gap-2 rounded-xl ${color} p-4 text-white shadow-md transition-shadow hover:shadow-lg`}
  >
    <Icon size={24} strokeWidth={2} />
    <span className="text-xs font-semibold">{label}</span>
  </motion.a>
);
