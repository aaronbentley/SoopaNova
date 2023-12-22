import { SignUp as ClerkSignUp } from '@clerk/nextjs'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sign up',
    description: `Sign up to ${process.env.APP_TITLE!}.`,
    alternates: {
        canonical: '/sign-up/'
    }
}

const SignUp = () => (
    <div className='container flex justify-center py-24'>
        <ClerkSignUp />
    </div>
)

export default SignUp
