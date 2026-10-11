import clerkNext from '@clerk/eslint-plugin/next'
import { defineConfig, globalIgnores } from 'eslint/config'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-config-prettier/flat'

export default defineConfig([
    ...nextCoreWebVitals,
    prettier,
    {
        plugins: { '@clerk/next': clerkNext },
        rules: {
            /**
             * Every page, route handler and Server Function must check auth
             * itself (proxy.ts doesn't protect routes)
             */
            '@clerk/next/require-auth-protection': [
                'error',
                {
                    protected: ['**'],
                    public: [
                        /**
                         * Static content pages: auth() would make them dynamic
                         */
                        'src/app',
                        'src/app/about/**',
                        'src/app/faq/**',
                        'src/app/privacy/**',
                        'src/app/terms/**',
                        'src/app/screenshots/**',
                        'src/app/prints/**',
                        'src/app/sign-in/**',
                        'src/app/sign-up/**',
                        'src/app/sso-callback/**',
                        'src/app/llms.txt/**',
                        'src/app/support/**',
                        /**
                         * Server Actions open to anyone, e.g. the support form
                         * (rights holders won't have accounts): each checks its
                         * caller with Vercel BotID instead
                         */
                        'src/actions/public/**',
                        /**
                         * Webhooks: Stripe and Prodigi aren't signed-in users,
                         * so each route verifies its caller itself
                         */
                        'src/app/api/webhooks/**',
                        /**
                         * Vercel Cron jobs: each checks CRON_SECRET itself
                         */
                        'src/app/api/cron/**'
                    ]
                }
            ]
        }
    },
    globalIgnores([
        '.next/**',
        'out/**',
        'build/**',
        'next-env.d.ts',
        'functions/**',
        'design_handoff_*/**'
    ])
])
