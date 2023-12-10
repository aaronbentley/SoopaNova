import { keywords } from '@/assets/data/keywords'
import { clerkTheme } from '@/assets/styles/clerk-theme'
import Footer from '@/components/footer'
import Header from '@/components/header'
import TailwindIndicator from '@/components/tailwind-indicator'
import ThemeProvider from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { GeistSans } from 'geist/font/sans'
import type { Metadata, Viewport } from 'next'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config.js'
import './globals.css'

// export const generateViewport = async (): Promise<Viewport> => {
export const generateViewport = (): Viewport => {
    /**
     * Resolve Tailwind CSS config
     */
    const fullConfig = resolveConfig(tailwindConfig)

    /**
     * Get color values from Tailwind CSS config
     */
    const colors = fullConfig?.theme?.colors
    // @ts-ignore next-line
    const themeColor = colors?.pink?.['500']
    return {
        themeColor: themeColor
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
    authors: [
        {
            name: process.env.APP_COMPANY!,
            url: process.env.APP_COMPANY_TWITTER!
        }
    ],
    creator: process.env.APP_COMPANY!,
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: process.env.APP_URL!,
        title: process.env.APP_TITLE!,
        description: process.env.APP_DESCRIPTION!,
        siteName: process.env.APP_TITLE!
        // images: []
    },
    twitter: {
        card: 'summary_large_image',
        title: process.env.APP_TITLE!,
        description: process.env.APP_DESCRIPTION!,
        creator: process.env.APP_SOCIAL_TWITTER!
    }
    // manifest: '',
})

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <ClerkProvider appearance={clerkTheme}>
            <html
                lang='en'
                className={cn([
                    // 'light',
                    'dark',
                    'scroll-pt-20',
                    GeistSans.variable
                ])}
                suppressHydrationWarning>
                <head />
                <body
                    className={cn([
                        'bg-neutral-50',
                        'dark:bg-neutral-950',
                        'text-neutral-900',
                        'dark:text-neutral-100',
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
                                    {children}
                                </div>
                                <Footer />
                            </div>
                            <Toaster />
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
