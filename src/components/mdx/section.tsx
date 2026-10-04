import { PageSection } from '@/components/page-section'
import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

/**
 * A content section: a PageSection with the tighter padding the prose pages
 * use. The screenshot guides pass PageSection itself.
 */
export const Section = ({ className, ...props }: ComponentProps<'section'>) => (
    <PageSection
        className={cn('md:py-10', className)}
        {...props}
    />
)
