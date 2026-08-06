import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { supabaseAdmin, getAuthUser } from '../../../../lib/supabase-admin';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ success: false, message: 'slug mancante' }, { status: 400 });
  }

  try {
    const { data: course, error } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !course) {
      return NextResponse.json({ success: false, message: 'Course not found' }, { status: 404 });
    }

    const authHeader = req.headers.get('authorization');
    let userId: string | null = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring('Bearer '.length);
      const authUser = await getAuthUser(token);
      userId = authUser?.id ?? null;
    }

    let enrolled = false;
    if (userId) {
      const { data: enr } = await supabaseAdmin
        .from('enrollments')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', course.id)
        .maybeSingle();
      enrolled = !!enr;
    }

    const { data: sections } = await supabaseAdmin
      .from('sections')
      .select('*')
      .eq('course_id', course.id)
      .order('order', { ascending: true });

    let sectionsWithExercises: Record<string, unknown>[] = [];
    if (sections && sections.length > 0) {
      const sectionIds = sections.map((s: { id: string }) => s.id);

      const exerciseColumns = enrolled
        ? 'id, section_id, title, description, type, difficulty, points, instructions, starter_code, solution, test_cases, hints, "order"'
        : 'id, section_id, title, description, type, difficulty, points, instructions, starter_code, hints, "order"';

      const { data: rawExercises } = await supabaseAdmin
        .from('exercises')
        .select(exerciseColumns)
        .in('section_id', sectionIds)
        .order('order', { ascending: true });

      const exercises = ((rawExercises || []) as unknown) as Array<Record<string, unknown>>;

      const exercisesBySection: Record<string, unknown[]> = {};
      for (const ex of exercises) {
        const exSectionId = String(ex.section_id);
        if (!exercisesBySection[exSectionId]) exercisesBySection[exSectionId] = [];
        const mappedExercise: Record<string, unknown> = {
          _id: ex.id,
          id: ex.id,
          title: ex.title,
          description: ex.description,
          type: ex.type,
          difficulty: ex.difficulty,
          points: ex.points,
          instructions: ex.instructions,
          starterCode: ex.starter_code,
          hints: ex.hints || [],
          order: ex.order,
        };
        if (enrolled) {
          mappedExercise.solution = ex.solution;
          mappedExercise.testCases = ex.test_cases || [];
        }
        exercisesBySection[exSectionId].push(mappedExercise);
      }

      sectionsWithExercises = sections.map(
        (s: { id: string; title: string; description: string; content: string; video_url: string; duration: number; order: number }) => ({
          _id: s.id,
          id: s.id,
          title: s.title,
          description: s.description,
          content: enrolled ? s.content || '' : '',
          videoUrl: s.video_url || '',
          duration: s.duration || 0,
          order: s.order,
          exercises: exercisesBySection[s.id] || [],
        }),
      );
    }

    const mapped = {
      _id: course.id,
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      longDescription: course.long_description || '',
      category: course.category,
      level: course.level,
      duration: course.duration,
      price: course.price,
      icon: course.icon || undefined,
      imageUrl: course.image_url || undefined,
      tags: course.tags || [],
      prerequisites: course.prerequisites || [],
      learningObjectives: course.learning_objectives || [],
      instructor: course.instructor_name
        ? { name: course.instructor_name, bio: course.instructor_bio, avatar: course.instructor_avatar }
        : undefined,
      enrollmentCount: course.enrollment_count || 0,
      reviewCount: course.review_count || 0,
      sections: sectionsWithExercises,
      isEnrolled: enrolled,
      createdAt: course.created_at,
    };

    return NextResponse.json({ success: true, data: mapped });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
