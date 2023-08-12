import { ImageResponse } from 'next/server'

export const runtime = 'edge'

export const alt = process.env.APP_TITLE!

export const size = {
    width: 2400,
    height: 1260
}

export const contentType = 'image/png'

export const debug = process.env.NODE_ENV !== 'production'

/**
 * Nunito Sans custom Font
 */
const nunitoSans = fetch(
    new URL('./fonts/nunito-sans-extra-bold.ttf', process.env.APP_URL!)
).then((res) => res.arrayBuffer())

const opengraphImage = async () => {
    return new ImageResponse(
        (
            <div tw='bg-neutral-50 flex flex-col items-center justify-center h-full w-full relative'>
                <div tw='flex flex-col items-center justify-center w-full text-neutral-900'>
                    <h1 tw='text-center text-[14.375rem] text-neutral-900 tracking-tighter'>
                        {process.env.APP_TITLE!}
                    </h1>

                    <h2 tw='text-center text-9xl text-neutral-500 tracking-tighter'>
                        From Pixels to Prints
                    </h2>
                </div>

                <div
                    tw='flex flex-col items-center justify-center absolute left-4 text-pink-500'
                    style={{
                        transform: 'skewY(-12deg)'
                    }}>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='420'
                        height='420'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        stroke-width='1.5'
                        stroke-linecap='round'
                        stroke-linejoin='round'>
                        <line
                            x1='6'
                            x2='10'
                            y1='11'
                            y2='11'
                        />
                        <line
                            x1='8'
                            x2='8'
                            y1='9'
                            y2='13'
                        />
                        <line
                            x1='15'
                            x2='15.01'
                            y1='12'
                            y2='12'
                        />
                        <line
                            x1='18'
                            x2='18.01'
                            y1='10'
                            y2='10'
                        />
                        <path d='M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z' />
                    </svg>
                </div>

                <div
                    tw='flex flex-col items-center justify-center absolute right-4 text-pink-500'
                    style={{
                        transform: 'skewY(12deg)'
                    }}>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='380'
                        height='380'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        stroke-width='1.5'
                        stroke-linecap='round'
                        stroke-linejoin='round'>
                        <rect
                            width='18'
                            height='18'
                            x='3'
                            y='3'
                            rx='2'
                            ry='2'
                        />
                        <circle
                            cx='9'
                            cy='9'
                            r='2'
                        />
                        <path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21' />
                    </svg>
                </div>
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

export default opengraphImage
