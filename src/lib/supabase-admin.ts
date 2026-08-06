import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function getAuthUser(token: string) {
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

async function mapProfile(row: Record<string, unknown>) {
  if (!row) return null;
  const { data: enrollments } = await supabaseAdmin
    .from('enrollments')
    .select('course_id')
    .eq('user_id', row.id);
  const { data: certs } = await supabaseAdmin
    .from('certificates')
    .select('course_id, certificate_id, completed_at')
    .eq('user_id', row.id);
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    email: row.email,
    avatar: row.avatar || undefined,
    authMethod: row.auth_method,
    enrolledCourses: (enrollments || []).map((e: { course_id: string }) => e.course_id),
    certificates: (certs || []).map((c: { course_id: string; certificate_id: string; completed_at: string }) => ({
      courseId: c.course_id,
      certificateId: c.certificate_id,
      completedAt: c.completed_at,
    })),
    studyStreak: row.study_streak || 0,
    studyHours: row.study_hours || 0,
    exp: row.exp || 0,
    createdAt: row.created_at,
  };
}

export async function getProfileById(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error || !data) return null;
  return mapProfile(data);
}

export async function createProfile(
  userId: string,
  email: string,
  name: string,
  avatar?: string,
  authMethod: string = 'local'
) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .insert({
      id: userId,
      email,
      name,
      avatar: avatar || null,
      auth_method: authMethod,
    })
    .select()
    .single();
  if (error) throw error;
  return mapProfile(data);
}

export async function updateStreak(userId: string) {
  const { data: profile, error: fetchError } = await supabaseAdmin
    .from('profiles')
    .select('study_streak, last_active_date')
    .eq('id', userId)
    .single();
  if (fetchError || !profile) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastActive = profile.last_active_date
    ? new Date(profile.last_active_date)
    : null;

  let newStreak = profile.study_streak || 0;

  if (!lastActive) {
    newStreak = 1;
  } else {
    lastActive.setHours(0, 0, 0, 0);
    const diffDays = Math.round((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) newStreak += 1;
    else if (diffDays > 1) newStreak = 1;
  }

  await supabaseAdmin
    .from('profiles')
    .update({ study_streak: newStreak, last_active_date: new Date().toISOString() })
    .eq('id', userId);
}
