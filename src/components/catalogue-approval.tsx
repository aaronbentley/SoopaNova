'use client'

import {
    applyPendingCatalogueAction,
    discardPendingCatalogueAction,
    type CatalogueActionResult
} from '@/actions/catalogue'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'

const failed = "Couldn't reach the server. Please try again."

/**
 * Apply or discard the pending catalogue on /admin/catalogue
 */
const CatalogueApproval = () => {
    const router = useRouter()
    const [pending, startTransition] = useTransition()

    const run = (
        action: () => Promise<CatalogueActionResult>,
        success: string
    ) =>
        startTransition(async () => {
            const result = await action().catch(() => ({ message: failed }))

            if ('message' in result) {
                toast.error(result.message)
                return
            }

            toast.success(success)
            router.refresh()
        })

    return (
        <div className='flex flex-wrap gap-3'>
            <Button
                disabled={pending}
                onClick={() =>
                    run(
                        applyPendingCatalogueAction,
                        'Applied: the new prices are live'
                    )
                }>
                Apply changes
            </Button>
            <Button
                variant='outline'
                disabled={pending}
                onClick={() =>
                    run(
                        discardPendingCatalogueAction,
                        'Discarded: prices stay as they are'
                    )
                }>
                Discard
            </Button>
        </div>
    )
}

export default CatalogueApproval
