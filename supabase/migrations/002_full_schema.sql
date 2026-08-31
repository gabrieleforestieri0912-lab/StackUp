CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 1,
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_expires_at ON rate_limits (expires_at);

CREATE OR REPLACE FUNCTION increment_rate_limit(
  p_key TEXT,
  p_window_ms INTEGER,
  p_max_requests INTEGER
) RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INTEGER;
  v_expires_at TIMESTAMPTZ;
  v_now CONSTANT TIMESTAMPTZ := NOW();
BEGIN
  INSERT INTO rate_limits (key, count, expires_at)
  VALUES (p_key, 1, v_now + (p_window_ms || ' milliseconds')::INTERVAL)
  ON CONFLICT (key) DO NOTHING;

  SELECT r.count, r.expires_at INTO v_count, v_expires_at
  FROM rate_limits r
  WHERE r.key = p_key;

  IF v_expires_at < v_now THEN
    UPDATE rate_limits
    SET count = 1, expires_at = v_now + (p_window_ms || ' milliseconds')::INTERVAL
    WHERE key = p_key
    RETURNING count INTO v_count;

    RETURN JSONB_BUILD_OBJECT('allowed', true, 'count', 1);
  END IF;

  IF v_count > p_max_requests THEN
    RETURN JSONB_BUILD_OBJECT(
      'allowed', false,
      'retryAfter', EXTRACT(EPOCH FROM (v_expires_at - v_now))::INTEGER,
      'count', v_count
    );
  END IF;

  UPDATE rate_limits
  SET count = count + 1
  WHERE key = p_key
  RETURNING count INTO v_count;

  IF random() < 0.01 THEN
    DELETE FROM rate_limits WHERE expires_at < v_now;
  END IF;

  RETURN JSONB_BUILD_OBJECT('allowed', true, 'count', v_count);
END;
$$;

DROP FUNCTION IF EXISTS increment_enrollment_count(uuid);

