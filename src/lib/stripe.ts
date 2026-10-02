import 'server-only'

import Stripe from 'stripe'

let client: Stripe | null = null

/**
 * The Stripe client (server-only). Created on first use, so a missing key
 * fails the request rather than the build.
 */
export const getStripe = () => {
    if (!client) {
        const secretKey = process.env.STRIPE_SECRET_KEY

        if (!secretKey) throw new Error('STRIPE_SECRET_KEY must be set')

        client = new Stripe(secretKey)
    }

    return client
}
