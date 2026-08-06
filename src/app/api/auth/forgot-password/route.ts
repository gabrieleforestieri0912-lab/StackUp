import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase-admin';
import { rateLimit, rateLimitKey } from '../../../../lib/rateLimit';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { allowed, retryAfter } = await rateLimit(rateLimitKey(req, 'forgot-password'), 5, 60_000);
  if (!allowed) {
    return NextResponse.json(
      { message: `Troppe richieste. Riprova tra ${retryAfter} secondi.` },
      { status: 429 },
    );
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const email = typeof body.email === 'string' ? body.email : '';

  if (!email) {
    return NextResponse.json({ message: 'Email richiesta' }, { status: 400 });
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: `${baseUrl}/auth/callback?type=recovery`,
    });

    if (error) {
      console.error('[forgot-password] error:', error);
    }

    return NextResponse.json({
      message: "Se l'email esiste, riceverai un link per il reset della password.",
    });
  } catch (error) {
    console.error('[forgot-password] error:', error);
    return NextResponse.json({ message: "Errore durante l'invio dell'email" }, { status: 500 });
  }
}
