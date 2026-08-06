import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const difficulty = searchParams.get('difficulty');

  try {
    let query = supabaseAdmin.from('free_exercises').select('*');
    if (category) query = query.eq('category', category);
    if (difficulty) query = query.eq('difficulty', difficulty);

    const { data, error } = await query.limit(200);
    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}