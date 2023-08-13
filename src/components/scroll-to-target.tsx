'use client'

import { cn } from '@/lib/utils'

const ScrollToTarget = ({
    target,
    children,
    className
}: {
    target: string
    children: React.ReactNode
    className?: string
}) => {
    const handleClick = () => {
        const element = document.getElementById(target)

        if (!element) {
            return
        }

        element.scrollIntoView({
            behavior: 'smooth'
        })
    }

    return (
        <div
            className={cn([''], className)}
            onClick={handleClick}>
            {children}
        </div>
    )
}

export default ScrollToTarget
