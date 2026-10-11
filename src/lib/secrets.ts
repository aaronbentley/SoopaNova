import 'server-only'

import { createHash, timingSafeEqual } from 'node:crypto'

const sha256 = (value: string) => createHash('sha256').update(value).digest()

/**
 * Compare a token from a request with a secret in constant time (hashing
 * first evens out the lengths)
 */
export const isValidToken = (token: string | null, secret: string) =>
    token !== null && timingSafeEqual(sha256(token), sha256(secret))
