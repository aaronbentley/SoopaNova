/**
 * Support form topics, in the order the form lists them. `guidance` is shown
 * when the topic is chosen; `askOrderRef` adds the order ref field.
 */
export const supportTopics = [
    {
        id: 'order',
        label: 'A question about an order',
        guidance:
            'You can cancel an order yourself from your orders page for 90 minutes after you place it. Add your order ref (it’s on your orders page and your confirmation email) so we can find it.',
        askOrderRef: true
    },
    {
        id: 'problem',
        label: 'A problem with my print',
        guidance:
            'Let us know within 14 days of delivery. We’ll reply by email, and you can send us photos of the print (and the packaging, if it was damaged in the post) then.',
        askOrderRef: true
    },
    {
        id: 'account',
        label: 'My account or signing in',
        askOrderRef: false
    },
    {
        id: 'copyright',
        label: 'A copyright or trademark concern',
        guidance:
            'Tell us which work or mark it’s about and who owns it, how you’re connected to it (for example, the owner or acting for them), and which print or order it concerns, if you know. We’ll look into it and reply by email.',
        askOrderRef: false
    },
    {
        id: 'other',
        label: 'Something else',
        askOrderRef: false
    }
] as const satisfies readonly {
    id: string
    label: string
    guidance?: string
    askOrderRef: boolean
}[]

export type SupportTopicId = (typeof supportTopics)[number]['id']

/**
 * Where customers can email us directly, the alternative to the form
 */
export const supportEmail = 'support@soopanova.app'
