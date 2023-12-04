import { Skeleton } from './ui/skeleton'

export const TableSkeleton = ({ rows = 4 }: { rows?: number }) => (
    <div className='w-full flex flex-col items-center gap-4 mb-8'>
        <Skeleton className='h-12 w-full rounded-none bg-neutral-200 dark:bg-neutral-700' />
        {[...Array(rows)].map((_, index) => (
            <Skeleton
                key={index}
                className='h-12 w-full rounded-none'
            />
        ))}
    </div>
)
