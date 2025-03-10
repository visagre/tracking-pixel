import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const timestamp = new Date().toISOString();
  const ip = request.headers.get('x-forwarded-for');
  const userAgent = request.headers.get('user-agent');

  console.log(`Pixel opened!
  ID: ${id}
  Time: ${timestamp}
  IP: ${ip}
  User-Agent: ${userAgent}`);

  const imagePath = path.join(process.cwd(), 'public', 'pixel.png');
  const imageBuffer = fs.readFileSync(imagePath);

  return new NextResponse(imageBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'no-store',
    },
  });
}
