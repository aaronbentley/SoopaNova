import Footer from '@/components/footer'
import Header from '@/components/header'
import TailwindIndicator from '@/components/tailwind-indicator'
import ThemeProvider from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { nunitoSans } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config.js'
import './globals.css'

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
            'Screenshots',
            'Pixels',
            'Prints',
            'Posters',
            'Canvas Prints',
            'Framed Prints'
        ],
        themeColor: themeColor,
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
            creator: '@aaronbentley'
        }
        // icons: {},
        // manifest: '',
    }
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html
            lang='en'
            className='light'
            suppressHydrationWarning>
            <head />
            <body
                className={cn([
                    nunitoSans.variable,
                    'bg-neutral-50',
                    'dark:bg-neutral-950',
                    'text-neutral-900',
                    'dark:text-neutral-100',
                    'font-sans',
                    'antialiased',
                    'min-h-screen',
                    'scroll-pt-20'
                ])}>
                <ThemeProvider
                    attribute='class'
                    defaultTheme='system'
                    enableSystem
                    disableTransitionOnChange>
                    <TooltipProvider>
                        <div className='relative flex min-h-screen flex-col'>
                            <Header />
                            <div className='flex-1 flex min-h-max flex-col items-center justify-start gap-y-4'>
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
    )
}

export default RootLayout
