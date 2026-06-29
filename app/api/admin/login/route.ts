import { NextResponse } from 'next/server';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';
import { checkRateLimit, recordFailure, clearFailures, getClientIp } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { password } = await request.json();

    const { allowed, retryAfter } = await checkRateLimit(ip);
    if (!allowed) {
      const hours = Math.ceil((retryAfter || 0) / (1000 * 60 * 60));
      return NextResponse.json(
        { error: `Too many failed attempts. Try again in ${hours} hours.` },
        { status: 429 }
      );
    }

    if (password === process.env.ADMIN_KEY) {
      await clearFailures(ip);
      const session = await encrypt({ isAdmin: true, time: new Date().toISOString() });
      
      cookies().set('admin_session', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24
      });

      return NextResponse.json({ success: true });
    } else {
      await recordFailure(ip);
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
