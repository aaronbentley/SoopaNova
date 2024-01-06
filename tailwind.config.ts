import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: ['class'],
    content: ['./src/**/*.{ts,tsx}'],
    theme: {
        container: {
            center: true,
            padding: '2rem'
        },
        extend: {
            fontFamily: {
                sans: ['var(--font-geist-sans)']
            }
        }
    },
    plugins: [require('tailwindcss-animate')]
}

export default config
