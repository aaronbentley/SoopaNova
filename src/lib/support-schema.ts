import { supportTopics, type SupportTopicId } from '@/assets/data/support'
import { z } from 'zod'

/**
 * Validation for the support form (react-hook-form) and its Server Action,
 * so the browser and server check the same rules
 */

const topicIds = supportTopics.map((topic) => topic.id) as [
    SupportTopicId,
    ...SupportTopicId[]
]

/**
 * Longest message: Resend rejects a template variable over 2,000 characters
 */
export const maxMessageLength = 2000

/**
 * Whether a topic needs the order ref (questions about an order, problems
 * with a print)
 */
export const asksOrderRef = (topic: SupportTopicId | undefined) =>
    supportTopics.some((entry) => entry.id === topic && entry.askOrderRef)

const supportRequestShape = z.object({
    topic: z.enum(topicIds, { message: 'Please choose what it’s about.' }),
    name: z
        .string()
        .trim()
        .min(1, 'Please tell us your name.')
        .max(100, 'That name is a bit long. Please shorten it.'),
    email: z.email('Please enter a valid email address.'),
    orderRef: z
        .string()
        .trim()
        .max(64, 'That doesn’t look like an order ref.')
        .optional(),
    message: z
        .string()
        .trim()
        .min(10, 'Please tell us a little more.')
        .max(
            maxMessageLength,
            `Please keep it under ${maxMessageLength.toLocaleString('en-GB')} characters.`
        )
})

export const supportRequestSchema = supportRequestShape.superRefine(
    (values, context) => {
        if (asksOrderRef(values.topic) && !values.orderRef) {
            context.addIssue({
                code: 'custom',
                path: ['orderRef'],
                message: 'Please add your order ref.'
            })
        }
    }
)

export type SupportRequest = z.infer<typeof supportRequestSchema>
