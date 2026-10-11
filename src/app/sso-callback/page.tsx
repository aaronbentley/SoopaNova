import SsoCallback from '@/components/sso-callback'
import { Metadata } from 'next'

/**
 * Fail the build if anything makes this page render per request
 */
export const ensureStatic = 'navigation'

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
