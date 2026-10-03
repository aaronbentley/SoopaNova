import { platforms } from '@/assets/data/platforms'
import {
    productTypes,
    regions,
    type ProductTypeId
} from '@/assets/data/pricing'
import { heroImage, productImages } from '@/assets/data/product-images'
import { productCopy, sizeRange } from '@/assets/data/products'
import { steps } from '@/assets/data/steps'
import Crosshair from '@/components/crosshair'
import { ctaButtonVariants } from '@/components/cta-button'
import {
    Hero,
    HeroActions,
    HeroDescription,
    HeroFrame,
    HeroHeading,
    HeroPill
} from '@/components/hero'
import HeroUploadAction from '@/components/hero-upload-action'
import PlatformTile, { PlatformStrip } from '@/components/platform-tile'
import ProductPrice from '@/components/product-price'
import SectionHeader from '@/components/section-header'
import { getFromPrice } from '@/lib/pricing'
import { cn } from '@/lib/utils'
import type { Region } from '@/types'
import { ArrowRight } from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

/**
 * Each product's "from" price in every region, worked out at build time;
 * ProductPrice shows the visitor's
 */
const products = (Object.keys(productTypes) as ProductTypeId[]).map((id) => ({
    id,
    name: productTypes[id].name,
    image: productImages[id],
    ...productCopy[id],
    prices: Object.fromEntries(
        (Object.keys(regions) as Region[]).map((region) => [
            region,
            getFromPrice(id, region)
        ])
    ) as Record<Region, ReturnType<typeof getFromPrice>>
}))

export const metadata: Metadata = {
    title: {
        absolute: `${process.env.APP_TITLE!} - ${process.env.APP_STRAPLINE!}`
    }
}

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
                <HeroUploadAction />
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
                    description={`Four ways to put your favourite screenshot on the wall, in sizes from ${sizeRange}.`}
                />
                <div className='mt-14 grid gap-4 md:grid-cols-2'>
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            href='/create/'
                            className='group flex flex-col overflow-hidden rounded-xl border bg-background transition-colors duration-200 hover:border-primary'>
                            <div className='relative aspect-4/3 overflow-hidden border-b'>
                                {product.image ? (
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        placeholder='blur'
                                        fill
                                        sizes='(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 600px'
                                        className='object-cover'
                                    />
                                ) : (
                                    /** No photo yet: the grid backdrop and the brand square */
                                    <div className='flex size-full items-center justify-center bg-card'>
                                        <div
                                            aria-hidden='true'
                                            className='absolute inset-0 bg-grid mask-fade-bottom'
                                        />
                                        <span
                                            aria-hidden='true'
                                            className='relative size-3 bg-primary shadow-[0_0_24px_var(--primary)]'
                                        />
                                    </div>
                                )}
                            </div>
                            <div className='flex flex-1 flex-col gap-3 p-6'>
                                <div className='flex items-baseline justify-between gap-3'>
                                    <h3 className='text-[22px] font-semibold tracking-[-0.03em]'>
                                        {product.name}
                                    </h3>
                                    <span className='shrink-0 font-mono text-[13px] text-muted-foreground'>
                                        <ProductPrice prices={product.prices} />
                                    </span>
                                </div>
                                <p className='text-[15px] leading-[1.55] text-muted-foreground text-pretty'>
                                    {product.description}
                                </p>
                                <div className='mt-auto flex flex-wrap gap-1.5 pt-3'>
                                    {product.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className='rounded-sm border px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors duration-200 group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary group-focus-visible:border-primary/40 group-focus-visible:bg-primary/10 group-focus-visible:text-primary'>
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
                <h2 className='text-[clamp(36px,5vw,64px)] leading-none font-bold tracking-tighter text-balance'>
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
