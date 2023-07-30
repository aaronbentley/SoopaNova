import type { Metadata } from 'next'
import { Nunito_Sans } from 'next/font/google'
import './globals.css'

const inter = Nunito_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'SoopaNova',
    description: 'Print your screenshots'
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang='en'>
            <body className={inter.className}>{children}</body>
        </html>
    )
}

export default RootLayout
