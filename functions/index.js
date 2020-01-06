// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
const functions = require('firebase-functions')
const xla = require('async-xbox-live-api')

/**
 * init function to sutup xbox live interface
 */
const init = async () => {
    // xla.username = await functions.config().xbox.user
    // xla.password = await functions.config().xbox.pass
    xla.username = functions.config().xbox.user
    xla.password = functions.config().xbox.pass
}

/**
 * returns collection of screenshot data for user
 */
exports.getScreenshots = functions.https.onCall(async (data, context) => {
    try {
        // console.log({ data })
        // console.log({ context })
        const { gamertag = '' } = data
        if (gamertag === '') {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'No Gamertag provided'
            )
        }
        await init()
        const screenshots = await xla.getScreenshotsForGamer(gamertag)
        console.log(screenshots)
        return screenshots
    } catch (error) {
        console.log(error)
        return false
    }
})

/**
 * returns collection of clip data for user
 */
exports.getClips = functions.https.onCall(async (data, context) => {
    try {
        // console.log({ data })
        // console.log({ context })
        const { gamertag = '' } = data
        if (gamertag === '') {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'No Gamertag provided'
            )
        }
        await init()
        const clips = await xla.getClipsForGamer(gamertag)
        // console.log(clips)
        return clips
    } catch (error) {
        console.log(error)
        return false
    }
})
