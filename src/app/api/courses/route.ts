import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';

const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 100;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limitRaw = Number(searchParams.get('limit'));
  const offsetRaw = Number(searchParams.get('offset'));
  const limit = Math.min(
    Math.max(Number.isFinite(limitRaw) && limitRaw > 0 ? Math.floor(limitRaw) : DEFAULT_LIMIT, 1),
    MAX_LIMIT,
  );
  const offset = Math.max(Number.isFinite(offsetRaw) && offsetRaw >= 0 ? Math.floor(offsetRaw) : 0, 0);

  const category = searchParams.get('category');
  const level = searchParams.get('level');
  const search = searchParams.get('search')?.slice(0, 100) ?? null;

  try {
    let query = supabaseAdmin
      .from('courses')
      .select(
        'id, title, slug, description, category, level, duration, price, icon, image_url, tags, review_count, enrollment_count, instructor_name, instructor_bio, instructor_avatar, created_at',
        { count: 'exact' },
      )
      .eq('is_published', true);

    if (category) query = query.eq('category', category);
    if (level) query = query.eq('level', level);
    if (search) query = query.ilike('title', `%${search}%`);

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data: courses, error, count } = await query;

    if (error) throw error;

    const mapped = (courses || []).map((c) => ({
      _id: c.id,
      id: c.id,
      title: c.title,
      slug: c.slug,
      description: c.description,
      category: c.category,
      level: c.level,
      duration: c.duration,
      price: c.price,
      icon: c.icon || undefined,
      imageUrl: c.image_url || undefined,
      tags: c.tags || [],
      reviewCount: c.review_count || 0,
      enrollmentCount: c.enrollment_count || 0,
      instructor: c.instructor_name
        ? { name: c.instructor_name, bio: c.instructor_bio, avatar: c.instructor_avatar }
        : undefined,
      createdAt: c.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: mapped,
      pagination: {
        limit,
        offset,
        total: count ?? mapped.length,
        hasMore: offset + mapped.length < (count ?? 0),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
