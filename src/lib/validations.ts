import * as z from 'zod'

export const FormSchema = z.object({
    username: z.string().min(2, {
        message: 'Username must be at least 2 characters.'
    })
})

export const productSchema = z.object({
    images: z
        .unknown()
        .refine((val) => {
            if (!Array.isArray(val)) return false
            if (val.some((file) => !(file instanceof File))) return false
            return true
        }, 'Must be an array of File')
        .optional()
        .nullable()
        .default(null)
})
