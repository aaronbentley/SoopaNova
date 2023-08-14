import { formatBytes, getDateFromUnixTimestamp } from '@/lib/utils'
import { FileWithPreview } from '@/types'
import { Table, TableBody, TableCell, TableHead, TableRow } from './ui/table'

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

    const formatImageDimension = (dimension: number) => `${dimension} px`

    return (
        <Table>
            <TableBody>
                <TableRow className='border-neutral-400/25'>
                    <TableHead>Width</TableHead>
                    <TableCell>
                        {imageMeta?.width &&
                            formatImageDimension(imageMeta?.width)}
                    </TableCell>
                </TableRow>
                <TableRow className='border-neutral-400/25'>
                    <TableHead>Height</TableHead>
                    <TableCell>
                        {imageMeta?.height &&
                            formatImageDimension(imageMeta?.height)}
                    </TableCell>
                </TableRow>
                <TableRow className='border-neutral-400/25'>
                    <TableHead>Aspect ratio</TableHead>
                    <TableCell>{imageMeta?.aspectRatio}</TableCell>
                </TableRow>
                <TableRow className='border-neutral-400/25'>
                    <TableHead>Size</TableHead>
                    <TableCell>{formatBytes(file.size)}</TableCell>
                </TableRow>
                <TableRow className='border-neutral-400/25'>
                    <TableHead>Format</TableHead>
                    <TableCell>{file.type}</TableCell>
                </TableRow>
                <TableRow className='border-neutral-400/25'>
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
