import { keywords } from '@/assets/data/keywords'
import '@/assets/styles/globals.css'
import FirebaseAuthSync from '@/components/firebase-auth-sync'
import Footer from '@/components/footer'
import Header from '@/components/header'
import TailwindIndicator from '@/components/tailwind-indicator'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { env } from '@/config/env'
import { cn } from '@/lib/utils'
import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ThemeProvider } from '@wrksz/themes/next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'

export const generateViewport = (): Viewport => {
    const themeColor = env.APP_BRAND_COLOUR
    return {
        themeColor
    }
}

export const generateMetadata = async (): Promise<Metadata> => ({
    metadataBase: new URL(env.APP_URL),
    title: {
        default: env.APP_TITLE,
        template: `%s - ${env.APP_TITLE}`
    },
    description: env.APP_DESCRIPTION,
    keywords: [env.APP_TITLE, ...keywords],
    openGraph: {
        type: 'website',
        locale: 'en_US',
        siteName: env.APP_TITLE
        // url: env.APP_URL,
    },
    twitter: {
        card: 'summary_large_image',
        title: env.APP_TITLE,
        description: env.APP_DESCRIPTION,
        /** X wants the @handle, not the profile url */
        creator: `@${new URL(env.APP_SOCIAL_TWITTER).pathname.split('/')[1]}`
    },
    authors: [
        {
            name: env.APP_COMPANY,
            url: env.APP_COMPANY_TWITTER
        }
    ],
    creator: env.APP_COMPANY,
    alternates: {
        canonical: '/'
    }
})

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    /**
     * Get theme from Next.js Theme Provider
     */

    return (
        <html
            lang='en'
            className={cn([
                'scroll-pt-20',
                GeistSans.variable,
                GeistMono.variable
            ])}
            data-scroll-behavior='smooth'
            suppressHydrationWarning>
            <head />
            <body className={cn(['font-sans', 'antialiased', 'min-h-screen'])}>
                <ClerkProvider>
                    <ThemeProvider
                        attribute='class'
                        defaultTheme='system'
                        enableSystem
                        disableTransitionOnChange>
                        <TooltipProvider>
                            <div className='relative flex min-h-screen flex-col'>
                                <Header />
                                <main className='flex-1 flex flex-col'>
                                    <Suspense>{children}</Suspense>
                                </main>
                                <Footer />
                            </div>
                            <Toaster position='bottom-center' />
                            <TailwindIndicator />
                        </TooltipProvider>
                    </ThemeProvider>
                    <FirebaseAuthSync />
                    <Analytics />
                    <SpeedInsights />
                </ClerkProvider>
            </body>
        </html>
    )
}

export default RootLayout
