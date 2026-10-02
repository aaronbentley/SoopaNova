'use client'

import { oauthProviders } from '@/assets/data/oauth-providers'
import CodeInput from '@/components/code-input'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useAuthNavigate } from '@/hooks/use-auth-navigate'
import { clerkErrorMessage, hasClerkErrorCode } from '@/lib/clerk'
import { useAuth, useClerk, useSignIn, useSignUp } from '@clerk/nextjs'
import type { OAuthStrategy } from '@clerk/nextjs/types'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'

type Flow = 'sign-in' | 'sign-up'

const copy = {
    'sign-in': {
        title: 'Sign in',
        description: 'Welcome back! Sign in to carry on printing.',
        switchText: 'No account yet?',
        switchLabel: 'Sign up',
        switchHref: '/sign-up/'
    },
    'sign-up': {
        title: 'Create your account',
        description: 'Turn your gaming screenshots into prints.',
        switchText: 'Already have an account?',
        switchLabel: 'Sign in',
        switchHref: '/sign-in/'
    }
}

/**
 * Sign-in/up with Clerk's custom flow hooks: OAuth, or a 6-digit code sent to
 * an email address. The email flow is forgiving: an unknown email on sign-in
 * becomes a sign-up, and a known email on sign-up becomes a sign-in.
 */
