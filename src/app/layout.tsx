import Header from '@/components/header'
import ThemeProvider from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { fontSans } from '@/lib/fonts'
import { cn } from '@/lib/utils'
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
                    'text-neutral-950',
                    'dark:text-neutral-50',
                    'bg-none',
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
                        <div className='flex-1 flex min-h-max flex-col items-center justify-center'>
                            {children}
                        </div>
                    </div>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    )
}

export default RootLayout
