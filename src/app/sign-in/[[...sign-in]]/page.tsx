import { SignIn as ClerkSignIn } from '@clerk/nextjs'
import { Metadata } from 'next'

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
