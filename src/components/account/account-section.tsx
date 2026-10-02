import {
    PageSection,
    PageSectionDescription,
    PageSectionHeading
} from '@/components/page-section'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

/**
 * An /account section: heading, description, optional action, then a
 * hairline list of rows
 */
export const AccountSection = ({
    title,
    description,
    action,
    children
}: {
    title: string
    description?: ReactNode
    action?: ReactNode
    children: ReactNode
}) => (
    <PageSection className='md:py-10'>
        <div className='flex w-full flex-wrap items-end justify-between gap-4'>
            <div className='flex min-w-0 flex-1 flex-col gap-2'>
                <PageSectionHeading>{title}</PageSectionHeading>
                {description && (
                    <PageSectionDescription>
                        {description}
                    </PageSectionDescription>
                )}
            </div>
            {action}
        </div>
        <div className='w-full divide-y rounded-lg border'>{children}</div>
    </PageSection>
)

export const AccountRow = ({
    className,
    children
}: {
    className?: string
    children: ReactNode
}) => (
    <div
        className={cn(
            [
                'flex',
                'flex-wrap',
                'items-center',
                'gap-x-4',
                'gap-y-2',
                'px-4',
                'py-3'
            ],
            className
        )}>
        {children}
    </div>
)
