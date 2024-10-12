import { cn } from '@/lib/utils'

type IconProps = {
    className?: string
}

export const Twitter = ({ className }: IconProps) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
        className={cn(['size-4', className])}>
        <path d='M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' />
    </svg>
)

export const Instagram = ({ className }: IconProps) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
        className={cn(['size-4', className])}>
        <rect
            width='20'
            height='20'
            x='2'
            y='2'
            rx='5'
            ry='5'
        />
        <path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' />
        <line
            x1='17.5'
            x2='17.51'
            y1='6.5'
            y2='6.5'
        />
    </svg>
)

export const Facebook = ({ className }: IconProps) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
        className={cn(['size-4', className])}>
        <path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' />
    </svg>
)

export const Threads = ({ className }: IconProps) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='currentColor'
        stroke='none'
        className={cn(['size-4', className])}>
        <path d='M13.14,12.3c-.23,0-.47,0-.71.02-1.76.1-2.86.91-2.79,2.05.06,1.2,1.39,1.76,2.67,1.69,1.17-.06,2.7-.52,2.96-3.56-.7-.15-1.41-.22-2.12-.21ZM12.18,23.5h0c-3.43-.02-6.07-1.15-7.84-3.36-1.58-1.97-2.39-4.7-2.42-8.13v-.02c.03-3.43.84-6.16,2.42-8.13C6.1,1.65,8.74.52,12.17.5h.01c2.63.02,4.83.69,6.54,2.01,1.61,1.24,2.74,3,3.36,5.24l-1.95.55c-1.06-3.8-3.74-5.73-7.96-5.76-2.79.02-4.9.9-6.27,2.6-1.28,1.6-1.94,3.91-1.97,6.87.03,2.96.69,5.27,1.97,6.87,1.37,1.71,3.48,2.59,6.27,2.6,2.51-.02,4.18-.6,5.56-1.96,1.58-1.55,1.55-3.44,1.04-4.6-.3-.68-.84-1.25-1.57-1.68-.18,1.3-.6,2.34-1.23,3.14-.85,1.06-2.05,1.63-3.57,1.72-1.15.06-2.26-.21-3.12-.77-1.02-.66-1.61-1.67-1.68-2.84-.06-1.14.39-2.19,1.27-2.95.84-.73,2.03-1.16,3.43-1.24.97-.06,1.94-.01,2.89.14-.12-.71-.36-1.28-.72-1.68-.49-.56-1.25-.85-2.26-.85h-.03c-.81,0-1.91.22-2.61,1.26l-1.68-1.13c.94-1.39,2.46-2.16,4.29-2.16h.04c3.06.02,4.88,1.89,5.07,5.16.1.04.21.09.31.14,1.43.67,2.47,1.69,3.02,2.94.76,1.74.83,4.59-1.48,6.86-1.77,1.73-3.92,2.52-6.97,2.54h0Z' />
    </svg>
)
