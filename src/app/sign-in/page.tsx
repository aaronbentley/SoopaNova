import AuthCard from '@/components/auth-card'
import { Metadata } from 'next'

/**
 * Fail the build if anything makes this page render per request
 */
export const ensureStatic = 'navigation'

export const metadata: Metadata = {
    title: 'Sign in',
    description: `Sign in to ${process.env.APP_TITLE!}.`,
    alternates: {
        canonical: '/sign-in/'
    }
}

const SignIn = () => (
    <div className='wrapper flex justify-center py-16 md:py-24'>
        <AuthCard mode='sign-in' />
    </div>
)

export default SignIn
