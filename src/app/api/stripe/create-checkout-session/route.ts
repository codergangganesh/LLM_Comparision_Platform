import { NextRequest } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const { priceId, userId } = await req.json()

    // Validate input
    if (!priceId) {
      return new Response(
        JSON.stringify({ error: 'Price ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/cancelled`,
      client_reference_id: userId || undefined,
    })

    return new Response(
      JSON.stringify({ sessionId: session.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to create checkout session' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}