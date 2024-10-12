import { Skeleton } from './ui/skeleton'

export const TableSkeleton = ({ rows = 4 }: { rows?: number }) => (
    <div className='w-full flex flex-col items-center gap-4 mb-8'>
        <Skeleton className='h-12 w-full rounded-none bg-muted' />
        {[...Array(rows)].map((_, index) => (
            <Skeleton
                key={index}
                className='h-12 w-full rounded-none'
            />
        ))}
    </div>
)
