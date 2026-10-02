import { Skeleton } from '@/components/ui/skeleton'

export const OrderListSkeleton = ({ rows = 3 }: { rows?: number }) => (
    <div className='w-full divide-y border-y'>
        {[...Array(rows)].map((_, index) => (
            <div
                key={index}
                className='flex gap-4 py-5'>
                <Skeleton className='size-20 shrink-0 rounded-md sm:size-24' />
                <div className='flex flex-1 flex-col gap-2'>
                    <Skeleton className='h-5 w-48 max-w-full' />
                    <Skeleton className='h-4 w-64 max-w-full' />
                    <Skeleton className='h-3 w-40 max-w-full' />
                </div>
            </div>
        ))}
    </div>
)
