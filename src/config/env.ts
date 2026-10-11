/**
 * SoopaNova : Environment Configuration
 * @description Validated & type safe environment variables using Zod schema.
 *
 * Server variables are checked when this file is first imported on the
 * server (next.config.ts imports it, so `next dev` and `next build` fail at
 * once with a list of what's missing). Client variables are checked in the
 * browser too; read them through `env.client`.
 *
 * Optional variables are the ones the app already copes without: emails are
 * skipped without Resend, the cron only runs in production, and catalogue
 * writes and the admin page need their own keys. Code that Node runs
 * directly (`yarn catalogue` and src/lib/global-config.ts) can't use the @/
 * alias, so it still reads process.env.
 */
import { createEnv } from 'next-env-safe'
import { z } from 'zod'

/**
 * An optional variable that may be set to "" (as in .env.example)
 */
const optional = <T extends z.ZodTypeAny>(schema: T) =>
    z.preprocess(
        (value) => (value === '' ? undefined : value),
        schema.optional()
    )

/**
 * A whole number such as an image size, set as a string
 */
const count = z.coerce.number().int().positive()

export const env = createEnv({
    server: {
        // App Metadata
        APP_URL: z.url(),
        APP_TITLE: z.string().min(1),
        APP_STRAPLINE: z.string().min(1),
        APP_DESCRIPTION: z.string().min(1),
        APP_BRAND_COLOUR: z.string().regex(/^#[0-9a-f]{6}$/i),
        APP_SOCIAL_FACEBOOK: z.url(),
        APP_SOCIAL_INSTAGRAM: z.url(),
        APP_SOCIAL_TWITTER: z.url(),
        APP_SOCIAL_THREADS: z.url(),
        APP_COMPANY: z.string().min(1),
        APP_COMPANY_URL: z.url(),
        APP_COMPANY_TWITTER: z.url(),

        // File upload config (MB and pixels)
        MAX_UPLOAD_FILE_SIZE: count,
        MIN_IMAGE_WIDTH: count,
        MIN_IMAGE_HEIGHT: count,

        // Firebase
        FIREBASE_STORAGE_BUCKET: z.string().min(1),
        FIREBASE_ORDERS_BUCKET: z.string().min(1),
        FIREBASE_SERVICE_ACCOUNT_PROJECT_ID: z.string().min(1),
        FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL: z.email(),
        FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY: z.string().min(1),
        FIREBASE_FIRESTORE_COLLECTION: z.string().min(1),
        FIREBASE_FIRESTORE_SUB_COLLECTION: z.string().min(1),

        // Prodigi
        PRODIGI_API_KEY: z.string().min(1),
        PRODIGI_API_URL: z.url(),
        PRODIGI_CALLBACK_SECRET: optional(z.string()),
        PRODIGI_SANDBOX_FAKE_CANCEL: optional(z.enum(['true', 'false'])),

        // Stripe
        STRIPE_SECRET_KEY: z.string().regex(/^(sk|rk)_/),
        STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),

        // Resend (emails are skipped without both)
        RESEND_API_KEY: optional(z.string().startsWith('re_')),
        ADMIN_EMAIL: optional(z.email()),

        // Vercel Cron (production only)
        CRON_SECRET: optional(z.string().min(16)),

        // Vercel Global Config: reads need GLOBAL_CONFIG, writes the token
        GLOBAL_CONFIG: z.url(),
        VERCEL_API_TOKEN: optional(z.string()),
        VERCEL_TEAM_ID: optional(z.string().startsWith('team_')),

        // The site owner's Clerk user id (/admin/catalogue)
        ADMIN_USER_ID: optional(z.string().startsWith('user_')),

        // Clerk
        CLERK_SECRET_KEY: z.string().startsWith('sk_'),

        // Vercel system variable: production, preview or development
        VERCEL_ENV: optional(z.enum(['production', 'preview', 'development']))
    },
    client: {
        // App Metadata - Client
        NEXT_PUBLIC_APP_TITLE: z.string().min(1),

        // File upload config - Client
        NEXT_PUBLIC_MAX_UPLOAD_FILE_SIZE: count,
        NEXT_PUBLIC_MIN_IMAGE_WIDTH: count,
        NEXT_PUBLIC_MIN_IMAGE_HEIGHT: count,

        // Firebase - Client
        NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1),
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1),
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
        NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1),

        // Clerk - Client
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().startsWith('pk_'),

        // The admin id (only shows the Admin menu) - Client
        NEXT_PUBLIC_ADMIN_USER_ID: optional(z.string().startsWith('user_'))
    },
    /*
     * Due to how Next.js bundles environment variables on Edge and Client,
     * we need to manually destructure them to make sure all are included in bundle.
     */
    runtimeEnv: {
        // App Metadata
        APP_URL: process.env.APP_URL,
        APP_TITLE: process.env.APP_TITLE,
        APP_STRAPLINE: process.env.APP_STRAPLINE,
        APP_DESCRIPTION: process.env.APP_DESCRIPTION,
        APP_BRAND_COLOUR: process.env.APP_BRAND_COLOUR,
        APP_SOCIAL_FACEBOOK: process.env.APP_SOCIAL_FACEBOOK,
        APP_SOCIAL_INSTAGRAM: process.env.APP_SOCIAL_INSTAGRAM,
        APP_SOCIAL_TWITTER: process.env.APP_SOCIAL_TWITTER,
        APP_SOCIAL_THREADS: process.env.APP_SOCIAL_THREADS,
        APP_COMPANY: process.env.APP_COMPANY,
        APP_COMPANY_URL: process.env.APP_COMPANY_URL,
        APP_COMPANY_TWITTER: process.env.APP_COMPANY_TWITTER,

        // File upload config
        MAX_UPLOAD_FILE_SIZE: process.env.MAX_UPLOAD_FILE_SIZE,
        MIN_IMAGE_WIDTH: process.env.MIN_IMAGE_WIDTH,
        MIN_IMAGE_HEIGHT: process.env.MIN_IMAGE_HEIGHT,

        // Firebase
        FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
        FIREBASE_ORDERS_BUCKET: process.env.FIREBASE_ORDERS_BUCKET,
        FIREBASE_SERVICE_ACCOUNT_PROJECT_ID:
            process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
        FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL:
            process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
        FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY:
            process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY,
        FIREBASE_FIRESTORE_COLLECTION:
            process.env.FIREBASE_FIRESTORE_COLLECTION,
        FIREBASE_FIRESTORE_SUB_COLLECTION:
            process.env.FIREBASE_FIRESTORE_SUB_COLLECTION,

        // Prodigi
        PRODIGI_API_KEY: process.env.PRODIGI_API_KEY,
        PRODIGI_API_URL: process.env.PRODIGI_API_URL,
        PRODIGI_CALLBACK_SECRET: process.env.PRODIGI_CALLBACK_SECRET,
        PRODIGI_SANDBOX_FAKE_CANCEL: process.env.PRODIGI_SANDBOX_FAKE_CANCEL,

        // Stripe
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

        // Resend
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,

        // Vercel Cron
        CRON_SECRET: process.env.CRON_SECRET,

        // Vercel Global Config
        GLOBAL_CONFIG: process.env.GLOBAL_CONFIG,
        VERCEL_API_TOKEN: process.env.VERCEL_API_TOKEN,
        VERCEL_TEAM_ID: process.env.VERCEL_TEAM_ID,

        // Admin
        ADMIN_USER_ID: process.env.ADMIN_USER_ID,

        // Clerk
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,

        // Vercel system variable
        VERCEL_ENV: process.env.VERCEL_ENV,

        // App Metadata - Client
        NEXT_PUBLIC_APP_TITLE: process.env.NEXT_PUBLIC_APP_TITLE,

        // File upload config - Client
        NEXT_PUBLIC_MAX_UPLOAD_FILE_SIZE:
            process.env.NEXT_PUBLIC_MAX_UPLOAD_FILE_SIZE,
        NEXT_PUBLIC_MIN_IMAGE_WIDTH: process.env.NEXT_PUBLIC_MIN_IMAGE_WIDTH,
        NEXT_PUBLIC_MIN_IMAGE_HEIGHT: process.env.NEXT_PUBLIC_MIN_IMAGE_HEIGHT,

        // Firebase - Client
        NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
            process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        NEXT_PUBLIC_FIREBASE_PROJECT_ID:
            process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
            process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
            process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,

        // Clerk - Client
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
            process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,

        // Admin - Client
        NEXT_PUBLIC_ADMIN_USER_ID: process.env.NEXT_PUBLIC_ADMIN_USER_ID
    },
    verbose: process.env.NODE_ENV !== 'development'
})
