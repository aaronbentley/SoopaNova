import { cn } from '@/lib/utils'

/**
 * SoopaNova wordmark: a pink square followed by the app title
 */
const Wordmark = ({
    size = 'md',
    className
}: {
    size?: 'sm' | 'md'
    className?: string
}) => (
    <span
        className={cn(
            [
                'flex',
                'items-center',
                'font-extrabold',
                'tracking-[-0.035em]',
                'text-foreground'
            ],
            size === 'md' ? ['gap-2', 'text-xl'] : ['gap-2', 'text-sm'],
            className
        )}>
        <span
            aria-hidden='true'
            className={cn(
                ['block', 'bg-primary'],
                size === 'md' ? 'size-2.5' : 'size-2'
            )}
        />
        {process.env.NEXT_PUBLIC_APP_TITLE!}
    </span>
)

export default Wordmark
