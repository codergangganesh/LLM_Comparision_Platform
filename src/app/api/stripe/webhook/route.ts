import { NextRequest } from 'next/server'
import { stripe } from '@/lib/stripe'
import { buffer } from 'node:stream/consumers'

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !webhookSecret) {
    return new Response(
      JSON.stringify({ error: 'Missing signature or webhook secret' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    // Get the raw body buffer
    const rawBody = await buffer(req.body as any)
    
    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      webhookSecret
    )

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        console.log('Checkout session completed:', session)
        // Handle successful checkout session
        break
      case 'invoice.payment_succeeded':
        const invoice = event.data.object
        console.log('Invoice payment succeeded:', invoice)
        // Handle successful invoice payment
        break
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Webhook error:', err)
    return new Response(
      JSON.stringify({ error: 'Webhook handler failed' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}