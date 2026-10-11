/**
 * Forward Stripe test events to the local dev server's webhook route:
 *
 *   yarn stripe:listen
 *
 * Uses the app's own STRIPE_SECRET_KEY from .env.local (passed as
 * STRIPE_API_KEY, so it isn't shown in the process list) rather than the
 * Stripe CLI's login, which expires and can go stale. That also means it
 * always listens on the same sandbox the app uses. Test keys only, so live
 * events can never be forwarded here. Its webhook signing secret
 * (`stripe listen --print-secret`) must match STRIPE_WEBHOOK_SECRET.
 */
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

process.loadEnvFile(fileURLToPath(new URL('../.env.local', import.meta.url)))

const apiKey = process.env.STRIPE_SECRET_KEY

if (!apiKey) {
    console.error('STRIPE_SECRET_KEY must be set in .env.local')
    process.exit(1)
}

if (!/^(sk|rk)_test_/.test(apiKey)) {
    console.error('STRIPE_SECRET_KEY must be a test key to forward events')
    process.exit(1)
}

/**
 * The events the webhook route handles (src/app/api/webhooks/stripe)
 */
const events = [
    'checkout.session.completed',
    'checkout.session.async_payment_succeeded',
    'checkout.session.expired',
    'charge.refunded'
]

const listener = spawn(
    'stripe',
    [
        'listen',
        '--forward-to',
        'https://localhost:3000/api/webhooks/stripe/',
        '--skip-verify',
        '--events',
        events.join(',')
    ],
    {
        stdio: 'inherit',
        env: { ...process.env, STRIPE_API_KEY: apiKey }
    }
)

listener.on('error', (error) => {
    console.error('Couldn’t start the Stripe CLI (is it installed?)', error)
    process.exit(1)
})

listener.on('exit', (code) => process.exit(code ?? 0))