const AuthCard = ({ mode }: { mode: Flow }) => {
    const router = useRouter()
    const clerk = useClerk()
    const { isLoaded, isSignedIn } = useAuth()
    const { signIn } = useSignIn()
    const { signUp } = useSignUp()

    /**
     * Which Clerk flow the email code belongs to (can differ from the page)
     */
    const [flow, setFlow] = useState<Flow>(mode)
    const [step, setStep] = useState<'start' | 'code'>('start')
    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [pending, setPending] = useState(false)

    const navigate = useAuthNavigate(flow)

    /**
     * Arrived already signed in: carry on to the after sign-in page. (After
     * a code is verified, finalize() navigates instead.)
     */
    useEffect(() => {
        if (isSignedIn && step === 'start') {
            router.replace(clerk.buildAfterSignInUrl())
        }
    }, [clerk, isSignedIn, router, step])

    /**
     * Run an action with the form disabled and errors cleared
     */
    const run = async (action: () => Promise<void>) => {
        setPending(true)
        setError(null)

        try {
            await action()
        } catch (caught) {
            setError(clerkErrorMessage(caught))
        } finally {
            setPending(false)
        }
    }

    /**
     * Start a sign-in or sign-up with the provider. Clerk sends the browser
     * on to /sso-callback/, which handles account-exists/new-account transfers.
     */
    const continueWith = (strategy: OAuthStrategy) =>
        run(async () => {
            const params = {
                strategy,
                redirectUrl:
                    mode === 'sign-up'
                        ? clerk.buildAfterSignUpUrl()
                        : clerk.buildAfterSignInUrl(),
                redirectCallbackUrl: '/sso-callback/'
            }

            const { error } =
                mode === 'sign-up'
                    ? await signUp.sso(params)
                    : await signIn.sso(params)

            if (error) setError(clerkErrorMessage(error))
        })

    const sendSignInCode = async () =>
        (await signIn.emailCode.sendCode({ emailAddress: email })).error

    const sendSignUpCode = async () => {
        const { error } = await signUp.create({ emailAddress: email })
        if (error) return error

        return (await signUp.verifications.sendEmailCode()).error
    }

    /**
     * Send a code, switching between sign-in and sign-up if the email says
     * the visitor is on the wrong page
     */
    const sendCode = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        return run(async () => {
            let target = mode
            let error =
                target === 'sign-in'
                    ? await sendSignInCode()
                    : await sendSignUpCode()

            if (
                target === 'sign-in' &&
                hasClerkErrorCode(error, 'form_identifier_not_found')
            ) {
                target = 'sign-up'
                error = await sendSignUpCode()
            } else if (
                target === 'sign-up' &&
                hasClerkErrorCode(error, 'form_identifier_exists')
            ) {
                target = 'sign-in'
                error = await sendSignInCode()
            }

            if (error) {
                setError(clerkErrorMessage(error))
                return
            }

            setFlow(target)
            setStep('code')
        })
    }

    /**
     * Check the code and, once complete, activate the session
     */
    const verifyCode = (value: string) =>
        run(async () => {
            const { error } =
                flow === 'sign-in'
                    ? await signIn.emailCode.verifyCode({ code: value })
                    : await signUp.verifications.verifyEmailCode({
                          code: value
                      })

            if (error) {
                setError(clerkErrorMessage(error))
                setCode('')
                return
            }

            const resource = flow === 'sign-in' ? signIn : signUp

            if (resource.status !== 'complete') {
                setError("We couldn't finish signing you in. Please try again.")
                return
            }

            await resource.finalize({ navigate })
        })

    const resendCode = () =>
        run(async () => {
            const { error } =
                flow === 'sign-in'
                    ? await signIn.emailCode.sendCode()
                    : await signUp.verifications.sendEmailCode()

            if (error) setError(clerkErrorMessage(error))
        })

    const changeEmail = () =>
        run(async () => {
            await (flow === 'sign-in' ? signIn : signUp).reset()
            setFlow(mode)
            setCode('')
            setStep('start')
        })

    const disabled = !isLoaded || pending
    const text = copy[mode]

    return (
        <Card className='w-full max-w-sm'>
            <CardHeader className='text-center'>
                <CardTitle className='text-xl'>
                    {step === 'code' ? 'Check your email' : text.title}
                </CardTitle>
                <CardDescription className='text-pretty'>
                    {step === 'code' ? (
                        <>
                            We sent a 6-digit code to{' '}
                            <span className='text-foreground'>{email}</span>
                        </>
                    ) : (
                        text.description
                    )}
                </CardDescription>
            </CardHeader>

            <CardContent className='flex flex-col gap-6'>
                {step === 'start' ? (
                    <>
                        <div className='grid gap-2'>
                            {oauthProviders.map((provider) => (
                                <Button
                                    key={provider.strategy}
                                    variant='outline'
                                    className='w-full'
                                    disabled={disabled}
                                    onClick={() =>
                                        continueWith(provider.strategy)
                                    }>
                                    <Image
                                        src={provider.iconUrl}
                                        alt=''
                                        width={16}
                                        height={16}
                                        unoptimized
                                    />
                                    Continue with {provider.label}
                                </Button>
                            ))}
                        </div>

                        <div className='flex items-center gap-3'>
                            <Separator className='flex-1' />
                            <span className='eyebrow text-muted-foreground'>
                                or
                            </span>
                            <Separator className='flex-1' />
                        </div>

                        <form
                            onSubmit={sendCode}
                            className='grid gap-3'>
                            <div className='grid gap-2'>
                                <Label htmlFor='email'>Email address</Label>
                                <Input
                                    id='email'
                                    type='email'
                                    autoComplete='email'
                                    required
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    aria-invalid={error ? true : undefined}
                                />
                            </div>
                            {error && (
                                <p className='text-sm text-destructive'>
                                    {error}
                                </p>
                            )}
                            <Button
                                type='submit'
                                className='w-full'
                                disabled={disabled}>
                                {pending && (
                                    <Loader2 className='animate-spin' />
                                )}
                                Continue
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className='flex flex-col items-center gap-4'>
                        <CodeInput
                            value={code}
                            onChange={setCode}
                            onComplete={verifyCode}
                            disabled={disabled}
                        />
                        {error && (
                            <p className='text-sm text-destructive text-center'>
                                {error}
                            </p>
                        )}
                        {pending && (
                            <Loader2 className='size-5 animate-spin text-muted-foreground' />
                        )}
                        <div className='flex flex-wrap justify-center gap-x-1 text-sm'>
                            <Button
                                variant='link'
                                size='sm'
                                disabled={disabled}
                                onClick={resendCode}>
                                Resend code
                            </Button>
                            <Button
                                variant='link'
                                size='sm'
                                disabled={disabled}
                                onClick={changeEmail}>
                                Use a different email
                            </Button>
                        </div>
                    </div>
                )}

                {/* Clerk's bot protection (invisible CAPTCHA) mounts here */}
                <div id='clerk-captcha' />
            </CardContent>

            <CardFooter className='flex-col gap-2 border-t text-center text-sm text-muted-foreground'>
                {step === 'start' && (
                    <p>
                        {text.switchText}{' '}
                        <Link
                            href={text.switchHref}
                            className='font-medium text-foreground underline-offset-4 hover:underline'>
                            {text.switchLabel}
                        </Link>
                    </p>
                )}
                <p className='text-xs text-pretty'>
                    By continuing you agree to our{' '}
                    <Link
                        href='/terms/'
                        className='underline underline-offset-4 hover:text-foreground'>
                        Terms
                    </Link>{' '}
                    and{' '}
                    <Link
                        href='/privacy/'
                        className='underline underline-offset-4 hover:text-foreground'>
                        Privacy Policy
                    </Link>
                    .
                </p>
            </CardFooter>
        </Card>
    )
}

export default AuthCard
