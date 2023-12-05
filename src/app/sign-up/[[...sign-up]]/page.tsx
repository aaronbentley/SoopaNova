import { SignUp as ClerkSignUp } from '@clerk/nextjs'
import { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => ({
    title: 'Sign up',
    description: `Sign up to ${process.env.APP_TITLE!}.`,
    openGraph: {
        url: '/sign-up/'
    }
})

const SignUp = () => (
    <div className='container flex justify-center py-24'>
        <ClerkSignUp />
    </div>
)

export default SignUp
