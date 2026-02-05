import { NextRequest, NextResponse } from "next/server";

/**
 * Analytics API endpoint
 *
 * This endpoint receives analytics events from the client.
 * Currently it just logs them to the console, but you can easily extend this to:
 *
 * - Send to PostHog: await posthog.capture(...)
 * - Send to Plausible: await fetch('https://plausible.io/api/event', ...)
 * - Store in a database: await db.analytics.create(...)
 * - Send to Google Analytics: using measurement protocol
 * - Send to a custom analytics service
 *
 * @param request - The incoming POST request with analytics data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Extract relevant fields for logging
    const {
      eventName,
      timestamp,
      path,
      sessionId,
      data,
      utm,
      device,
    } = body;

    // Log the analytics event to console
    // In production, replace this with your analytics service
    console.log("📊 Analytics Event:", {
      event: eventName,
      time: new Date(timestamp).toISOString(),
      path,
      sessionId: sessionId?.substring(0, 20) + "...", // Truncate for readability
      data,
      ...(utm && { utm }),
      ...(device && {
        device: {
          screen: `${device.screenWidth}x${device.screenHeight}`,
          userAgent: device.userAgent?.substring(0, 50) + "...",
        }
      }),
    });

    // TODO: Replace with your actual analytics implementation
    // Example integrations:

    // PostHog:
    // await posthog.capture({
    //   distinctId: sessionId,
    //   event: eventName,
    //   properties: { ...data, path, utm, device }
    // });

    // Plausible:
    // await fetch('https://plausible.io/api/event', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     name: eventName,
    //     url: `https://keinfriseur.de${path}`,
    //     domain: 'keinfriseur.de',
    //     props: data
    //   })
    // });

    // Database:
    // await prisma.analyticsEvent.create({
    //   data: {
    //     eventName,
    //     timestamp: new Date(timestamp),
    //     path,
    //     sessionId,
    //     data: JSON.stringify(data),
    //     utm: JSON.stringify(utm),
    //     device: JSON.stringify(device),
    //   }
    // });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing analytics event:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process event" },
      { status: 500 }
    );
  }
}

/**
 * Handle other HTTP methods
 */
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
