// @ts-nocheck
import { ProductEdge, ProductFrame, ProductType } from '@/types'
import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Tailwind
} from '@react-email/components'

interface OrderEmailProps {
    orderId?: string | null
    productType?: ProductType
    productWidth?: number
    productHeight?: number
    productFrame?: ProductFrame
    productEdge?: ProductEdge
    productPrice?: number
    orderMarkupRate?: number
    orderMarkupProfit?: number
}

const baseUrl = process.env.APP_URL ? `https://${process.env.APP_URL}` : ''

const OrderEmail = ({
    orderId = 'orderId',
    productType = 'PO',
    productWidth = 0,
    productHeight = 0,
    productFrame = '075DW',
    productEdge = 'NOMA',
    productPrice = 0,
    orderMarkupRate = 0,
    orderMarkupProfit = 0
}: OrderEmailProps) => {
    const previewText = `SoopaNova Order #${orderId}`
    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className='bg-neutral-50 my-auto mx-auto font-sans'>
                    <Container className='border border-solid border-neutral-200 rounded my-[40px] mx-auto p-[20px] w-[465px]'>
                        <Section className='mt-[32px]'>
                            <Img
                                src={`${baseUrl}/logo.png`}
                                width='250'
                                height='46'
                                alt={process.env.APP_TITLE!}
                                className='my-0 mx-auto'
                            />
                        </Section>
                        <Heading className='text-pink-500 text-[24px] font-bold p-0 my-[30px] mx-0'>
                            New Order Received
                        </Heading>
                        <Hr className='border border-solid border-neutral-200 my-[26px] mx-0 w-full' />

                        <table>
                            <tr>
                                <td className='text-neutral-500 font-bold text-[16px] p-0 my-0 mx-0'>
                                    Order ID:
                                </td>
                                <td className='text-neutral-500 text-[16px] p-0 my-0 mx-0'>
                                    {orderId}
                                </td>
                            </tr>
                            <tr>
                                <td className='text-neutral-500 font-bold text-[16px] p-0 my-0 mx-0'>
                                    Product:
                                </td>
                                <td className='text-neutral-500 text-[16px] p-0 my-0 mx-0'>
                                    {productType}
                                </td>
                            </tr>
                            <tr>
                                <td className='text-neutral-500 font-bold text-[16px] p-0 my-0 mx-0'>
                                    Size:
                                </td>
                                <td className='text-neutral-500 text-[16px] p-0 my-0 mx-0'>
                                    {productWidth} x {productHeight}
                                </td>
                            </tr>
                            <tr>
                                <td className='text-neutral-500 font-bold text-[16px] p-0 my-0 mx-0'>
                                    Frame:
                                </td>
                                <td className='text-neutral-500 text-[16px] p-0 my-0 mx-0'>
                                    {productFrame}
                                </td>
                            </tr>
                            <tr>
                                <td className='text-neutral-500 font-bold text-[16px] p-0 my-0 mx-0'>
                                    Edge:
                                </td>
                                <td className='text-neutral-500 text-[16px] p-0 my-0 mx-0'>
                                    {productEdge}
                                </td>
                            </tr>
                            <tr>
                                <td className='text-neutral-500 font-bold text-[16px] p-0 my-0 mx-0'>
                                    Price:
                                </td>
                                <td className='text-neutral-500 text-[16px] p-0 my-0 mx-0'>
                                    ${productPrice}
                                </td>
                            </tr>
                            <tr>
                                <td className='text-neutral-500 font-bold text-[16px] p-0 my-0 mx-0'>
                                    Markup Rate:
                                </td>
                                <td className='text-neutral-500 text-[16px] p-0 my-0 mx-0'>
                                    {orderMarkupRate}%
                                </td>
                            </tr>
                            <tr>
                                <td className='text-neutral-500 font-bold text-[16px] p-0 my-0 mx-0'>
                                    Markup Profit:
                                </td>
                                <td className='text-neutral-500 text-[16px] p-0 my-0 mx-0'>
                                    ${orderMarkupProfit}
                                </td>
                            </tr>
                        </table>

                        <Hr className='border border-solid border-neutral-200 my-[26px] mx-0 w-full' />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default OrderEmail
