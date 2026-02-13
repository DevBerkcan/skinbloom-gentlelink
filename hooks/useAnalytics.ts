// hooks/useAnalytics.ts
"use client";

import { useEffect, useRef, useState } from "react";
import { hasKlaroConsent } from "@/components/KlaroCookieConsent";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '') 
  : "https://localhost:7020/api";

/**
 * Get or create a unique session ID stored in localStorage
 */
const getSessionId = (): string => {
  if (typeof window === "undefined") return "";

  const SESSION_KEY = "tracking_session_id";
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
    console.log("New session created:", sessionId);
  }

  return sessionId;
};

/**
 * Track page view directly to backend
 */
const trackPageView = async (sessionId: string): Promise<boolean> => {
  try {
    const payload = {
      pageUrl: window.location.pathname,
      referrerUrl: document.referrer || undefined,
      sessionId: sessionId,
    };

    console.log("📊 Tracking page view to:", `${API_BASE_URL}/admin/Tracking/pageview`);
    console.log("📦 Payload:", payload);

    const response = await fetch(`${API_BASE_URL}/admin/Tracking/pageview`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    });

    if (response.ok) {
      console.log("✅ Page view tracked successfully");
      return true;
    } else {
      console.error("❌ Failed to track page view. Status:", response.status);
      const text = await response.text();
      console.error("Response:", text);
      return false;
    }
  } catch (error) {
    console.error("❌ Error tracking page view:", error);
    return false;
  }
};

/**
 * Track link click
 */
const trackLinkClick = async (linkName: string, linkUrl: string, sessionId: string): Promise<boolean> => {
  try {
    const payload = {
      linkName,
      linkUrl,
      sessionId,
    };

    console.log("🔗 Tracking link click:", linkName);

    const response = await fetch(`${API_BASE_URL}/admin/tracking/click`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    });

    if (response.ok) {
      console.log("✅ Link click tracked successfully");
      return true;
    } else {
      console.error("❌ Failed to track link click. Status:", response.status);
      return false;
    }
  } catch (error) {
    console.error("❌ Error tracking link click:", error);
    return false;
  }
};

/**
 * Main analytics hook
 */
export const useAnalytics = () => {
  const pageLoadTime = useRef<number>(Date.now());
  const [hasAnalyticsConsent, setHasAnalyticsConsent] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  
  // Use a ref to track if we've already sent the page view
  // This persists across re-renders and doesn't cause re-renders
  const hasTrackedPageView = useRef(false);

  // Initialize session ID on mount
  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  /**
   * Check Klaro Consent Status
   */
  useEffect(() => {
    const checkConsent = () => {
      // For testing, you can set this to true
      // In production, use: const consent = hasKlaroConsent("analytics");
      const consent = true; // TEMP: Always true for testing
      setHasAnalyticsConsent(consent);
      console.log("Analytics consent:", consent ? "✅ Granted" : "❌ Denied");
    };

    // Initial check
    checkConsent();

    // Listen for consent changes
    if (typeof window !== "undefined") {
      const handleConsentChange = () => {
        console.log("Consent changed, rechecking...");
        checkConsent();
      };
      
      window.addEventListener("klaro-analytics-consent", handleConsentChange);
      return () => {
        window.removeEventListener("klaro-analytics-consent", handleConsentChange);
      };
    }
  }, []);

  /**
   * Track page view - ONLY ONCE using useRef
   */
  useEffect(() => {
    // Only track if:
    // 1. We have consent
    // 2. We have a session ID
    // 3. We haven't tracked yet (using ref, not state)
    if (!hasAnalyticsConsent || !sessionId || hasTrackedPageView.current) {
      if (!hasAnalyticsConsent) console.log("⏸️ Page view blocked: No consent");
      if (!sessionId) console.log("⏸️ Page view blocked: No session ID");
      if (hasTrackedPageView.current) console.log("⏸️ Page view blocked: Already tracked (ref)");
      return;
    }

    // Mark as tracked immediately (synchronously)
    // This prevents any other renders from triggering another track
    hasTrackedPageView.current = true;
    console.log("🎯 Will track page view (first time only)");

    const trackView = async () => {
      await trackPageView(sessionId);
      // No need to set state here - ref already marked as true
    };

    trackView();
    
    // No cleanup needed - we want this to run only once
  }, [hasAnalyticsConsent, sessionId]); // Remove hasTrackedPageView from dependencies

  /**
   * Track time on page when user leaves
   */
  useEffect(() => {
    if (!hasAnalyticsConsent) return;

    const handleBeforeUnload = () => {
      const timeOnPage = Math.round((Date.now() - pageLoadTime.current) / 1000);
      console.log(`⏱️ Time on page: ${timeOnPage} seconds`);
      // You can send this to your backend if needed
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasAnalyticsConsent]);

  /**
   * Track a custom event
   */
  const trackEvent = async (eventName: string, data?: Record<string, any>): Promise<void> => {
    if (!hasAnalyticsConsent) {
      console.log(`⏸️ Event blocked (no consent): ${eventName}`);
      return;
    }

    console.log(`📊 Tracking event: ${eventName}`, data);

    switch (eventName) {
      case "link_click":
        if (data?.label && data?.href) {
          await trackLinkClick(data.label, data.href, sessionId);
        }
        break;
      
      // Add more event types here as needed
      
      default:
        console.log(`Unknown event type: ${eventName}`);
    }
  };

  return {
    trackEvent,
  };
};