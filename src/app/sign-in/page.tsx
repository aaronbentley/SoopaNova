import AuthCard from '@/components/auth-card'
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
        <AuthCard mode='sign-in' />
    </div>
)

export default SignIn
