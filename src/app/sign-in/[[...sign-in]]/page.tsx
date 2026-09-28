import { SignIn as ClerkSignIn } from '@clerk/nextjs'
import { Metadata } from 'next'

/**
 * Prerender the base /sign-in/ page. Clerk's sub-steps (e.g. /sign-in/factor-one)
 * are rendered on demand and cached.
 */
export const generateStaticParams = () => [{ 'sign-in': [] }]

export const metadata: Metadata = {
    title: 'Sign in',
    description: `Sign in to ${process.env.APP_TITLE!}.`,
    alternates: {
        canonical: '/sign-in/'
    }
}

const SignIn = () => (
    <div className='wrapper flex justify-center py-16 md:py-24'>
        <ClerkSignIn />
    </div>
)

export default SignIn
