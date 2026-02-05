"use client";

import { useEffect, useRef, useState } from "react";
import { hasKlaroConsent } from "@/components/KlaroCookieConsent";

/**
 * Analytics event payload structure
 */
interface AnalyticsEvent {
  eventName: string;
  timestamp: number;
  path: string;
  sessionId: string;
  data?: Record<string, any>;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  device?: {
    screenWidth: number;
    screenHeight: number;
    userAgent: string;
  };
}

/**
 * Get or create a unique session ID stored in localStorage
 * This persists across page reloads but is unique per browser
 */
const getSessionId = (): string => {
  if (typeof window === "undefined") return "";

  const SESSION_KEY = "keinfriseur_session_id";
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
};

/**
 * Capture UTM parameters from URL and store in sessionStorage
 * This allows us to track marketing campaign performance
 */
const captureUTMParameters = (): Record<string, string> | undefined => {
  if (typeof window === "undefined") return undefined;

  const UTM_STORAGE_KEY = "keinfriseur_utm";

  // Try to get existing UTM params from sessionStorage
  const storedUTM = sessionStorage.getItem(UTM_STORAGE_KEY);
  if (storedUTM) {
    try {
      return JSON.parse(storedUTM);
    } catch {
      // Invalid JSON, continue to check URL
    }
  }

  // Check URL for UTM parameters
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams: Record<string, string> = {};

  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach(
    (param) => {
      const value = urlParams.get(param);
      if (value) {
        utmParams[param.replace("utm_", "")] = value;
      }
    }
  );

  // Store if we found any UTM params
  if (Object.keys(utmParams).length > 0) {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmParams));
    return utmParams;
  }

  return undefined;
};

/**
 * Get device information for analytics
 */
const getDeviceInfo = () => {
  if (typeof window === "undefined") return undefined;

  return {
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    userAgent: navigator.userAgent,
  };
};

/**
 * Main analytics hook mit Klaro Cookie Consent Integration
 *
 * Usage:
 * ```tsx
 * const { trackEvent } = useAnalytics();
 *
 * // Track a custom event
 * trackEvent("button_click", { buttonName: "Instagram" });
 * ```
 *
 * WICHTIG: Analytics wird nur getrackt wenn User Consent gegeben hat!
 */
export const useAnalytics = () => {
  const pageLoadTime = useRef<number>(Date.now());
  const [hasAnalyticsConsent, setHasAnalyticsConsent] = useState(false);

  /**
   * Prüfe Klaro Consent Status
   */
  useEffect(() => {
    const checkConsent = () => {
      const consent = hasKlaroConsent("analytics");
      setHasAnalyticsConsent(consent);
    };

    // Initial check (verzögert, damit Klaro Zeit hat zu laden)
    setTimeout(checkConsent, 100);

    // Listen for Klaro consent changes
    if (typeof window !== "undefined") {
      window.addEventListener("klaro-analytics-consent", checkConsent);

      return () => {
        window.removeEventListener("klaro-analytics-consent", checkConsent);
      };
    }
  }, []);

  /**
   * Send an analytics event to the backend
   * WICHTIG: Nur wenn User Consent gegeben hat!
   */
  const trackEvent = async (
    eventName: string,
    data?: Record<string, any>
  ): Promise<void> => {
    // Prüfe Consent vor dem Tracking
    if (!hasAnalyticsConsent) {
      console.log(
        `Analytics blocked: User has not consented to performance cookies (Event: ${eventName})`
      );
      return;
    }

    try {
      const payload: AnalyticsEvent = {
        eventName,
        timestamp: Date.now(),
        path: window.location.pathname + window.location.search,
        sessionId: getSessionId(),
        data,
        utm: captureUTMParameters(),
        device: getDeviceInfo(),
      };

      // Send to analytics endpoint
      // Using keepalive ensures the request completes even if the page is closing
      await fetch("/api/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    } catch (error) {
      // Silently fail - we don't want analytics errors to break the app
      console.error("Analytics error:", error);
    }
  };

  /**
   * Track page view on mount
   */
  useEffect(() => {
    trackEvent("page_view");
  }, []);

  /**
   * Track time on page when user leaves
   */
  useEffect(() => {
    const handleBeforeUnload = () => {
      const timeOnPage = Date.now() - pageLoadTime.current;
      trackEvent("time_on_page", { milliseconds: timeOnPage });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Also track time on page when component unmounts
      const timeOnPage = Date.now() - pageLoadTime.current;
      trackEvent("time_on_page", { milliseconds: timeOnPage });
    };
  }, []);

  return {
    trackEvent,
  };
};
