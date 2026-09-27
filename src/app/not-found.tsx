import { ctaButtonVariants } from '@/components/cta-button'
import {
    Hero,
    HeroActions,
    HeroDescription,
    HeroHeading,
    HeroPill
} from '@/components/hero'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Not Found',
    description: 'It appears this side quest has been lost to the void.'
}

const NotFound = async () => (
    <Hero className='flex-1 border-b-0'>
        <HeroPill>
            <span>Error</span>
            <span className='opacity-50'>·</span>
            <span className='text-foreground'>404</span>
        </HeroPill>
        <HeroHeading>Page Not Found</HeroHeading>
        <HeroDescription>
            It appears this side quest has been lost to the void.
        </HeroDescription>
        <HeroActions>
            <Link
                href='/'
                className={ctaButtonVariants()}>
                Respawn
            </Link>
        </HeroActions>
    </Hero>
)

export default NotFound
