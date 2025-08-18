import { ImageResponse } from 'next/og'

export const alt = process.env.APP_TITLE!

export const size = {
    width: 512,
    height: 512
}

export const contentType = 'image/svg+xml'

export const debug = process.env.NODE_ENV !== 'production'

const iconImage = async () => {
    return new ImageResponse(
        (
            <div tw='bg-transparent text-pink-500 flex flex-col items-center justify-center h-full w-full'>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 512 512'
                    id='mark'
                    width={420}
                    height={420}
                    fill='currentColor'>
                    <path d='M269.2,405.17c39.6,0,66-15.84,65.34-44.88-.66-30.36-26.4-46.2-91.74-62.04-110.89-25.74-174.25-67.98-174.25-143.89,0-87.13,73.93-141.91,186.13-141.91s179.53,64.68,190.75,162.37l-114.85,4.62c-4.62-45.54-34.32-73.26-78.54-73.26-40.26,0-67.98,19.8-65.34,50.16,1.32,33.66,41.58,46.2,87.78,56.76,110.89,22.44,177.55,68.64,177.55,144.55,0,89.77-78.54,141.91-185.47,141.91-118.15,0-199.99-63.36-206.59-163.69l115.51-5.94c7.92,46.2,39.6,75.24,93.73,75.24Z' />
                </svg>
            </div>
        ),
        {
            ...size,
            debug
        }
    )
}

export default iconImage
