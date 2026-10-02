import AuthCard from '@/components/auth-card'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sign up',
    description: `Sign up to ${process.env.APP_TITLE!}.`,
    alternates: {
        canonical: '/sign-up/'
    }
}

const SignUp = () => (
    <div className='wrapper flex justify-center py-16 md:py-24'>
        <AuthCard mode='sign-up' />
    </div>
)

export default SignUp
