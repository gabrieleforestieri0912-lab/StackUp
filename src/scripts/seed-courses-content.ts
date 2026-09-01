import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import contents from '../data/course-content';
import type { SeedExercise } from '../data/course-content/types';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

let insertedSections = 0;
let skippedSections = 0;
let insertedExercises = 0;
let skippedExercises = 0;

function toJson(value: unknown): string {
  return JSON.stringify(value ?? []);
}

async function resolveOrCreateSection(
  courseId: string,
  title: string,
  data: Record<string, unknown>,
) {
  const { data: existing } = await supabase
    .from('sections')
    .select('id')
    .eq('course_id', courseId)
    .eq('title', title)
    .maybeSingle();

  if (existing) {
    skippedSections++;
    return existing.id as string;
  }

  const { data: inserted, error } = await supabase
    .from('sections')
    .insert(data)
    .select('id')
    .single();

  if (error) {
    console.error(`  ✗ Errore sezione "${title}":`, error.message);
    throw error;
  }
  insertedSections++;
  return inserted.id as string;
}

async function insertExerciseIfMissing(sectionId: string, ex: SeedExercise, order: number) {
  const { data: existing } = await supabase
    .from('exercises')
    .select('id')
    .eq('section_id', sectionId)
    .eq('title', ex.title)
    .maybeSingle();

  if (existing) {
    skippedExercises++;
    return;
  }

  const { error } = await supabase.from('exercises').insert({
    section_id: sectionId,
    title: ex.title,
    description: ex.description,
    type: ex.type,
    difficulty: ex.difficulty,
    points: ex.points,
    why: ex.why,
    how: ex.how,
    instructions: ex.instructions,
    common_errors: toJson(ex.commonErrors),
    checkpoint: ex.checkpoint || null,
    is_checkpoint: !!ex.isCheckpoint,
    starter_code: ex.starterCode,
    solution: ex.solution,
    test_cases: toJson(ex.testCases),
    hints: toJson(ex.hints),
    order,
  });

  if (error) {
    console.error(`  ✗ Errore esercizio "${ex.title}":`, error.message);
    throw error;
  }
  insertedExercises++;
}

async function seed() {
  console.log(`Loading ${contents.length} course contents...`);

  const slugToId = new Map<string, string>();
  for (const course of contents) {
    const { data, error } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', course.slug)
      .maybeSingle();

    if (error) {
      console.error(`Corso ${course.slug} query error:`, error.message);
      process.exit(1);
    }
    if (!data) {
      console.warn(`⚠ Corso non trovato nel DB, skip: ${course.slug}`);
      continue;
    }
    slugToId.set(course.slug, data.id as string);
  }

  console.log(`Found ${slugToId.size}/${contents.length} courses in DB.`);

  for (const course of contents) {
    const courseId = slugToId.get(course.slug);
    if (!courseId) continue;

    console.log(`\n=== ${course.slug} ===`);
    let sectionOrder = 0;
    for (const section of course.sections) {
      const order = sectionOrder++;
      const sectionId = await resolveOrCreateSection(courseId, section.title, {
        course_id: courseId,
        title: section.title,
        description: section.description,
        content: section.content,
        duration: section.duration || 0,
        objective: section.objective,
        checkpoint_title: section.checkpointTitle,
        checkpoint_description: section.checkpointDescription,
        docs_links: toJson(section.docsLinks),
        troubleshooting: toJson(section.troubleshooting),
        order,
      });

      let exerciseOrder = 0;
      for (const ex of section.exercises) {
        await insertExerciseIfMissing(sectionId, ex, exerciseOrder++);
      }
    }
  }

  console.log('\n=== SEED COMPLETATO ===');
  console.log(`Sezioni: ${insertedSections} inserite, ${skippedSections} già presenti.`);
  console.log(`Esercizi: ${insertedExercises} inseriti, ${skippedExercises} già presenti.`);
}

seed().catch((err) => {
  console.error('Seed fallito:', err);
  process.exit(1);
});