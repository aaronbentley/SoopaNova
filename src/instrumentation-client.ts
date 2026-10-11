import { initBotId } from 'botid/client/core'

/**
 * Vercel BotID: requests to these paths carry a bot check that their
 * Server Action or route verifies with checkBotId(). Server Actions post to
 * the page they're called from.
 */
initBotId({
    protect: [{ path: '/support/', method: 'POST' }]
})
