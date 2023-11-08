import { SignIn as ClerkSignIn } from '@clerk/nextjs'

const SignIn = () => (
    <div className='container flex justify-center py-24'>
        <ClerkSignIn />
    </div>
)

export default SignIn
