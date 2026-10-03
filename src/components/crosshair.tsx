import { cn } from '@/lib/utils'

/**
 * Small "+" mark for the corners of a hairline grid (position it with
 * className, e.g. `-top-1.75 -left-1.75`)
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

export default Crosshair
