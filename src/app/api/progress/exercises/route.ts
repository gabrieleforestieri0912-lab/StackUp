import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { supabaseAdmin, getAuthUser, updateStreak } from '@/lib/supabase-admin';
import { grantCertificate } from '@/lib/certificates';
import { rateLimit, rateLimitKey } from '@/lib/rateLimit';

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
    rateLimitKey(req, `progress_${authUser.id}`),
    30,
    60_000,
  );
  if (!allowed) {
    return NextResponse.json(
      { message: `Troppe richieste. Riprova tra ${retryAfter}s.`, throttled: true },
      { status: 429 },
    );
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const exerciseId = typeof body.exerciseId === 'string' ? body.exerciseId : '';
  const courseId = typeof body.courseId === 'string' ? body.courseId : '';

  if (!exerciseId || !courseId) {
    return NextResponse.json({ message: 'exerciseId e courseId richiesti' }, { status: 400 });
  }

  try {
    // 1. Verifica che l'utente sia iscritto al corso
    const { data: enr } = await supabaseAdmin
      .from('enrollments')
      .select('id')
      .eq('user_id', authUser.id)
      .eq('course_id', courseId)
      .maybeSingle();

    if (!enr) {
      return NextResponse.json(
        { message: 'Non sei iscritto a questo corso' },
        { status: 403 },
      );
    }

    // 2. Verifica che l'esercizio esista e appartenga al corso (niente XP falsi)
    const { data: exercise } = await supabaseAdmin
      .from('exercises')
      .select('id, section_id, points, is_checkpoint')
      .eq('id', exerciseId)
      .maybeSingle();

    if (!exercise) {
      return NextResponse.json({ message: 'Esercizio non trovato' }, { status: 404 });
    }

    const { data: section } = await supabaseAdmin
      .from('sections')
      .select('course_id')
      .eq('id', exercise.section_id)
      .maybeSingle();

    if (!section || section.course_id !== courseId) {
      return NextResponse.json(
        { message: 'Esercizio non appartenente al corso' },
        { status: 400 },
      );
    }

    // 3. Registra il completamento (una sola volta: niente doppio XP)
    const points = Number(exercise.points) || 0;

    const { data: existing } = await supabaseAdmin
      .from('exercise_progress')
      .select('id')
      .eq('user_id', authUser.id)
      .eq('exercise_id', exerciseId)
      .maybeSingle();

    let awarded = false;
    if (!existing) {
      const { error: insertError } = await supabaseAdmin
        .from('exercise_progress')
        .insert({
          user_id: authUser.id,
          course_id: courseId,
          section_id: exercise.section_id,
          exercise_id: exerciseId,
          points,
        });

      if (insertError) {
        if ((insertError as { code?: string }).code === '23505') {
          // concorrenza: già salvato da un'altra richiesta
        } else {
          console.error('[progress] insert error:', insertError);
          return NextResponse.json({ message: 'Errore salvataggio progresso' }, { status: 500 });
        }
      } else {
        awarded = true;
      }
    }

    // 4. XP solo al primo completamento
    let totalExp = 0;
    if (awarded && points > 0) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('exp')
        .eq('id', authUser.id)
        .maybeSingle();

      totalExp = (Number(profile?.exp) || 0) + points;

      await supabaseAdmin
        .from('profiles')
        .update({ exp: totalExp })
        .eq('id', authUser.id);
    } else {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('exp')
        .eq('id', authUser.id)
        .maybeSingle();
      totalExp = Number(profile?.exp) || 0;
    }

    // 5. Aggiorna lo streak (fire-and-forget: utile anche come heartbeat)
    await updateStreak(authUser.id);

    // 6. Certificato automatico quando tutti gli esercizi del corso sono completati
    let certificateGranted = false;
    try {
      const { data: sectionRows } = await supabaseAdmin
        .from('sections')
        .select('id')
        .eq('course_id', courseId);

      const sectionIds = (sectionRows || []).map((s) => String(s.id));
      let totalExercises = 0;

      if (sectionIds.length > 0) {
        const { count } = await supabaseAdmin
          .from('exercises')
          .select('id', { count: 'exact', head: true })
          .in('section_id', sectionIds);
        totalExercises = count ?? 0;
      }

      if (totalExercises > 0) {
        const { count: doneCount } = await supabaseAdmin
          .from('exercise_progress')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', authUser.id)
          .eq('course_id', courseId);

        if ((doneCount ?? 0) >= totalExercises) {
          const result = await grantCertificate(authUser.id, courseId);
          certificateGranted = result.granted;
        }
      }
    } catch (certError) {
      // Il certificato è un bonus: un errore qui non deve bloccare il progresso
      console.error('[progress] certificate check error:', certError);
    }

    return NextResponse.json({
      success: true,
      awarded,
      points,
      exp: totalExp,
      certificateGranted,
      checkpointCompleted: exercise.is_checkpoint === true || exercise.is_checkpoint === 'true',
    });
  } catch (error) {
    console.error('[progress] error:', error);
    return NextResponse.json({ message: 'Errore del server' }, { status: 500 });
  }
}