CREATE OR REPLACE FUNCTION increment_enrollment_count(course_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE courses
  SET enrollment_count = COALESCE(enrollment_count, 0) + 1
  WHERE id = course_id;
END;
$$;

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  avatar TEXT,
  auth_method TEXT DEFAULT 'local',
  study_streak INTEGER DEFAULT 0,
  study_hours INTEGER DEFAULT 0,
  exp INTEGER DEFAULT 0,
  last_active_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  long_description TEXT,
  subtitle TEXT,
  outcome TEXT,
  lesson_duration INTEGER DEFAULT 20,
  stack_version TEXT,
  prerequisite_check TEXT,
  prerequisite_course_id UUID,
  next_course_id UUID,
  category TEXT,
  level TEXT,
  duration INTEGER,
  price NUMERIC(10, 2) DEFAULT 0,
  icon TEXT,
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  prerequisites TEXT[] DEFAULT '{}',
  learning_objectives TEXT[] DEFAULT '{}',
  review_count INTEGER DEFAULT 0,
  enrollment_count INTEGER DEFAULT 0,
  instructor_name TEXT,
  instructor_bio TEXT,
  instructor_avatar TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  content TEXT,
  video_url TEXT,
  duration INTEGER DEFAULT 0,
  objective TEXT,
  checkpoint_title TEXT,
  checkpoint_description TEXT,
  starter_repo_url TEXT,
  solution_repo_url TEXT,
  cheat_sheet TEXT,
  docs_links JSONB DEFAULT '[]',
  ai_prompt TEXT,
  troubleshooting JSONB DEFAULT '[]',
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  type TEXT,
  difficulty TEXT,
  points INTEGER DEFAULT 0,
  why TEXT,
  how TEXT,
  instructions TEXT,
  common_errors JSONB DEFAULT '[]',
  checkpoint TEXT,
  is_checkpoint BOOLEAN DEFAULT FALSE,
  starter_code TEXT,
  solution TEXT,
  test_cases JSONB DEFAULT '[]',
  hints JSONB DEFAULT '[]',
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id TEXT UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  final_score NUMERIC(5, 2) DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2),
  currency TEXT DEFAULT 'eur',
  stripe_session_id TEXT,
  stripe_event_id TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS free_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  instructions TEXT,
  starter_code TEXT,
  solution TEXT,
  test_cases JSONB DEFAULT '[]',
  hints JSONB DEFAULT '[]',
  category TEXT,
  difficulty TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  author_name TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exercise_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS avatar TEXT,
  ADD COLUMN IF NOT EXISTS auth_method TEXT DEFAULT 'local',
  ADD COLUMN IF NOT EXISTS study_streak INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS study_hours INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS exp INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_active_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS long_description TEXT,
  ADD COLUMN IF NOT EXISTS subtitle TEXT,
  ADD COLUMN IF NOT EXISTS outcome TEXT,
  ADD COLUMN IF NOT EXISTS lesson_duration INTEGER DEFAULT 20,
  ADD COLUMN IF NOT EXISTS stack_version TEXT,
  ADD COLUMN IF NOT EXISTS prerequisite_check TEXT,
  ADD COLUMN IF NOT EXISTS prerequisite_course_id UUID,
  ADD COLUMN IF NOT EXISTS next_course_id UUID,
  ADD COLUMN IF NOT EXISTS prerequisites TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS learning_objectives TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS instructor_name TEXT,
  ADD COLUMN IF NOT EXISTS instructor_bio TEXT,
  ADD COLUMN IF NOT EXISTS instructor_avatar TEXT,
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS enrollment_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE sections
  ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS content TEXT,
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS duration INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS objective TEXT,
  ADD COLUMN IF NOT EXISTS checkpoint_title TEXT,
  ADD COLUMN IF NOT EXISTS checkpoint_description TEXT,
  ADD COLUMN IF NOT EXISTS starter_repo_url TEXT,
  ADD COLUMN IF NOT EXISTS solution_repo_url TEXT,
  ADD COLUMN IF NOT EXISTS cheat_sheet TEXT,
  ADD COLUMN IF NOT EXISTS docs_links JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS ai_prompt TEXT,
  ADD COLUMN IF NOT EXISTS troubleshooting JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE exercises
  ADD COLUMN IF NOT EXISTS section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS why TEXT,
  ADD COLUMN IF NOT EXISTS how TEXT,
  ADD COLUMN IF NOT EXISTS common_errors JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS checkpoint TEXT,
  ADD COLUMN IF NOT EXISTS is_checkpoint BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS starter_code TEXT,
  ADD COLUMN IF NOT EXISTS solution TEXT,
  ADD COLUMN IF NOT EXISTS test_cases JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS hints JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE enrollments
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE certificates
  ADD COLUMN IF NOT EXISTS certificate_id TEXT,
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS final_score NUMERIC(5, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS amount NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'eur',
  ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_event_id TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed',
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS subject TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE free_exercises
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS instructions TEXT,
  ADD COLUMN IF NOT EXISTS starter_code TEXT,
  ADD COLUMN IF NOT EXISTS solution TEXT,
  ADD COLUMN IF NOT EXISTS test_cases JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS hints JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS difficulty TEXT,
  ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS excerpt TEXT,
  ADD COLUMN IF NOT EXISTS content TEXT,
  ADD COLUMN IF NOT EXISTS cover_image TEXT,
  ADD COLUMN IF NOT EXISTS author_name TEXT,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE exercise_progress
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_courses_published ON courses (is_published);
CREATE INDEX IF NOT EXISTS idx_sections_course ON sections (course_id, "order");
CREATE INDEX IF NOT EXISTS idx_exercises_section ON exercises (section_id, "order");
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments (user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments (course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates (user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions (user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_session ON transactions (stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages (created_at);
CREATE INDEX IF NOT EXISTS idx_free_exercises_cat ON free_exercises (category, difficulty);
CREATE INDEX IF NOT EXISTS idx_exercise_progress_user ON exercise_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_progress_course ON exercise_progress (course_id);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'enrollments_user_course_unique') THEN
    ALTER TABLE enrollments ADD CONSTRAINT enrollments_user_course_unique UNIQUE (user_id, course_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'transactions_session_course_unique') THEN
    ALTER TABLE transactions ADD CONSTRAINT transactions_session_course_unique UNIQUE (stripe_session_id, course_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'certificates_certificate_id_unique') THEN
    ALTER TABLE certificates ADD CONSTRAINT certificates_certificate_id_unique UNIQUE (certificate_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'certificates_user_course_unique') THEN
    ALTER TABLE certificates ADD CONSTRAINT certificates_user_course_unique UNIQUE (user_id, course_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exercise_progress_user_exercise_unique') THEN
    ALTER TABLE exercise_progress ADD CONSTRAINT exercise_progress_user_exercise_unique UNIQUE (user_id, exercise_id);
  END IF;
END $$;

ALTER TABLE rate_limits   ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses       ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections      ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises     ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates  ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE free_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "courses_public_read" ON courses;
CREATE POLICY "courses_public_read" ON courses
  FOR SELECT USING (is_published = TRUE);

DROP POLICY IF EXISTS "profiles_own_select" ON profiles;
CREATE POLICY "profiles_own_select" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_own_update" ON profiles;
CREATE POLICY "profiles_own_update" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "enrollments_own_select" ON enrollments;
CREATE POLICY "enrollments_own_select" ON enrollments
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "certificates_own_select" ON certificates;
CREATE POLICY "certificates_own_select" ON certificates
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "transactions_own_select" ON transactions;
CREATE POLICY "transactions_own_select" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "exercise_progress_own_select" ON exercise_progress;
CREATE POLICY "exercise_progress_own_select" ON exercise_progress
  FOR SELECT USING (auth.uid() = user_id);

GRANT EXECUTE ON FUNCTION increment_rate_limit(TEXT, INTEGER, INTEGER) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION increment_enrollment_count(UUID) TO anon, authenticated, service_role;
