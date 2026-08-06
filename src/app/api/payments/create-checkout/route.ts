import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin, getAuthUser } from '../../../../lib/supabase-admin';

export const runtime = 'nodejs';

interface CartItem {
  courseId: string;
  title: string;
  amount: number;
}

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey || stripeKey === 'sk_test_your_stripe_key') {
    return NextResponse.json({ message: 'Stripe non configurato' }, { status: 500 });
  }

  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Non autorizzato' }, { status: 401 });
  }

  const token = authHeader.substring('Bearer '.length);
  const authUser = await getAuthUser(token);
  if (!authUser) {
    return NextResponse.json({ message: 'Token non valido' }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const items = Array.isArray(body.items)
    ? (body.items as CartItem[]).filter(
        (i) =>
          i &&
          typeof i.courseId === 'string' &&
          typeof i.title === 'string' &&
          typeof i.amount === 'number' &&
          i.amount > 0,
      )
    : [];

  const courseId = typeof body.courseId === 'string' ? body.courseId : '';

  if (items.length === 0 && !courseId) {
    return NextResponse.json({ message: 'Nessun corso selezionato' }, { status: 400 });
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const stripe = new Stripe(stripeKey);

    type LineItem = {
      price_data: { currency: string; product_data: { name: string }; unit_amount: number };
      quantity: number;
    };
    let line_items: LineItem[] = [];
    let courseIdsMeta: string[] = [];

    if (items.length > 0) {
      line_items = items.map((item) => ({
        price_data: {
          currency: 'eur',
          product_data: { name: item.title },
          unit_amount: Math.round(item.amount * 100),
        },
        quantity: 1,
      }));
      courseIdsMeta = items.map((i) => i.courseId);
    } else if (courseId) {
      // Singolo corso: recupera titolo e prezzo da Supabase
      const { data: course } = await supabaseAdmin
        .from('courses')
        .select('title, price')
        .eq('id', courseId)
        .maybeSingle();

      if (!course) {
        return NextResponse.json({ message: 'Corso non trovato' }, { status: 404 });
      }

      line_items = [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: course.title },
            unit_amount: Math.round(course.price * 100),
          },
          quantity: 1,
        },
      ];
      courseIdsMeta = [courseId];
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      success_url: `${baseUrl}/dashboard?success=true`,
      cancel_url: `${baseUrl}/courses?canceled=true`,
      customer_email: authUser.email,
      metadata: {
        userId: authUser.id,
        courseIds: courseIdsMeta.join(','),
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('[create-checkout] error:', error);
    return NextResponse.json({ message: 'Errore creazione checkout' }, { status: 500 });
  }
}