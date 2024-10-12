import { cn, formatBytes, getDateFromUnixTimestamp } from '@/lib/utils'
import { FileWithPreview } from '@/types'
import { AlertTriangle } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableRow } from './ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

interface ImageMetadataProps {
    file: FileWithPreview | null
    imageMeta: {
        width: number
        height: number
        aspectRatio: string
    } | null
}

const ImageMetadata = ({ file, imageMeta }: ImageMetadataProps) => {
    /**
     * Bail if no file is provided
     */
    if (!file) return null

    /**
     * Define minimum image dimensions
     */
    const imageMinWidth = parseInt(process.env.NEXT_PUBLIC_MIN_IMAGE_WIDTH!)
    const imageMinHeight = parseInt(process.env.NEXT_PUBLIC_MIN_IMAGE_HEIGHT!)

    /**
     * Format image dimensions
     */
    const formatImageDimension = (dimension: number) => `${dimension} px`

    return (
        <Table>
            <TableBody>
                <TableRow>
                    <TableHead>Width</TableHead>
                    <TableCell
                        className={cn([
                            'flex',
                            'items-center',
                            'gap-2',
                            imageMeta?.width &&
                                imageMeta?.width < imageMinWidth && [
                                    'text-red-500',
                                    'dark:text-red-900'
                                ]
                        ])}>
                        {imageMeta?.width &&
                            formatImageDimension(imageMeta?.width)}

                        {imageMeta?.width &&
                            imageMeta?.width < imageMinWidth && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <AlertTriangle className='size-4' />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Screenshot too small - minimum width{' '}
                                        {imageMinWidth}px
                                    </TooltipContent>
                                </Tooltip>
                            )}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableHead>Height</TableHead>
                    <TableCell
                        className={cn([
                            'flex',
                            'items-center',
                            'gap-2',
                            imageMeta?.height &&
                                imageMeta?.height < imageMinHeight && [
                                    'text-red-500',
                                    'dark:text-red-900'
                                ]
                        ])}>
                        {imageMeta?.height &&
                            formatImageDimension(imageMeta?.height)}

                        {imageMeta?.height &&
                            imageMeta?.height < imageMinHeight && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <AlertTriangle className='size-4' />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Screenshot too small - minimum height{' '}
                                        {imageMinHeight}px
                                    </TooltipContent>
                                </Tooltip>
                            )}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableHead>Aspect ratio</TableHead>
                    <TableCell>{imageMeta?.aspectRatio}</TableCell>
                </TableRow>
                <TableRow>
                    <TableHead>Size</TableHead>
                    <TableCell>{formatBytes(file.size)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableHead>Format</TableHead>
                    <TableCell>{file.type}</TableCell>
                </TableRow>
                <TableRow>
                    <TableHead>Created at</TableHead>
                    <TableCell>
                        {getDateFromUnixTimestamp(file.lastModified)}
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}

export default ImageMetadata
