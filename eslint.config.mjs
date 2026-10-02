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
                        'src/app/sign-in/**',
                        'src/app/sign-up/**',
                        'src/app/sso-callback/**'
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
