import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || "unknown";
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    const timestamp = new Date().toISOString();

    // 1️⃣ Increase the open count in Vercel KV (persists across requests)
    await kv.incr(`opens:${id}`);

    // 2️⃣ Store each open event with timestamp for better tracking
    const eventKey = `open_events:${id}:${Date.now()}`;
    await kv.set(eventKey, { timestamp, ip, userAgent });

    // 3️⃣ Log the event for debugging
    console.log(`📩 Email Opened!
    ID: ${id}
    Time: ${timestamp}
    IP: ${ip}
    User-Agent: ${userAgent}`);

    // 4️⃣ Load the pixel image
    const pixelPath = path.join(process.cwd(), "public", "pixel.png");
    const imageBuffer = fs.readFileSync(pixelPath);

    return new NextResponse(imageBuffer, {
        headers: {
            "Content-Type": "image/png",
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            "Expires": "0",
            "Pragma": "no-cache",
        },
    });
}

