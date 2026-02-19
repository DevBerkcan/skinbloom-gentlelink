import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { KlaroCookieConsent } from "@/components/KlaroCookieConsent";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { TrackingProvider } from "@/components/analytics/TrackingProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Skinbloom Aesthetics – Link in Bio",
  description:
    "Skinbloom Aesthetics in Basel – Hautpflege bei Skinbloom Aesthetics. Jetzt online Termin buchen!",
  keywords: [
    "Skinbloom Aesthetics",
    "Skinbloom Aesthetics",
    "Skinbloom Aesthetics",
    "Skinbloom",
    "Hautpflege",
    "Elisabethenstrasse 41, 4051 Basel, Schweiz",
  ],
  openGraph: {
    title: "Skinbloom Aesthetics – Skinbloom Aesthetics",
    description:
      "Skinbloom Aesthetics in Basel – moderne Cuts, Fades & Bartpflege. Jetzt online buchen!",
    type: "website",
    locale: "de_DE",
    siteName: "Skinbloom Aesthetics",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skinbloom Aesthetics – Premium Skinbloom Aesthetics Basel",
    description:
      "Skinbloom Aesthetics in Basel – moderne Cuts, Fades & Bartpflege. Online buchen!",
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
        <NextUIProvider>
          <Suspense fallback={null}>
            <TrackingProvider>
              <KlaroCookieConsent />
              {children}
            </TrackingProvider>
          </Suspense>
        </NextUIProvider>
      </body>
    </html>
  );
}
