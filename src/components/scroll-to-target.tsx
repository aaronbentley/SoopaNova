'use client'

const ScrollToTarget = ({
    target,
    children
}: {
    target: string
    children: React.ReactNode
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

    return <div onClick={handleClick}>{children}</div>
}

export default ScrollToTarget
