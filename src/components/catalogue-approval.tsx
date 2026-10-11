'use client'

import {
    applyPendingCatalogueAction,
    discardPendingCatalogueAction,
    refreshCatalogueAction,
    type CatalogueActionResult
} from '@/actions/catalogue'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'

const failed = "Couldn't reach the server. Please try again."

/**
 * /admin/catalogue's buttons: check Prodigi now, and apply or discard the
 * pending catalogue when there is one
 */
const CatalogueApproval = ({ hasPending }: { hasPending: boolean }) => {
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

            toast.success(result.summary ?? success)
            router.refresh()
        })

    return (
        <div className='flex flex-wrap gap-3'>
            {hasPending && (
                <>
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
                </>
            )}
            <Button
                variant={hasPending ? 'ghost' : 'outline'}
                disabled={pending}
                onClick={() =>
                    run(refreshCatalogueAction, 'Catalogue checked')
                }>
                <RefreshCw className={cn(pending && 'animate-spin')} />
                {pending ? 'Checking…' : 'Check Prodigi now'}
            </Button>
        </div>
    )
}

export default CatalogueApproval
