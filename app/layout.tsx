import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { KlaroCookieConsent } from "@/components/KlaroCookieConsent";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { MicrosoftClarity } from "@/components/analytics/MicrosoftClarity";
import { TrackingProvider } from "@/components/analytics/TrackingProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Skinbloom Aesthetics – Link in Bio | Ästhetische Behandlungen Basel",
  description:
    "Professionelle ästhetische Behandlungen in Basel – natürliche Schönheit & individuelle Beratung bei Skinbloom Aesthetics. Jetzt online Termin vereinbaren!",
  keywords: [
    "Skinbloom Aesthetics",
    "Beauty Salon Basel",
    "Ästhetische Behandlungen",
    "Gesichtsbehandlung",
    "Anti-Aging",
    "Beauty Basel",
    "Kosmetikstudio",
    "Elisabethenstrasse",
  ],
  openGraph: {
    title: "Skinbloom Aesthetics – Ästhetische Behandlungen Basel",
    description:
      "Professionelle ästhetische Behandlungen in Basel – natürliche Schönheit & individuelle Beratung. Jetzt online Termin vereinbaren!",
    type: "website",
    locale: "de_CH",
    siteName: "Skinbloom Aesthetics",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skinbloom Aesthetics – Ästhetische Behandlungen Basel",
    description:
      "Professionelle ästhetische Behandlungen in Basel – natürliche Schönheit & individuelle Beratung. Jetzt Termin vereinbaren!",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <GoogleAnalytics />
        <MicrosoftClarity />
        <NextUIProvider>
          <Suspense fallback={null}>
            <TrackingProvider>
              {/* Klaro Cookie Consent - Open Source & Kostenlos */}
              <KlaroCookieConsent />
              {children}
            </TrackingProvider>
          </Suspense>
        </NextUIProvider>
      </body>
    </html>
  );
}
