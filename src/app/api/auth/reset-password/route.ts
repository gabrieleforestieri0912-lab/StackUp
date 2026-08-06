import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase-admin';
import { rateLimit, rateLimitKey } from '../../../../lib/rateLimit';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { allowed, retryAfter } = await rateLimit(rateLimitKey(req, 'reset-password'), 5, 60_000);
  if (!allowed) {
    return NextResponse.json(
      { message: `Troppe richieste. Riprova tra ${retryAfter} secondi.` },
      { status: 429 },
    );
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const token = typeof body.token === 'string' ? body.token : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!token || !password) {
    return NextResponse.json({ message: 'Token e password richiesti' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ message: 'La password deve essere di almeno 8 caratteri' }, { status: 400 });
  }
  if (password.length > 128) {
    return NextResponse.json({ message: 'Password troppo lunga' }, { status: 400 });
  }

  try {
    const { data: verifyData, error: verifyError } = await supabaseAdmin.auth.verifyOtp({
      token_hash: token,
      type: 'recovery',
    });

    if (verifyError || !verifyData?.user) {
      return NextResponse.json({ message: 'Token non valido o scaduto' }, { status: 400 });
    }

    const userId = verifyData.user.id;
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password,
    });

    if (updateError) {
      console.error('[reset-password] update error:', updateError);
      return NextResponse.json(
        { message: "Errore durante l'aggiornamento della password" },
        { status: 500 },
      );
    }

    try {
      await supabaseAdmin.auth.admin.signOut(userId);
    } catch {
      // non-bloccante
    }

    return NextResponse.json({ message: 'Password aggiornata con successo' });
  } catch (error) {
    console.error('[reset-password] error:', error);
    return NextResponse.json({ message: 'Errore del server' }, { status: 500 });
  }
}
