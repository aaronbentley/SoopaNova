import Footer from '@/components/footer'
import Header from '@/components/header'
import TailwindIndicator from '@/components/tailwind-indicator'
import ThemeProvider from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { fontSans } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'SoopaNova',
    description: 'Print your screenshots',
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'white' },
        { media: '(prefers-color-scheme: dark)', color: 'black' }
    ]
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
                    fontSans.variable,
                    'min-h-screen',
                    'bg-neutral-50',
                    'dark:bg-neutral-950',
                    'text-neutral-900',
                    'dark:text-neutral-100',
                    'font-sans',
                    'antialiased'
                ])}>
                <ThemeProvider
                    attribute='class'
                    defaultTheme='system'
                    enableSystem
                    disableTransitionOnChange>
                    <div className='relative flex min-h-screen flex-col'>
                        <Header />
                        <div className='flex-1 flex min-h-max flex-col items-center justify-start gap-y-4'>
                            {children}
                        </div>
                        <Footer />
                    </div>
                    <Toaster />
                    <TailwindIndicator />
                </ThemeProvider>
                <Analytics />
            </body>
        </html>
    )
}

export default RootLayout
