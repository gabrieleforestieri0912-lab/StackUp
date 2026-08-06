import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { supabaseAdmin, getAuthUser } from '../../../../lib/supabase-admin';

export const runtime = 'nodejs';

interface CourseRow {
  id: string;
  title: string;
  slug: string;
  description?: string;
  category?: string;
  level?: string;
  duration?: number;
  price?: number;
  icon?: string;
  image_url?: string;
  tags?: string[];
  review_count?: number;
  enrollment_count?: number;
  instructor_name?: string;
  instructor_avatar?: string;
}

interface EnrollmentRow {
  course_id: string;
  enrolled_at?: string;
  progress?: number;
  courses: CourseRow | CourseRow[];
}

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
      .from('enrollments')
      .select(`
        course_id,
        enrolled_at,
        progress,
        courses:course_id (
          id, title, slug, description, category, level, duration,
          price, icon, image_url, tags, review_count,
          enrollment_count, instructor_name, instructor_avatar
        )
      `)
      .eq('user_id', authUser.id)
      .order('enrolled_at', { ascending: false });

    if (error) throw error;

    const data = ((rows || []) as unknown as EnrollmentRow[])
      .map((r) => {
        const course = Array.isArray(r.courses) ? r.courses[0] : r.courses;
        if (!course) return null;
        return {
          _id: course.id,
          id: course.id,
          title: course.title,
          slug: course.slug,
          description: course.description,
          category: course.category,
          level: course.level,
          duration: course.duration,
          price: course.price,
          icon: course.icon || undefined,
          imageUrl: course.image_url || undefined,
          tags: course.tags || [],
          reviewCount: course.review_count || 0,
          enrollmentCount: course.enrollment_count || 0,
          instructor: course.instructor_name
            ? { name: course.instructor_name, avatar: course.instructor_avatar }
            : undefined,
          progress: r.progress || 0,
          enrolledAt: r.enrolled_at,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}