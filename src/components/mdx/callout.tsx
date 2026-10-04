import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { Info } from 'lucide-react'
import type { ReactNode } from 'react'

/**
 * A note set apart from the text, as `<Callout title='Heads up'>` around
 * Markdown paragraphs (sized down to the alert's text)
 */
export const Callout = ({
    title,
    children
}: {
    title: string
    children: ReactNode
}) => (
    <Alert className='w-fit max-w-full'>
        <Info className='size-4' />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription
            className={cn([
                'flex flex-col gap-0.5',
                '[&_p]:m-0! [&_p]:w-auto [&_p]:max-w-none [&_p]:text-sm [&_p]:leading-normal'
            ])}>
            {children}
        </AlertDescription>
    </Alert>
)
