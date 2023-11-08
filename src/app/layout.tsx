import Footer from '@/components/footer'
import Header from '@/components/header'
import TailwindIndicator from '@/components/tailwind-indicator'
import ThemeProvider from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/react'
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

export const generateMetadata = async (): Promise<Metadata> => {
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
        metadataBase: new URL(process.env.APP_URL!),
        title: {
            default: process.env.APP_TITLE!,
            template: `%s - ${process.env.APP_TITLE!}`
        },
        description: process.env.APP_DESCRIPTION!,
        keywords: [
            process.env.APP_TITLE!,
            'Prints',
            'Poster Prints',
            'Canvas Prints',
            'Framed Prints',
            'Screenshots',
            'Pixels',
            'Xbox',
            'PlayStation',
            'Steam'
        ],
        // themeColor: themeColor,
        authors: [
            {
                name: 'Aaron Bentley',
                url: 'https://twitter.com/aaronbentley'
            }
        ],
        creator: 'Aaron Bentley',
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
        // icons: {},
        // manifest: '',
    }
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <ClerkProvider
            appearance={{
                elements: {
                    card: 'bg-white border-neutral-200 text-neutral-950 shadow-lg dark:border-neutral-800 dark:bg-black dark:text-neutral-50',
                    headerTitle: 'text-neutral-900 dark:text-neutral-100',
                    headerSubtitle: 'text-neutral-900 dark:text-neutral-100',
                    socialButtonsBlockButton:
                        'text-neutral-900 dark:text-neutral-100 border-neutral-200 dark:border-neutral-800 ',
                    socialButtonsBlockButtonArrow:
                        'text-pink-500 dark:text-pink-500',
                    formFieldRow: 'text-neutral-900 dark:text-neutral-100',
                    formFieldLabel: 'text-neutral-900 dark:text-neutral-100',
                    dividerLine: 'bg-neutral-100 dark:bg-neutral-800',
                    dividerText: 'text-neutral-500 dark:text-neutral-500',
                    formFieldInput:
                        'text-neutral-900 dark:text-neutral-100 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-pink-500',
                    formFieldWarningText:
                        'text-neutral-900 dark:text-neutral-100',
                    formFieldSuccessText:
                        'text-neutral-900 dark:text-neutral-100',
                    formButtonPrimary:
                        'bg-pink-500 dark:bg-pink-500 hover:bg-pink-500/90 dark:hover:bg-pink-500/90 capitalize',
                    footerActionText: 'text-neutral-900 dark:text-neutral-100',
                    footerActionLink:
                        'font-medium text-neutral-900 dark:text-neutral-100 underline underline-offset-4 transition-colors duration-200 hover:text-pink-500 dark:hover:text-pink-500'
                }
            }}>
            <html
                lang='en'
                className='light'
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
                        'min-h-screen',
                        'scroll-pt-24'
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
                </body>
            </html>
        </ClerkProvider>
    )
}

export default RootLayout
