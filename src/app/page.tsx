import { Hero, HeroDescription, HeroHeading } from '@/components/hero'
import { Badge } from '@/components/ui/badge'
import UploadFile from '@/components/upload-file'
import {
    Gamepad2,
    Image as LucideImage,
    Package,
    Printer,
    ShoppingBag
} from 'lucide-react'

const Home = () => {
    return (
        <>
            <Hero>
                <Badge
                    variant='secondary'
                    className='flex justify-around py-2 px-4'>
                    <Gamepad2 className='h-4' />
                    <ShoppingBag className='h-4' />
                    <Printer className='h-4' />
                    <Package className='h-4' />
                    <LucideImage className='h-4' />
                </Badge>
                {/* <HeroHeading>Print Your Gaming Moments</HeroHeading> */}
                {/* <HeroHeading>Preserve Your Gaming Moments</HeroHeading> */}
                <HeroHeading>From Pixels to Prints</HeroHeading>
                <HeroDescription>
                    SoopaNova is a slinky printing service for your gaming
                    screenshots
                </HeroDescription>
                <UploadFile className='mt-2' />
            </Hero>
        </>
    )
}

export default Home
