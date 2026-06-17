import { NextResponse } from "next/server";

type SubscribePayload = {
  email?: string;
  firstName?: string;
  offer?: string;
};

function isNewsletterSignupOffer(offer: string): boolean {
  const normalized = offer.toLowerCase();
  return normalized.includes("notes") || normalized.includes("newsletter");
}

function isVoiceCheckOffer(offer: string): boolean {
  const normalized = offer.toLowerCase();
  return normalized.includes("voice-check") || normalized.includes("voicecheck");
}

export async function POST(request: Request) {
  let payload: SubscribePayload;

  try {
    payload = (await request.json()) as SubscribePayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const email = (payload.email ?? "").trim();
  const firstName = (payload.firstName ?? "").trim();
  const offer = (payload.offer ?? "").trim();

  if (!email || !firstName) {
    return NextResponse.json(
      { error: "Email and first name are required." },
      { status: 400 }
    );
  }

  const apiKey = process.env.LOOP_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Loops API key is not configured." },
      { status: 500 }
    );
  }

  try {
    const loopsRes = await fetch("https://app.loops.so/api/v1/events/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        eventName: offer,
        firstName,
        source: "miavka.ch",
      }),
    });

    if (!loopsRes.ok) {
      const text = await loopsRes.text();
      return NextResponse.json(
        { error: text || "Failed to subscribe via Loops." },
        { status: 500 }
      );
    }

    if (isNewsletterSignupOffer(offer)) {
      const welcomeRes = await fetch("https://app.loops.so/api/v1/events/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          eventName: "newsletterSignup",
        }),
      });

      if (!welcomeRes.ok) {
        const text = await welcomeRes.text();
        return NextResponse.json(
          { error: text || "Failed to trigger newsletter welcome sequence." },
          { status: 500 }
        );
      }
    }

    if (isVoiceCheckOffer(offer)) {
      const voiceCheckRes = await fetch("https://app.loops.so/api/v1/events/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          eventName: "voiceCheckDownload",
        }),
      });

      if (!voiceCheckRes.ok) {
        const text = await voiceCheckRes.text();
        return NextResponse.json(
          { error: text || "Failed to trigger voice check download sequence." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to reach Loops API." },
      { status: 500 }
    );
  }
}
