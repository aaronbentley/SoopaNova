import { ImageResponse } from 'next/server'

export const runtime = 'edge'

export const alt = process.env.APP_TITLE!

export const size = {
    width: 512,
    height: 512
}

export const contentType = 'image/svg+xml'

export const debug = process.env.NODE_ENV !== 'production'

/**
 * Nunito Sans custom Font
 */
const nunitoSans = fetch(
    new URL('./fonts/nunito-sans-extra-bold.ttf', process.env.APP_URL!)
).then((res) => res.arrayBuffer())

const iconImage = async () => {
    return new ImageResponse(
        (
            <div tw='bg-transparent flex flex-col items-center justify-center h-full w-full'>
                <h1 tw='text-center text-[32rem] mt-[-3rem] -ml-4 text-neutral-900 tracking-tighter leading-none text-pink-500'>
                    S
                </h1>
            </div>
        ),
        {
            ...size,
            fonts: [
                {
                    name: 'Nunito Sans',
                    data: await nunitoSans,
                    style: 'normal',
                    weight: 800
                }
            ],
            debug
        }
    )
}

export default iconImage
