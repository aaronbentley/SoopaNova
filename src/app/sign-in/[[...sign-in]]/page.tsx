import { SignIn as ClerkSignIn } from '@clerk/nextjs'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sign in',
    description: `Sign in to ${process.env.APP_TITLE!}.`
}

const SignIn = () => (
    <div className='container flex justify-center py-24'>
        <ClerkSignIn />
    </div>
)

export default SignIn
