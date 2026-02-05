"use client";

import Script from "next/script";

/**
 * Microsoft Clarity Analytics Component
 *
 * Bietet:
 * - Session Recordings (Ansehen wie User die Seite nutzen)
 * - Heatmaps (Wo wird geklickt und gescrollt)
 * - Click Tracking (Alle Button-Klicks automatisch)
 * - User Behavior Analytics
 *
 * Setup:
 * 1. Gehe zu https://clarity.microsoft.com/
 * 2. Erstelle ein neues Projekt
 * 3. Kopiere die Project ID
 * 4. Füge sie als NEXT_PUBLIC_CLARITY_PROJECT_ID in .env.local ein
 */
export function MicrosoftClarity() {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  // Nur in Production laden wenn Project ID vorhanden
  if (!projectId || process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${projectId}");
        `,
      }}
    />
  );
}

/**
 * Clarity Custom Events Helper
 *
 * Du kannst custom events für spezifische User-Aktionen tracken
 */
export const ClarityEvents = {
  /**
   * Track wenn User auf einen bestimmten Button klickt
   */
  trackButtonClick: (buttonName: string, metadata?: Record<string, any>) => {
    if (typeof window !== "undefined" && (window as any).clarity) {
      (window as any).clarity("event", `button_click_${buttonName}`, metadata);
    }
  },

  /**
   * Track Booking-Schritte für Funnel-Analyse
   */
  trackBookingStep: (step: number, stepName: string) => {
    if (typeof window !== "undefined" && (window as any).clarity) {
      (window as any).clarity("event", "booking_step", {
        step,
        stepName,
      });
    }
  },

  /**
   * Track welcher Service ausgewählt wurde
   */
  trackServiceSelection: (serviceName: string, price: number) => {
    if (typeof window !== "undefined" && (window as any).clarity) {
      (window as any).clarity("event", "service_selected", {
        serviceName,
        price,
      });
    }
  },

  /**
   * Track erfolgreiche Buchung
   */
  trackBookingSuccess: (bookingNumber: string, serviceName: string) => {
    if (typeof window !== "undefined" && (window as any).clarity) {
      (window as any).clarity("event", "booking_success", {
        bookingNumber,
        serviceName,
      });
    }
  },

  /**
   * Track Link-Klicks (Instagram, WhatsApp, etc.)
   */
  trackLinkClick: (linkLabel: string, linkUrl: string) => {
    if (typeof window !== "undefined" && (window as any).clarity) {
      (window as any).clarity("event", "link_click", {
        label: linkLabel,
        url: linkUrl,
      });
    }
  },

  /**
   * Setze Custom Tags für User-Segmentierung
   */
  setUserTag: (key: string, value: string) => {
    if (typeof window !== "undefined" && (window as any).clarity) {
      (window as any).clarity("set", key, value);
    }
  },
};
