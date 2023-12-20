import { Loader2 } from 'lucide-react'

const Loading = () => (
    <div className='flex-1 w-full container flex justify-center items-center'>
        <Loader2 className='size-8 animate-spin text-pink-500' />
    </div>
)

export default Loading
