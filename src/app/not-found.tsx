import { Hero, HeroDescription, HeroHeading } from '@/components/hero'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Not Found',
    description: 'It appears this side quest has been lost to the void.'
}

const NotFound = async () => (
    <>
        <Hero className='h-screen sm:h-full'>
            <HeroHeading>Page Not Found</HeroHeading>
            <HeroDescription className='text-balance'>
                It appears this side quest has been lost to the void.
            </HeroDescription>
            <Link
                href='/'
                className={cn(buttonVariants({ variant: 'default' }), [
                    'mt-4',
                    'bg-pink-500',
                    'dark:bg-pink-500',
                    'hover:bg-pink-500/90',
                    'hover:dark:bg-pink-500/90'
                ])}>
                Respawn
            </Link>
        </Hero>
    </>
)

export default NotFound
