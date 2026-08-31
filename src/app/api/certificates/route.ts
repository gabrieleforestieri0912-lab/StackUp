import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { supabaseAdmin, getAuthUser } from '@/lib/supabase-admin';
import { grantCertificate } from '@/lib/certificates';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Non autorizzato' }, { status: 401 });
  }

  const token = authHeader.substring('Bearer '.length);
  const authUser = await getAuthUser(token);
  if (!authUser) {
    return NextResponse.json({ message: 'Token non valido' }, { status: 401 });
  }

  try {
    const { data: rows, error } = await supabaseAdmin
      .from('certificates')
      .select(
        `
        course_id,
        certificate_id,
        completed_at,
        final_score,
        courses:course_id (
          id, title, slug, description, category, level, image_url
        )
      `,
      )
      .eq('user_id', authUser.id)
      .order('completed_at', { ascending: false });

    if (error) throw error;

    const mapped = (rows || []).map((r) => {
      const course = Array.isArray(r.courses) ? r.courses[0] : r.courses;
      return {
        _id: r.certificate_id,
        id: r.certificate_id,
        courseId: r.course_id,
        courseTitle: course?.title || '',
        courseSlug: course?.slug || '',
        completedAt: r.completed_at,
        finalScore: (r as { final_score?: number }).final_score || 0,
      };
    });

    return NextResponse.json({ success: true, data: mapped });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}

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

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const courseId = typeof body.courseId === 'string' ? body.courseId : '';
  const finalScore = typeof body.finalScore === 'number' ? body.finalScore : 0;

  if (!courseId) {
    return NextResponse.json({ message: 'courseId richiesto' }, { status: 400 });
  }

  try {
    // Verifica enrollment
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

    const { granted, certificate } = await grantCertificate(authUser.id, courseId, finalScore);

    return NextResponse.json({ success: true, granted, data: certificate });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}