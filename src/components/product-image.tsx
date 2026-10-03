import { productTypes, type ProductTypeId } from '@/assets/data/pricing'
import { productImages } from '@/assets/data/product-images'
import { cn } from '@/lib/utils'
import Image from 'next/image'

/**
 * A product's photo in a 4:3 frame, or a placeholder (the grid backdrop and
 * the brand square) until it has one
 */
const ProductImage = ({
    productType,
    sizes,
    eager = false,
    className
}: {
    productType: ProductTypeId
    /** The image's `sizes`, for the widths it's shown at */
    sizes: string
    /** Load straight away, when it's above the fold */
    eager?: boolean
    className?: string
}) => {
    const image = productImages[productType]

    return (
        <div
            className={cn(
                ['relative', 'aspect-4/3', 'overflow-hidden'],
                className
            )}>
            {image ? (
                <Image
                    src={image}
                    alt={productTypes[productType].name}
                    placeholder='blur'
                    fill
                    sizes={sizes}
                    loading={eager ? 'eager' : undefined}
                    className='object-cover'
                />
            ) : (
                <div className='flex size-full items-center justify-center bg-card'>
                    <div
                        aria-hidden='true'
                        className='absolute inset-0 bg-grid mask-fade-bottom'
                    />
                    <span
                        aria-hidden='true'
                        className='relative size-3 bg-primary shadow-[0_0_24px_var(--primary)]'
                    />
                </div>
            )}
        </div>
    )
}

export default ProductImage
