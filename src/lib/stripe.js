import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!stripePublishableKey) {
  console.warn('⚠️ Stripe env var missing. Add VITE_STRIPE_PUBLISHABLE_KEY to your .env file.')
}

export const stripePromise = loadStripe(stripePublishableKey || 'pk_test_placeholder')

// Replace this with your actual Stripe Payment Link URL
// Create one at: stripe.com → Payment Links → Create
export const STRIPE_PAYMENT_LINK = import.meta.env.VITE_STRIPE_PAYMENT_LINK || '#'
