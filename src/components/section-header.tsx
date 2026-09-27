import { cn } from '@/lib/utils'

/**
 * Pink eyebrow, large heading and muted sub-heading for a page section
 */
const SectionHeader = ({
    eyebrow,
    heading,
    description,
    className
}: {
    eyebrow: string
    heading: React.ReactNode
    description?: React.ReactNode
    className?: string
}) => (
    <div
        className={cn(['flex', 'flex-col', 'items-start', 'gap-5'], className)}>
        <div>
            <p className='eyebrow text-primary'>{eyebrow}</p>
            <h2 className='mt-4 max-w-[640px] text-[clamp(34px,4.5vw,56px)] leading-none font-bold tracking-[-0.045em] text-balance'>
                {heading}
            </h2>
        </div>
        {description && (
            <p className='max-w-[560px] text-lg leading-normal text-muted-foreground text-pretty'>
                {description}
            </p>
        )}
    </div>
)

export default SectionHeader
