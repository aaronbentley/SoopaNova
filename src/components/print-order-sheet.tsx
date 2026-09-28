'use client'

import CanvaspopCart from '@/components/canvaspop-cart'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet'

interface PrintOrderSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    cartUrl: string | null
    sessionId: string | null
}

const PrintOrderSheet = ({
    open,
    onOpenChange,
    cartUrl,
    sessionId
}: PrintOrderSheetProps) => (
    <Sheet
        open={open}
        onOpenChange={onOpenChange}>
        <SheetContent
            side='bottom'
            className='h-screen flex flex-col gap-y-6 border-none container mx-auto'>
            <SheetHeader>
                <SheetTitle className='font-extrabold'>Print Order</SheetTitle>
                <SheetDescription>
                    Make something awesome. Make it your own.
                </SheetDescription>
            </SheetHeader>
            {cartUrl && sessionId && (
                <CanvaspopCart
                    src={cartUrl}
                    sessionId={sessionId}
                />
            )}
        </SheetContent>
    </Sheet>
)

export default PrintOrderSheet
