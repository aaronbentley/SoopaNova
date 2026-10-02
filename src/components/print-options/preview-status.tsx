'use client'

import { Typography } from '@/components/typography'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import type { PrintStatus } from '@/hooks/use-create-print'
import { cn } from '@/lib/utils'
import { AlertTriangle, Loader2, ShieldAlert } from 'lucide-react'

interface PreviewStatusProps {
    status: PrintStatus
    progress: number
    error: string | null
    onRetry: () => void
}

const overlay = [
    'absolute',
    'inset-0',
    'z-10',
    'flex',
    'flex-col',
    'items-center',
    'justify-center',
    'gap-3',
    'p-6',
    'text-center'
]

/**
 * Upload and moderation status, shown over the print preview
 */
const PreviewStatus = ({
    status,
    progress,
    error,
    onRetry
}: PreviewStatusProps) => {
    if (status === 'uploading') {
        return (
            <div className='absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 bg-linear-to-t from-background/90 to-transparent p-4 pt-12'>
                <span className='eyebrow text-foreground'>Uploading</span>
                <Progress
                    value={progress}
                    aria-label='Upload progress'
                />
            </div>
        )
    }

    if (status === 'moderating') {
        return (
            <div className={cn(overlay, 'bg-background/50')}>
                <Loader2 className='size-10 animate-spin text-primary' />
                <span className='eyebrow text-foreground'>
                    Checking your screenshot
                </span>
            </div>
        )
    }

    if (status === 'flagged') {
        return (
            <div className={cn(overlay, 'bg-background/80 backdrop-blur-md')}>
                <ShieldAlert className='size-10 text-destructive' />
                <Typography
                    variant='p'
                    className='font-semibold'>
                    We can&apos;t print this screenshot
                </Typography>
                <p className='max-w-sm text-sm text-pretty text-muted-foreground'>
                    It looks like it may contain adult content. Close this and
                    choose a different screenshot.
                </p>
            </div>
        )
    }

    if (status === 'error') {
        return (
            <div className={cn(overlay, 'bg-background/80 backdrop-blur-sm')}>
                <AlertTriangle className='size-10 text-destructive' />
                <p className='max-w-sm text-sm text-pretty text-muted-foreground'>
                    {error ?? 'Something went wrong.'}
                </p>
                <Button
                    size='sm'
                    onClick={onRetry}>
                    Try again
                </Button>
            </div>
        )
    }

    return null
}

export default PreviewStatus
