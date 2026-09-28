import { heroImage, platforms, products, steps } from '@/assets/data/home'
import { ctaButtonVariants } from '@/components/cta-button'
import {
    Hero,
    HeroActions,
    HeroDescription,
    HeroFrame,
    HeroHeading,
    HeroPill
} from '@/components/hero'
import PlatformTile, { PlatformStrip } from '@/components/platform-tile'
import SectionHeader from '@/components/section-header'
import UploadFile from '@/components/upload-file'
import { cn } from '@/lib/utils'
import { Show } from '@clerk/nextjs'
import { ArrowRight, UploadCloud } from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
    title: {
        absolute: `${process.env.APP_TITLE!} - ${process.env.APP_STRAPLINE!}`
    }
}

/**
 * Small "+" mark for the corners of the How it works grid
 */
const Crosshair = ({ className }: { className?: string }) => (
    <span
        aria-hidden='true'
        className={cn(
            [
                'absolute',
                'size-3.25',
                'bg-[linear-gradient(var(--foreground),var(--foreground)),linear-gradient(var(--foreground),var(--foreground))]',
                'bg-size-[1px_100%,100%_1px]',
                'bg-center',
                'bg-no-repeat'
            ],
            className
        )}
    />
)

const Frontpage = () => (
    <>
        <Hero>
            <HeroPill>
                <span>Play</span>
                <ArrowRight
                    aria-hidden='true'
                    className='size-3 opacity-50'
                />
                <span>Capture</span>
                <ArrowRight
                    aria-hidden='true'
                    className='size-3 opacity-50'
                />
                <span>Upload</span>
                <ArrowRight
                    aria-hidden='true'
                    className='size-3 opacity-50'
                />
                <span className='text-foreground'>Print</span>
            </HeroPill>
            <HeroHeading>
                From Pixels
                <br />
                to Prints
            </HeroHeading>
            <HeroDescription>
                Print your gaming screenshots, preserve your gaming moments.
            </HeroDescription>
            <HeroActions>
                <Show when='signed-in'>
                    <UploadFile variant='button' />
                </Show>
                <Show when='signed-out'>
                    <Link
                        href='/create/'
                        className={ctaButtonVariants()}>
                        <UploadCloud aria-hidden='true' />
                        Upload a screenshot
                    </Link>
                </Show>
                <a
                    href='#prints'
                    className={ctaButtonVariants({ variant: 'secondary' })}>
                    Browse print types
                </a>
            </HeroActions>
            <HeroFrame>
                <Image
                    src={heroImage}
                    alt='A gaming screenshot printed and hung on a wall'
                    placeholder='blur'
                    loading='eager'
                    fetchPriority='high'
                    fill
                    sizes='(max-width: 1128px) 100vw, 1080px'
                    className='object-cover'
                />
            </HeroFrame>
        </Hero>

        <section className='border-b'>
            <PlatformStrip
                className='wrapper'
                intro={
                    <>
                        <p className='eyebrow text-muted-foreground'>
                            Choose your platform
                        </p>
                        <p className='text-[15px]'>
                            How to download your screenshots
                        </p>
                    </>
                }>
                {platforms.map((platform) => (
                    <PlatformTile
                        key={platform.href}
                        href={platform.href}
                        name={platform.name}
                        detail={platform.maker}
                        Icon={platform.Icon}
                    />
                ))}
            </PlatformStrip>
        </section>

        <section className='border-b'>
            <div className='wrapper py-20 md:py-30'>
                <SectionHeader
                    eyebrow='How it works'
                    heading='Upload your screenshots. Create your prints.'
                    description='Make something awesome. Make it your own.'
                />
                <div className='relative mt-14 grid border lg:grid-cols-3'>
                    <Crosshair className='-top-1.75 -left-1.75' />
                    <Crosshair className='-right-1.75 -bottom-1.75' />
                    {steps.map((step, index) => (
                        <div
                            key={step.title}
                            className={cn([
                                'flex',
                                'min-h-48',
                                'lg:min-h-65',
                                'flex-col',
                                'gap-3.5',
                                'p-8',
                                'transition-colors',
                                'duration-200',
                                'hover:bg-card',
                                'not-first:border-t',
                                'lg:not-first:border-t-0',
                                'lg:not-first:border-l'
                            ])}>
                            <div className='flex items-center justify-between gap-4'>
                                <span className='font-mono text-xs text-muted-foreground'>
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <span className='eyebrow text-[11px] text-primary'>
                                    {step.tagline}
                                </span>
                            </div>
                            <h3 className='mt-auto text-2xl font-semibold tracking-[-0.03em]'>
                                {step.title}
                            </h3>
                            <p className='text-[15px] leading-[1.55] text-muted-foreground text-pretty'>
                                {step.body}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section
            id='prints'
            className='border-b'>
            <div className='wrapper py-20 md:py-30'>
                <SectionHeader
                    eyebrow='Power-up Prints'
                    heading='Create mighty-fine artwork for your space.'
                    description='Everything looks better, bigger. Sizes from 8″×14″ all the way up to 38″×70″.'
                />
                <div className='mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    {products.map((product) => (
                        <Link
                            key={product.name}
                            href='/create/'
                            className='flex flex-col overflow-hidden rounded-xl border bg-background transition-colors duration-200 hover:border-primary'>
                            <div className='relative aspect-4/3 overflow-hidden border-b'>
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    placeholder='blur'
                                    fill
                                    sizes='(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 380px'
                                    className='object-cover'
                                />
                            </div>
                            <div className='flex flex-1 flex-col gap-3 p-6'>
                                <div className='flex items-baseline justify-between gap-3'>
                                    <h3 className='text-[22px] font-semibold tracking-[-0.03em]'>
                                        {product.name}
                                    </h3>
                                    <span className='font-mono text-[13px] text-muted-foreground'>
                                        from{' '}
                                        <span className='text-foreground'>
                                            {product.price}
                                        </span>
                                    </span>
                                </div>
                                <p className='text-[15px] leading-[1.55] text-muted-foreground text-pretty'>
                                    {product.body}
                                </p>
                                <div className='mt-auto flex flex-wrap gap-1.5 pt-3'>
                                    {product.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className='rounded-sm border px-2 py-1 font-mono text-[11px] text-muted-foreground'>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>

        <section className='relative overflow-hidden'>
            <div
                aria-hidden='true'
                className='pointer-events-none absolute inset-0 bg-grid mask-fade-bottom'
            />
            <div className='wrapper relative flex flex-col items-center py-24 md:py-32 text-center'>
                <h2 className='text-[clamp(36px,5vw,64px)] leading-none font-bold tracking-[-0.05em] text-balance'>
                    Make something awesome.
                    <br />
                    <span className='text-muted-foreground'>
                        Make it your own.
                    </span>
                </h2>
                <div className='mt-9 flex flex-wrap justify-center gap-3'>
                    <Link
                        href='/create/'
                        className={ctaButtonVariants()}>
                        Get Started
                    </Link>
                    <Link
                        href='/faq/'
                        className={ctaButtonVariants({ variant: 'secondary' })}>
                        Read the FAQ
                    </Link>
                </div>
            </div>
        </section>
    </>
)

export default Frontpage
