import { keywords } from '@/assets/data/keywords'
import '@/assets/styles/globals.css'
import Footer from '@/components/footer'
import Header from '@/components/header'
import TailwindIndicator from '@/components/tailwind-indicator'
import ThemeProvider from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { ClerkProvider } from '@clerk/nextjs'
import { shadcn } from '@clerk/themes'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { GeistSans } from 'geist/font/sans'
import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'

// export const generateViewport = async (): Promise<Viewport> => {
export const generateViewport = (): Viewport => {
    const themeColor = process.env.APP_BRAND_COLOUR!
    return {
        themeColor
    }
}

export const generateMetadata = async (): Promise<Metadata> => ({
    metadataBase: new URL(process.env.APP_URL!),
    title: {
        default: process.env.APP_TITLE!,
        template: `%s - ${process.env.APP_TITLE!}`
    },
    description: process.env.APP_DESCRIPTION!,
    keywords: [process.env.APP_TITLE!, ...keywords],
    openGraph: {
        type: 'website',
        locale: 'en_US',
        siteName: process.env.APP_TITLE!
        // url: process.env.APP_URL!,
    },
    twitter: {
        card: 'summary_large_image',
        title: process.env.APP_TITLE!,
        description: process.env.APP_DESCRIPTION!,
        creator: process.env.APP_SOCIAL_TWITTER!
    },
    authors: [
        {
            name: process.env.APP_COMPANY!,
            url: process.env.APP_COMPANY_TWITTER!
        }
    ],
    creator: process.env.APP_COMPANY!,
    alternates: {
        canonical: '/'
    }
})

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    /**
     * Get theme from Next.js Theme Provider
     */

    return (
        <ClerkProvider
            appearance={{
                theme: shadcn,
                layout: {
                    termsPageUrl: '/terms/',
                    privacyPageUrl: '/privacy/',
                    showOptionalFields: true,
                    socialButtonsVariant: 'auto',
                    socialButtonsPlacement: 'top',
                    shimmer: true
                }
            }}>
            <html
                lang='en'
                className={cn(['dark', 'scroll-pt-20', GeistSans.variable])}
                data-scroll-behavior='smooth'
                suppressHydrationWarning>
                {/*
                <script
                    type='application/ld+json'
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            */}
                <head />
                <body
                    className={cn([
                        'font-sans',
                        'antialiased',
                        'min-h-screen'
                    ])}>
                    <ThemeProvider
                        attribute='class'
                        defaultTheme='system'
                        enableSystem
                        disableTransitionOnChange>
                        <TooltipProvider>
                            <div className='relative flex min-h-screen flex-col'>
                                <Header />
                                <div className='flex-1 flex min-h-max flex-col items-center justify-start gap-y-4 md:gap-y-12'>
                                    <Suspense>{children}</Suspense>
                                </div>
                                <Footer />
                            </div>
                            <Toaster position='bottom-center' />
                            <TailwindIndicator />
                        </TooltipProvider>
                    </ThemeProvider>
                    <Analytics />
                    <SpeedInsights />
                </body>
            </html>
        </ClerkProvider>
    )
}

export default RootLayout
