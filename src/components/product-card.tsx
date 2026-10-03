import { productTypes, type ProductTypeId } from '@/assets/data/pricing'
import { productCopy, productPath } from '@/assets/data/products'
import ProductImage from '@/components/product-image'
import ProductPrice from '@/components/product-price'
import { getFromPrices } from '@/lib/pricing'
import Link from 'next/link'

/**
 * A product's card, linking to its page: photo, name, "from" price,
 * description and tags (homepage and /prints)
 */
const ProductCard = ({ productType }: { productType: ProductTypeId }) => (
    <Link
        href={productPath(productType)}
        className='group flex flex-col overflow-hidden rounded-xl border bg-background transition-colors duration-200 hover:border-primary'>
        <ProductImage
            productType={productType}
            sizes='(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 600px'
            className='border-b'
        />
        <div className='flex flex-1 flex-col gap-3 p-6'>
            <div className='flex items-baseline justify-between gap-3'>
                <h3 className='text-[22px] font-semibold tracking-[-0.03em]'>
                    {productTypes[productType].name}
                </h3>
                <span className='shrink-0 font-mono text-[13px] text-muted-foreground'>
                    <ProductPrice
                        prices={getFromPrices(productType)}
                        from
                    />
                </span>
            </div>
            <p className='text-[15px] leading-[1.55] text-muted-foreground text-pretty'>
                {productCopy[productType].description}
            </p>
            <div className='mt-auto flex flex-wrap gap-1.5 pt-3'>
                {productCopy[productType].tags.map((tag) => (
                    <span
                        key={tag}
                        className='rounded-sm border px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors duration-200 group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary group-focus-visible:border-primary/40 group-focus-visible:bg-primary/10 group-focus-visible:text-primary'>
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    </Link>
)

export default ProductCard
