import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { supabaseAdmin, getAuthUser } from '@/lib/supabase-admin';

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
      .from('transactions')
      .select(
        `
        id,
        amount,
        currency,
        status,
        stripe_session_id,
        created_at,
        courses:course_id (
          id, title, slug, description, image_url, instructor_name
        )
      `,
      )
      .eq('user_id', authUser.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const mapped = (rows || []).map((r) => {
      const course = Array.isArray(r.courses) ? r.courses[0] : r.courses;
      return {
        _id: r.id,
        id: r.id,
        amount: r.amount,
        currency: r.currency,
        status: r.status,
        stripeSessionId: r.stripe_session_id,
        createdAt: r.created_at,
        course: course
          ? {
              id: course.id,
              title: course.title,
              slug: course.slug,
              description: course.description,
              imageUrl: course.image_url,
              instructor: course.instructor_name,
            }
          : null,
      };
    });

    return NextResponse.json({ success: true, data: mapped });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}