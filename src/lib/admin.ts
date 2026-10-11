import 'server-only'
import { env } from '@/config/env'

/**
 * The site owner, by Clerk user id (ADMIN_USER_ID; dev and prod Clerk
 * instances have different ids). Admin pages and actions check it after
 * auth(), and admin pages 404 for everyone else.
 */
export const isAdmin = (userId: string | null | undefined) =>
    !!userId && !!env.ADMIN_USER_ID && userId === env.ADMIN_USER_ID
