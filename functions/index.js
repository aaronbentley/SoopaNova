const functions = require('firebase-functions')
const xla = require('async-xbox-live-api')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.getXuid = functions.https.onRequest(async (request, response) => {
    xla.username = functions.config().xbox.user
    xla.password = functions.config().xbox.pass
    try {
        const { gamertag = '' } = request.query
        if (gamertag) {
            const xuid = await xla.getXuid(gamertag)
            response.send({ body: xuid })
        }
        response.end()
    } catch (error) {
        response.send(error)
    }
})

exports.getScreenshots = functions.https.onRequest(
    async (request, response) => {
        xla.username = functions.config().xbox.user
        xla.password = functions.config().xbox.pass
        try {
            const { gamertag = '' } = request.query
            if (gamertag) {
                const screenshots = await xla.getScreenshotsForGamer(gamertag)
                console.log({ screenshots })

                response.send({ body: screenshots })
            }
            response.end('No Gamertag')
        } catch (error) {
            response.send(error)
        }
    }
)

exports.getClips = functions.https.onRequest(async (request, response) => {
    xla.username = functions.config().xbox.user
    xla.password = functions.config().xbox.pass
    try {
        const { gamertag = '' } = request.query
        if (gamertag) {
            const clips = await xla.getClipsForGamer(gamertag)
            console.log({ clips })
            response.send({ body: clips })
        }
        response.end('No Gamertag')
    } catch (error) {
        response.send(error)
    }
})
