'use client'

import ImageMetadata from '@/components/image-metadata'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover'
import type { ImageMeta } from '@/types'
import { Info } from 'lucide-react'

/**
 * Info button with the screenshot's details (dimensions, size, format)
 */
const ScreenshotDetails = ({ file, meta }: { file: File; meta: ImageMeta }) => (
    <Popover>
        <PopoverTrigger
            render={
                <Button
                    variant='secondary'
                    size='icon'
                    aria-label='Screenshot details'
                    className='absolute top-3 right-3 z-20 size-8 rounded-full bg-background/80 backdrop-blur-sm'
                />
            }>
            <Info />
        </PopoverTrigger>
        <PopoverContent
            align='end'
            className='w-80'>
            <p className='eyebrow mb-2 text-muted-foreground'>
                Screenshot details
            </p>
            <ImageMetadata
                file={file}
                imageMeta={meta}
            />
        </PopoverContent>
    </Popover>
)

export default ScreenshotDetails
