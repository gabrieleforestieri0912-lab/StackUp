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
      .eq('is_published', true)
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

    // Corsi propedeutico / successivo consigliati (metadati percorsi)
    const relatedIds = [course.prerequisite_course_id, course.next_course_id].filter(Boolean);
    let relatedCourses: Record<string, { id: string; title: string; slug: string }> = {};
    if (relatedIds.length > 0) {
      const { data: rel } = await supabaseAdmin
        .from('courses')
        .select('id, title, slug')
        .in('id', relatedIds);
      for (const r of rel || []) {
        relatedCourses[String(r.id)] = { id: String(r.id), title: r.title, slug: r.slug };
      }
    }

    const sectionsOrdered = { ascending: true } as const;

    const { data: sections } = await supabaseAdmin
      .from('sections')
      .select('id, title, description, content, video_url, duration, objective, checkpoint_title, checkpoint_description, starter_repo_url, solution_repo_url, cheat_sheet, docs_links, ai_prompt, troubleshooting, "order"')
      .eq('course_id', course.id)
      .order('order', sectionsOrdered);

    const sectionsRows = ((sections || []) as unknown) as Array<Record<string, unknown>>;

    let sectionsWithExercises: Record<string, unknown>[] = [];
    let completedExerciseIds: string[] = [];
    if (sectionsRows && sectionsRows.length > 0) {
      const sectionIds = sectionsRows.map((s) => String(s.id));

      const { data: rawExercises } = await supabaseAdmin
        .from('exercises')
        .select('id, section_id, title, description, type, difficulty, points, why, how, instructions, common_errors, checkpoint, is_checkpoint, starter_code, solution, test_cases, hints, "order"')
        .in('section_id', sectionIds)
        .order('order', sectionsOrdered);

      const exercises = ((rawExercises || []) as unknown) as Array<Record<string, unknown>>;

      // Esercizi già completati dall'utente (per gating + checkmark)
      if (userId) {
        const { data: progress } = await supabaseAdmin
          .from('exercise_progress')
          .select('exercise_id')
          .eq('user_id', userId)
          .eq('course_id', course.id);
        completedExerciseIds = (progress || []).map((p) => String(p.exercise_id));
      }
      const completedSet = new Set(completedExerciseIds);

      const exercisesBySection: Record<string, Record<string, unknown>[]> = {};
      for (const rawEx of exercises) {
        const ex = rawEx as Record<string, unknown>;
        const exSectionId = String(ex.section_id);
        if (!exercisesBySection[exSectionId]) exercisesBySection[exSectionId] = [];
        exercisesBySection[exSectionId].push(ex);
      }

      // Gating: un modulo è sbloccato solo se il checkpoint pratico del
      // modulo precedente è stato completato (esercizio marcato is_checkpoint).
      let previousUnlocked = true;
      sectionsWithExercises = sectionsRows.map((s) => {
        const secExercises = exercisesBySection[String(s.id)] || [];
        const checkpointExercise = secExercises.find(
          (ex) => ex.is_checkpoint === true || ex.is_checkpoint === 'true',
        );
        const hasCheckpoint = !!checkpointExercise;
        const checkpointPassed = hasCheckpoint
          ? completedSet.has(String(checkpointExercise.id))
          : false;
        const unlocked = enrolled && previousUnlocked;

        // Il prossimo modulo si sblocca solo se questo è sbloccato e il suo
        // checkpoint (se esiste) è superato. Un modulo senza checkpoint non
        // blocca mai il successivo.
        previousUnlocked = unlocked && (!hasCheckpoint || checkpointPassed);

        const mappedSection: Record<string, unknown> = {
          _id: s.id,
          id: s.id,
          title: s.title || '',
          description: s.description || '',
          duration: (s.duration as number) || 0,
          order: s.order,
          objective: s.objective || '',
          checkpointTitle: s.checkpoint_title || '',
          checkpointDescription: s.checkpoint_description || '',
          unlocked,
          checkpointPassed,
          hasCheckpoint,
          exercises: [],
        };

        // Contenuto e materiali del modulo solo se sbloccato E iscritto
        if (unlocked) {
          mappedSection.content = (s.content as string) || '';
          mappedSection.videoUrl = (s.video_url as string) || '';
          mappedSection.starterRepoUrl = s.starter_repo_url || undefined;
          mappedSection.solutionRepoUrl = s.solution_repo_url || undefined;
          mappedSection.cheatSheet = s.cheat_sheet || undefined;
          mappedSection.docsLinks = s.docs_links || [];
          mappedSection.aiPrompt = s.ai_prompt || undefined;
          mappedSection.troubleshooting = s.troubleshooting || [];
        }

        mappedSection.exercises = secExercises.map((rawEx) => {
          const ex = rawEx as Record<string, unknown>;
          const mappedExercise: Record<string, unknown> = {
            _id: ex.id,
            id: ex.id,
            title: ex.title,
            description: ex.description,
            type: ex.type,
            difficulty: ex.difficulty,
            points: ex.points,
            order: ex.order,
            isCheckpoint: ex.is_checkpoint === true || ex.is_checkpoint === 'true',
            completed: completedSet.has(String(ex.id)),
          };
          if (unlocked) {
            mappedExercise.why = ex.why || '';
            mappedExercise.how = ex.how || '';
            mappedExercise.instructions = ex.instructions;
            mappedExercise.commonErrors = ex.common_errors || [];
            mappedExercise.checkpoint = ex.checkpoint || '';
            mappedExercise.starterCode = ex.starter_code;
            mappedExercise.hints = ex.hints || [];
            mappedExercise.solution = ex.solution;
            mappedExercise.testCases = ex.test_cases || [];
          }
          return mappedExercise;
        });

        return mappedSection;
      });
    }

    const mapped = {
      _id: course.id,
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      longDescription: course.long_description || '',
      subtitle: course.subtitle || '',
      outcome: course.outcome || '',
      lessonDuration: course.lesson_duration || 20,
      stackVersion: course.stack_version || '',
      prerequisiteCheck: course.prerequisite_check || '',
      prerequisiteCourse: course.prerequisite_course_id
        ? relatedCourses[String(course.prerequisite_course_id)] || null
        : null,
      nextCourse: course.next_course_id
        ? relatedCourses[String(course.next_course_id)] || null
        : null,
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
      completedExerciseIds: enrolled ? completedExerciseIds : [],
      isEnrolled: enrolled,
      createdAt: course.created_at,
    };

    return NextResponse.json({ success: true, data: mapped });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
