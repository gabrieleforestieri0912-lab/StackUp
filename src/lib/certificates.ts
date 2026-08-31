import { supabaseAdmin } from './supabase-admin';

/**
 * Rilascia (o recupera) il certificato per un utente e un corso.
 * Idempotente: se esiste già un certificato per la coppia, non ne crea un altro.
 */
export async function grantCertificate(
  userId: string,
  courseId: string,
  finalScore = 100,
): Promise<{ granted: boolean; certificate: Record<string, unknown> | null }> {
  const { data: existing } = await supabaseAdmin
    .from('certificates')
    .select('certificate_id, completed_at')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle();

  if (existing) {
    return { granted: false, certificate: existing as Record<string, unknown> };
  }

  const certificateId = crypto.randomUUID();

  const { data, error } = await supabaseAdmin
    .from('certificates')
    .insert({
      certificate_id: certificateId,
      user_id: userId,
      course_id: courseId,
      final_score: finalScore,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    // Corsa: un'altra richiesta ha già creato il certificato
    if ((error as { code?: string }).code === '23505') {
      const { data: raced } = await supabaseAdmin
        .from('certificates')
        .select('certificate_id, completed_at')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .maybeSingle();
      return { granted: false, certificate: (raced as Record<string, unknown>) || null };
    }
    throw error;
  }

  return { granted: true, certificate: data as Record<string, unknown> };
}
