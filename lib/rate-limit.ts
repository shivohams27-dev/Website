import { supabaseAdmin } from './supabase';

const MAX_ATTEMPTS = 5;
const LOCKOUT_HOURS = 24 * 7; // 1 week

export async function checkRateLimit(ip: string): Promise<{ allowed: boolean; retryAfter?: number }> {
  const cutoff = new Date(Date.now() - LOCKOUT_HOURS * 60 * 60 * 1000).toISOString();

  const { data: recentFailures } = await supabaseAdmin
    .from('login_attempts')
    .select('id, failed_at')
    .eq('ip_address', ip)
    .gte('failed_at', cutoff)
    .order('failed_at', { ascending: false });

  if (!recentFailures || recentFailures.length < MAX_ATTEMPTS) {
    return { allowed: true };
  }

  const oldestFailure = new Date(recentFailures[recentFailures.length - 1].failed_at);
  const unlockAt = new Date(oldestFailure.getTime() + LOCKOUT_HOURS * 60 * 60 * 1000);

  if (new Date() < unlockAt) {
    return { allowed: false, retryAfter: unlockAt.getTime() - Date.now() };
  }

  await supabaseAdmin.from('login_attempts').delete().eq('ip_address', ip);
  return { allowed: true };
}

export async function recordFailure(ip: string) {
  await supabaseAdmin.from('login_attempts').insert({ ip_address: ip });
}

export async function clearFailures(ip: string) {
  await supabaseAdmin.from('login_attempts').delete().eq('ip_address', ip);
}

export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const real = request.headers.get('x-real-ip');
  if (real) return real;
  return 'unknown';
}
