import SsoCallback from '@/components/sso-callback'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Signing in',
    robots: {
        index: false
    }
}

const SsoCallbackPage = () => (
    <div className='wrapper flex justify-center py-16 md:py-24'>
        <SsoCallback />
    </div>
)

export default SsoCallbackPage
