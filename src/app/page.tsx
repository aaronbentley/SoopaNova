import { Button } from '@/components/ui/button'
import { ChevronRight, Loader2, Mail } from 'lucide-react'

const Home = () => {
    return (
        <main className='flex min-h-screen flex-col items-center justify-between p-24'>
            <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
                Taxing Laughter: The Joke Tax Chronicles
            </h1>

            <Button>Button</Button>
            <Button variant='secondary'>Secondary</Button>
            <Button variant='destructive'>Destructive</Button>
            <Button variant='outline'>Outline</Button>
            <Button variant='ghost'>Ghost</Button>
            <Button variant='link'>Link</Button>
            <Button
                variant='outline'
                size='icon'>
                <ChevronRight className='h-4 w-4' />
            </Button>
            <Button>
                <Mail className='mr-2 h-4 w-4' /> Login with Email
            </Button>
            <Button disabled>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Please wait
            </Button>
        </main>
    )
}

export default Home
