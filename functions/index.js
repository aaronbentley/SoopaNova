const functions = require('firebase-functions')
const xla = require('async-xbox-live-api')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

const init = async () => {
    xla.username = functions.config().xbox.user
    xla.password = functions.config().xbox.pass
}

exports.getScreenshots = functions.https.onRequest(
    async (request, response) => {
        try {
            await init()
            const { gamertag = '' } = request.query
            if (gamertag !== '') {
                const screenshots = await xla.getScreenshotsForGamer(gamertag)
                response.send(screenshots)
            }
            response.end('No Gamertag provided')
        } catch (error) {
            response.send(error)
        }
    }
)

exports.getClips = functions.https.onRequest(async (request, response) => {
    try {
        await init()
        const { gamertag = '' } = request.query
        if (gamertag !== '') {
            const clips = await xla.getClipsForGamer(gamertag)
            console.log({ clips })
            response.send({ body: clips })
        }
        response.end('No Gamertag provided')
    } catch (error) {
        response.send(error)
    }
})
