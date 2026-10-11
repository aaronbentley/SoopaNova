'use server'

import { supportEmail, supportTopics } from '@/assets/data/support'
import { trackServerEvent } from '@/lib/analytics-server'
import { sendSupportEmail } from '@/lib/email'
import { asksOrderRef, supportRequestSchema } from '@/lib/support-schema'
import { auth } from '@clerk/nextjs/server'
import { checkBotId } from 'botid/server'

export type SupportResult = { sent: true } | { message: string }

const failed = {
    message: `We couldn't send your message. Please try again, or email ${supportEmail}.`
}

/**
 * Send a message from the support form. Open to anyone (rights holders
 * won't have accounts), so Vercel BotID checks the caller instead of Clerk;
 * a signed-in sender's account id is included to help find their orders.
 * Returns a message for the sender rather than throwing (thrown errors are
 * hidden from the client in production).
 */
export const sendSupportRequestAction = async (
    input: unknown
): Promise<SupportResult> => {
    const verification = await checkBotId()

    if (verification.isBot) {
        return failed
    }

    const parsed = supportRequestSchema.safeParse(input)

    if (!parsed.success) {
        return { message: 'Please check the form and try again.' }
    }

    const { topic, orderRef, ...request } = parsed.data
    const topicLabel =
        supportTopics.find((entry) => entry.id === topic)?.label ?? topic
    const { userId } = await auth()

    const sent = await sendSupportEmail({
        ...request,
        topic: topicLabel,
        orderRef: asksOrderRef(topic) ? orderRef : undefined,
        userId
    })

    if (!sent) return failed

    trackServerEvent('Support request sent', { topic: topicLabel })

    return { sent: true }
}
