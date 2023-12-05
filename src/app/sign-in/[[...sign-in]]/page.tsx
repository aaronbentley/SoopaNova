import { SignIn as ClerkSignIn } from '@clerk/nextjs'
import { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => ({
    title: 'Sign in',
    description: `Sign in to ${process.env.APP_TITLE!}.`,
    openGraph: {
        url: '/sign-in/'
    }
})

const SignIn = () => (
    <div className='container flex justify-center py-24'>
        <ClerkSignIn />
    </div>
)

export default SignIn
