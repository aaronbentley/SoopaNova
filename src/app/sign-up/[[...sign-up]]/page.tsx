import { SignUp as ClerkSignUp } from '@clerk/nextjs'
import { Metadata } from 'next'

/**
 * Prerender the base /sign-up/ page. Clerk's sub-steps (e.g. /sign-up/factor-one)
 * are rendered on demand and cached.
 */
export const generateStaticParams = () => [{ 'sign-up': [] }]

export const metadata: Metadata = {
    title: 'Sign up',
    description: `Sign up to ${process.env.APP_TITLE!}.`,
    alternates: {
        canonical: '/sign-up/'
    }
}

const SignUp = () => (
    <div className='wrapper flex justify-center py-16 md:py-24'>
        <ClerkSignUp />
    </div>
)

export default SignUp
