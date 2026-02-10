"use client";

import { ProfileCard } from "@/components/ProfileCard";
import { LinkButton } from "@/components/LinkButton";
import { Footer } from "@/components/Footer";
import { AnimatedScissorsDecor } from "@/components/FloatingScissors";
import { ShareButton } from "@/components/ShareButton";
import { useAnalytics } from "@/hooks/useAnalytics";
import { socialLinks } from "@/lib/config";

export default function Home() {
  // Initialize analytics (tracks page view and time on page)
  useAnalytics();

  return (
    <div className="relative min-h-screen bg-barber-stripes">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-barber-cream via-barber-grey-50 to-barber-white" />

      {/* Animierte schwebende Scheren */}
      <AnimatedScissorsDecor />

      {/* Floating Share Button */}
      <ShareButton variant="floating" />

      {/* Main content */}
      <main className="relative flex min-h-screen items-center justify-center px-4 py-12">
        {/* Main card container */}
        <div className="w-full max-w-md">
          {/* White card with shadow */}
          <div className="rounded-3xl bg-barber-white p-8 shadow-2xl ring-1 ring-barber-grey-100">
            {/* Profile section */}
            <ProfileCard />

            {/* Links section */}
            <div className="space-y-3">
              {socialLinks.map((link, index) => (
                <LinkButton
                  key={link.label}
                  href={link.href}
                  label={link.label}
                  icon={link.icon}
                  position={index}
                  variant={link.variant}
                />
              ))}
            </div>

            {/* Footer */}
            <Footer />
          </div>

          {/* Decorative glow effects */}
          <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-barber-red/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-0 h-60 w-60 rounded-full bg-barber-gold/20 blur-3xl" />
        </div>
      </main>
    </div>
  );
}
