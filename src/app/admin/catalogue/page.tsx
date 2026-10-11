import CatalogueApproval from '@/components/catalogue-approval'
import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading
} from '@/components/page-header'
import {
    PageSection,
    PageSectionDescription,
    PageSectionHeading
} from '@/components/page-section'
import { OrderListSkeleton } from '@/components/skeletons'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { isAdmin } from '@/lib/admin'
import {
    describeChange,
    diffCatalogues,
    needsApproval,
    sortChanges
} from '@/lib/catalogue-diff'
import { getPendingCatalogue, readStoredCatalogue } from '@/lib/catalogue-store'
import { catalogueKeys } from '@/lib/global-config'
import { cn } from '@/lib/utils'
import type { StoredCatalogue } from '@/types'
import { auth } from '@clerk/nextjs/server'
import { Info } from 'lucide-react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

/**
 * Signed-in content renders per request, but the header, footer and
 * loading state must stay static so the page appears at once
 */
export const ensureStatic = 'shell'

/**
 * instant = false: kept on purpose, as on /orders. auth.protect() must run
 * before the page renders (the Clerk ESLint rule requires it at the top).
 */
export const instant = false

/**
 * Room for "Check Prodigi now", which quotes every SKU (about 40 Prodigi
 * requests, 3 at a time)
 */
export const maxDuration = 300

export const metadata: Metadata = {
    title: 'Catalogue changes',
    robots: { index: false, follow: false }
}

const dateFormat = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Europe/London'
})

const sources: Record<StoredCatalogue['appliedBy'], string> = {
    cron: 'the weekly refresh',
    script: 'yarn catalogue',
    admin: 'you, on this page'
}

/**
 * The pending catalogue's changes against the live one, with Apply and
 * Discard, or a note that nothing is waiting
 */
const PendingChanges = async () => {
    const [current, pending] = await Promise.all([
        readStoredCatalogue(),
        getPendingCatalogue()
    ])

    if (!pending) {
        return (
            <>
                <Alert className='max-w-xl'>
                    <Info className='size-4' />
                    <AlertTitle>Nothing is waiting for you</AlertTitle>
                    <AlertDescription>
                        {current
                            ? `Prices come from the catalogue applied on ${dateFormat.format(new Date(current.appliedAt))} by ${sources[current.appliedBy]}.`
                            : 'The store has no catalogue yet: run yarn catalogue.'}
                    </AlertDescription>
                </Alert>
                <CatalogueApproval hasPending={false} />
            </>
        )
    }

    const changes = current ? sortChanges(diffCatalogues(current, pending)) : []

    return (
        <>
            <PageSectionDescription>
                Built from Prodigi on{' '}
                {dateFormat.format(new Date(pending.appliedAt))}.{' '}
                {changes.filter(needsApproval).length} of {changes.length}{' '}
                changes are too big to apply on their own: a price moving more
                than 10%, or new options or print areas. Nothing changes on the
                site until you apply them.
            </PageSectionDescription>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Print</TableHead>
                        <TableHead>Change</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody className='[&_td]:whitespace-normal [&_td]:align-top'>
                    {changes.map((change, index) => {
                        const { label, detail, warning } =
                            describeChange(change)

                        return (
                            <TableRow key={index}>
                                <TableCell>{label}</TableCell>
                                <TableCell
                                    className={cn([
                                        'font-mono',
                                        'text-[13px]',
                                        'tabular-nums'
                                    ])}>
                                    <span
                                        className={cn(
                                            warning && 'text-destructive'
                                        )}>
                                        {detail}
                                    </span>
                                </TableCell>
                                <TableCell className='text-right'>
                                    {needsApproval(change) && (
                                        <Badge variant='outline'>
                                            Needs approval
                                        </Badge>
                                    )}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
            <CatalogueApproval hasPending />
        </>
    )
}

const AdminCatalogue = async () => {
    /**
     * Redirect signed-out visitors to sign-in; everyone but the site owner
     * gets a 404
     */
    const { userId } = await auth.protect()

    if (!isAdmin(userId)) notFound()

    return (
        <div>
            <PageHeader eyebrow='Admin'>
                <PageHeaderHeading>Catalogue changes</PageHeaderHeading>
                <PageHeaderDescription>
                    Prodigi&apos;s costs for {catalogueKeys().current}, waiting
                    for approval.
                </PageHeaderDescription>
            </PageHeader>

            <PageSection>
                <PageSectionHeading>Waiting for you</PageSectionHeading>
                <Suspense fallback={<OrderListSkeleton />}>
                    <PendingChanges />
                </Suspense>
            </PageSection>
        </div>
    )
}

export default AdminCatalogue
