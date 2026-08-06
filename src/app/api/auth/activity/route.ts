import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { supabaseAdmin, getAuthUser } from '../../../../lib/supabase-admin';
import { rateLimit, rateLimitKey } from '../../../../lib/rateLimit';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Non autorizzato' }, { status: 401 });
  }

  const token = authHeader.substring('Bearer '.length);
  const authUser = await getAuthUser(token);
  if (!authUser) {
    return NextResponse.json({ message: 'Token non valido' }, { status: 401 });
  }

  const { allowed, retryAfter } = await rateLimit(
    rateLimitKey(req, `activity_${authUser.id}`),
    6,
    60_000,
  );
  if (!allowed) {
    return NextResponse.json(
      { message: `Troppe richieste. Riprova tra ${retryAfter}s.`, throttled: true },
      { status: 429 },
    );
  }

  try {
    const { data: profile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('study_streak, last_active_date')
      .eq('id', authUser.id)
      .single();

    if (fetchError || !profile) {
      return NextResponse.json({ message: 'Profilo non trovato' }, { status: 404 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActive = profile.last_active_date ? new Date(profile.last_active_date) : null;

    let newStreak = profile.study_streak || 0;
    let changed = false;

    if (!lastActive) {
      newStreak = 1;
      changed = true;
    } else {
      lastActive.setHours(0, 0, 0, 0);
      const diffDays = Math.round(
        (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (diffDays === 0) {
        // stesso giorno: nessun update
      } else if (diffDays === 1) {
        newStreak += 1;
        changed = true;
      } else {
        newStreak = 1;
        changed = true;
      }
    }

    if (changed) {
      await supabaseAdmin
        .from('profiles')
        .update({
          study_streak: newStreak,
          last_active_date: new Date().toISOString(),
        })
        .eq('id', authUser.id);
    }

    return NextResponse.json({ studyStreak: newStreak, updated: changed });
  } catch (error) {
    console.error('[activity] error:', error);
    return NextResponse.json({ message: 'Errore del server' }, { status: 500 });
  }
}
