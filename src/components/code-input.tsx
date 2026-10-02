'use client'

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot
} from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'
import { REGEXP_ONLY_DIGITS } from 'input-otp'

/**
 * 6-digit email verification code. onComplete fires once all digits are in.
 */
const CodeInput = ({
    id = 'code',
    value,
    onChange,
    onComplete,
    disabled
}: {
    id?: string
    value: string
    onChange: (value: string) => void
    onComplete: (value: string) => void
    disabled?: boolean
}) => (
    <>
        <Label
            htmlFor={id}
            className='sr-only'>
            Verification code
        </Label>
        <InputOTP
            id={id}
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            autoComplete='one-time-code'
            autoFocus
            value={value}
            onChange={onChange}
            onComplete={onComplete}
            disabled={disabled}>
            <InputOTPGroup>
                {Array.from({ length: 6 }, (_, index) => (
                    <InputOTPSlot
                        key={index}
                        index={index}
                    />
                ))}
            </InputOTPGroup>
        </InputOTP>
    </>
)

export default CodeInput
