"use client";

import Script from "next/script";
import { useEffect } from "react";

interface OneTrustProps {
  domainId: string;
}

/**
 * OneTrust Cookie Consent Banner
 *
 * Setup-Anleitung:
 * 1. Gehe zu https://www.onetrust.com/
 * 2. Erstelle einen Account oder logge dich ein
 * 3. Kopiere deine Domain Script ID aus dem Dashboard
 * 4. Füge sie in lib/config.ts unter oneTrustDomainId ein
 *
 * Hinweis: Für Test-Zwecke ist ein Beispiel-ID hinterlegt.
 */
export const OneTrust = ({ domainId }: OneTrustProps) => {
  useEffect(() => {
    // OneTrust Callback-Funktion für Consent-Änderungen
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.OptanonWrapper = function () {
        console.log("OneTrust: Consent updated");

        // Event für Consent-Änderungen
        window.dispatchEvent(new Event("onetrust-consent-updated"));
      };
    }
  }, []);

  if (!domainId) {
    console.warn("OneTrust Domain ID fehlt. Bitte in lib/config.ts konfigurieren.");
    return null;
  }

  return (
    <>
      {/* OneTrust Cookies Consent Notice start */}
      <Script
        id="onetrust-banner-sdk"
        src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
        type="text/javascript"
        charSet="UTF-8"
        data-domain-script={domainId}
        strategy="beforeInteractive"
      />

      {/* OneTrust Cookie Settings Button (optional) */}
      <Script
        id="onetrust-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            function OptanonWrapper() {
              // Callback wird aufgerufen wenn Consent geändert wird
              console.log('OneTrust loaded');
            }
          `,
        }}
      />
    </>
  );
};

/**
 * OneTrust Cookie Settings Button
 * Zeigt einen Button an, mit dem User ihre Cookie-Einstellungen ändern können
 */
export const OneTrustSettingsButton = () => {
  const openPreferences = () => {
    // @ts-ignore - OneTrust global function
    if (typeof window !== "undefined" && window.OneTrust) {
      // @ts-ignore
      window.OneTrust.ToggleInfoDisplay();
    }
  };

  return (
    <button
      onClick={openPreferences}
      className="text-sm text-barber-grey-500 hover:text-barber-red transition-colors underline"
      aria-label="Cookie-Einstellungen ändern"
    >
      Cookie-Einstellungen
    </button>
  );
};
