/**
 * Entry point: Firebase deploys every function exported from here, named
 * after its export (renaming one deploys a new function and deletes the
 * old one).
 *
 * Writing functions using TypeScript:
 * @link https://firebase.google.com/docs/functions/typescript
 */

import { initializeApp } from 'firebase-admin/app'

/**
 * Initialise the Admin SDK once per instance. Functions only use it inside
 * their handlers, so it's ready by the time they run.
 */
initializeApp()

export { moderateImageUrl } from './moderation'
