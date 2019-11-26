// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
const functions = require('firebase-functions')
const xla = require('async-xbox-live-api')

/**
 * init function to sutup xbox live interface
 */
const init = async () => {
    xla.username = functions.config().xbox.user
    xla.password = functions.config().xbox.pass
}

/**
 * returns collection of screenshot data for user
 */
exports.getScreenshots = functions.https.onRequest(
    async (request, response) => {
        try {
            const { gamertag = '' } = request.query
            if (gamertag !== '') {
                await init()
                const screenshots = await xla.getScreenshotsForGamer(gamertag)
                response.send(screenshots)
            }
            response.end('No Gamertag provided')
        } catch (error) {
            response.send(error)
        }
    }
)

/**
 * returns collection of clip data for user
 */
exports.getClips = functions.https.onRequest(async (request, response) => {
    try {
        const { gamertag = '' } = request.query
        if (gamertag !== '') {
            await init()
            const clips = await xla.getClipsForGamer(gamertag)
            response.send({ clips })
        }
        response.end('No Gamertag provided')
    } catch (error) {
        response.send(error)
    }
})
