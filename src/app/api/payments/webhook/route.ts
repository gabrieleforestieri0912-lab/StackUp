import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '../../../../lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function handleCheckoutCompleted(event: Stripe.Event, session: Stripe.Checkout.Session) {
  const { userId, courseId, courseIds } = session.metadata as Record<string, string>;
  const amount = (session.amount_total ?? 0) / 100;
  const sessionId = session.id;

  if (!userId) {
    console.warn(`[webhook] ${event.id}: session ${sessionId} senza userId in metadata, skip`);
    return;
  }

  const idsToEnroll = courseId
    ? [courseId]
    : courseIds
      ? courseIds.split(',').filter(Boolean)
      : [];

  if (idsToEnroll.length === 0) {
    console.warn(`[webhook] ${event.id}: nessun courseId/courseIds, skip`);
    return;
  }

  const transactions = idsToEnroll.map((course_id: string) => ({
    user_id: userId,
    course_id,
    amount: amount / idsToEnroll.length,
    currency: session.currency || 'eur',
    stripe_session_id: sessionId,
    stripe_event_id: event.id,
    status: 'completed',
  }));

  const { error: txError } = await supabaseAdmin
    .from('transactions')
    .insert(transactions);

  if (txError) {
    if ((txError as { code?: string }).code === '23505') {
      console.info(`[webhook] ${event.id}: transazione già processata (replay), skip`);
      return;
    }
    throw txError;
  }

  const enrollments = idsToEnroll.map((course_id: string) => ({
    user_id: userId,
    course_id,
  }));

  const { error: enrollError } = await supabaseAdmin
    .from('enrollments')
    .upsert(enrollments, { onConflict: 'user_id,course_id', ignoreDuplicates: true });

  if (enrollError) {
    console.error(`[webhook] ${event.id}: enrollment upsert error:`, enrollError);
  }

  const { data: coursesToUpdate } = await supabaseAdmin
    .from('courses')
    .select('id, enrollment_count')
    .in('id', idsToEnroll);

  for (const course of coursesToUpdate || []) {
    await supabaseAdmin.rpc('increment_enrollment_count', { course_id: course.id });
  }

  console.log(`[webhook] ${event.id}: user ${userId} enrolled in ${idsToEnroll.join(', ')}`);
}

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey || stripeKey === 'sk_test_your_stripe_key') {
    return NextResponse.json({ message: 'Stripe API Key non configurata' }, { status: 500 });
  }

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!endpointSecret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET mancante: rifiuto elaborazione');
    return NextResponse.json({ message: 'Webhook secret non configurato' }, { status: 500 });
  }

  const sig = req.headers.get('stripe-signature') || '';
  if (!sig) {
    return new NextResponse('Missing stripe-signature header', { status: 400 });
  }

  const stripe = new Stripe(stripeKey);
  // CRITICO: arrayBuffer per la verifica firma (NON usare req.text()).
  const buf = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[webhook] signature verification failed: ${message}`);
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  console.log(`[webhook] received ${event.type} (${event.id})`);

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(event, session);
    }
  } catch (error) {
    console.error(`[webhook] ${event.id} processing error:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
