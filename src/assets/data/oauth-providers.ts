import type { OAuthStrategy } from '@clerk/nextjs/types'

/**
 * Social connections offered on sign-in/up and /account. Must match the
 * providers enabled in the Clerk dashboard (no Clerk UI reads that for us).
 */
export const oauthProviders: {
    strategy: OAuthStrategy
    provider: string
    label: string
    iconUrl: string
}[] = [
    {
        strategy: 'oauth_google',
        provider: 'google',
        label: 'Google',
        iconUrl: 'https://img.clerk.com/static/google.svg'
    },
    {
        strategy: 'oauth_discord',
        provider: 'discord',
        label: 'Discord',
        iconUrl: 'https://img.clerk.com/static/discord.svg'
    },
    {
        strategy: 'oauth_microsoft',
        provider: 'microsoft',
        label: 'Microsoft',
        iconUrl: 'https://img.clerk.com/static/microsoft.svg'
    }
]
