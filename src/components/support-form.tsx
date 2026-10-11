'use client'

import { sendSupportRequestAction } from '@/actions/public/support'
import { supportTopics, type SupportTopicId } from '@/assets/data/support'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
    maxMessageLength,
    asksOrderRef,
    supportRequestSchema,
    type SupportRequest
} from '@/lib/support-schema'
import { useUser } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Info, Loader2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState, useTransition } from 'react'
import {
    Controller,
    useForm,
    useWatch,
    type UseFormSetValue
} from 'react-hook-form'

const topicItems = supportTopics.map((topic) => ({
    label: topic.label,
    value: topic.id
}))

const isTopic = (value: string | null): value is SupportTopicId =>
    supportTopics.some((topic) => topic.id === value)

const emptyValues: Partial<SupportRequest> = {
    name: '',
    email: '',
    orderRef: '',
    message: ''
}

/**
 * Fill in the topic and order ref from links like
 * /support/?topic=order&order=… (the orders page's "Get help"). Kept in its
 * own Suspense boundary so the rest of the form stays in the static page.
 */
const PrefillFromUrl = ({
    setValue
}: {
    setValue: UseFormSetValue<SupportRequest>
}) => {
    const searchParams = useSearchParams()

    useEffect(() => {
        const topic = searchParams.get('topic')
        const order = searchParams.get('order')

        if (isTopic(topic)) setValue('topic', topic)
        if (order) setValue('orderRef', order.slice(0, 64))
    }, [searchParams, setValue])

    return null
}

/**
 * The support form: emails the site owner with reply-to the sender (no
 * auto-reply). Anyone can use it; signed-in customers get their name and
 * email filled in.
 */
const SupportForm = () => {
    const { user } = useUser()
    const [pending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [sentTo, setSentTo] = useState<string | null>(null)

    const form = useForm<SupportRequest>({
        resolver: zodResolver(supportRequestSchema),
        defaultValues: emptyValues
    })
    const { control, handleSubmit, getValues, setValue, reset } = form

    const topicId = useWatch({ control, name: 'topic' })
    const message = useWatch({ control, name: 'message' }) ?? ''
    const topic = supportTopics.find((entry) => entry.id === topicId)

    /**
     * Fill in a signed-in customer's name and email, unless they've already
     * typed something
     */
    useEffect(() => {
        if (!user) return

        if (!getValues('name') && user.fullName) {
            setValue('name', user.fullName)
        }

        const email = user.primaryEmailAddress?.emailAddress

        if (!getValues('email') && email) setValue('email', email)
    }, [user, getValues, setValue])

    const onSubmit = (values: SupportRequest) => {
        setError(null)

        startTransition(async () => {
            const result = await sendSupportRequestAction({
                ...values,
                orderRef: asksOrderRef(values.topic)
                    ? values.orderRef
                    : undefined
            })

            if ('sent' in result) {
                setSentTo(values.email)
            } else {
                setError(result.message)
            }
        })
    }

    if (sentTo) {
        return (
            <div className='flex w-full flex-col items-start gap-5'>
                <Alert>
                    <CheckCircle2 />
                    <AlertTitle>Message sent</AlertTitle>
                    <AlertDescription>
                        Thanks. We&apos;ll reply to {sentTo} by email.
                    </AlertDescription>
                </Alert>
                <Button
                    variant='outline'
                    onClick={() => {
                        reset(emptyValues)
                        setSentTo(null)
                    }}>
                    Send another message
                </Button>
            </div>
        )
    }

    return (
        <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className='grid w-full gap-6'>
            <Suspense fallback={null}>
                <PrefillFromUrl setValue={setValue} />
            </Suspense>

            <Controller
                control={control}
                name='topic'
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                            What&apos;s it about?
                        </FieldLabel>
                        <Select
                            items={topicItems}
                            value={field.value ?? null}
                            onValueChange={(value) =>
                                value && field.onChange(value)
                            }
                            disabled={pending}>
                            <SelectTrigger
                                id={field.name}
                                ref={field.ref}
                                aria-invalid={fieldState.invalid}
                                className='w-full'>
                                <SelectValue placeholder='Choose a topic' />
                            </SelectTrigger>
                            <SelectContent>
                                {topicItems.map((item) => (
                                    <SelectItem
                                        key={item.value}
                                        value={item.value}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FieldError errors={[fieldState.error]} />
                    </Field>
                )}
            />

            {topic && 'guidance' in topic && (
                <Alert>
                    <Info />
                    <AlertDescription>{topic.guidance}</AlertDescription>
                </Alert>
            )}

            <div className='grid gap-6 sm:grid-cols-2'>
                <Controller
                    control={control}
                    name='name'
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                            <Input
                                {...field}
                                id={field.name}
                                autoComplete='name'
                                aria-invalid={fieldState.invalid}
                                disabled={pending}
                            />
                            <FieldError errors={[fieldState.error]} />
                        </Field>
                    )}
                />
                <Controller
                    control={control}
                    name='email'
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                            <Input
                                {...field}
                                id={field.name}
                                type='email'
                                autoComplete='email'
                                aria-invalid={fieldState.invalid}
                                disabled={pending}
                            />
                            <FieldError errors={[fieldState.error]} />
                        </Field>
                    )}
                />
            </div>

            {asksOrderRef(topicId) && (
                <Controller
                    control={control}
                    name='orderRef'
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                                Order ref
                            </FieldLabel>
                            <Input
                                {...field}
                                value={field.value ?? ''}
                                id={field.name}
                                autoComplete='off'
                                aria-invalid={fieldState.invalid}
                                disabled={pending}
                                className='font-mono'
                            />
                            <FieldDescription>
                                It&apos;s on your orders page and your order
                                confirmation email.
                            </FieldDescription>
                            <FieldError errors={[fieldState.error]} />
                        </Field>
                    )}
                />
            )}

            <Controller
                control={control}
                name='message'
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Message</FieldLabel>
                        <Textarea
                            {...field}
                            id={field.name}
                            rows={6}
                            maxLength={maxMessageLength}
                            aria-invalid={fieldState.invalid}
                            disabled={pending}
                            className='min-h-36'
                        />
                        <FieldDescription className='text-right font-mono text-xs'>
                            {message.length.toLocaleString('en-GB')} /{' '}
                            {maxMessageLength.toLocaleString('en-GB')}
                        </FieldDescription>
                        <FieldError errors={[fieldState.error]} />
                    </Field>
                )}
            />

            {error && (
                <p
                    role='alert'
                    className='text-sm text-destructive'>
                    {error}
                </p>
            )}

            <div>
                <Button
                    type='submit'
                    disabled={pending}>
                    {pending && <Loader2 className='animate-spin' />}
                    Send message
                </Button>
            </div>
        </form>
    )
}

export default SupportForm
