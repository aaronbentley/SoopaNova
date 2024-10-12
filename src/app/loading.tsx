import { Loader2 } from 'lucide-react'

const Loading = () => (
    <div className='flex-1 w-full container flex justify-center items-center'>
        <Loader2 className='size-8 animate-spin text-primary' />
    </div>
)

export default Loading
