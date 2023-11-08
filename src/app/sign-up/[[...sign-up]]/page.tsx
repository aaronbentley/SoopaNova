import { SignUp as ClerkSignUp } from '@clerk/nextjs'

const SignUp = () => (
    <div className='container flex justify-center py-24'>
        <ClerkSignUp />
    </div>
)

export default SignUp
