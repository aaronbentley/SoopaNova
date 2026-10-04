import { qualityThresholds } from '@/lib/print-quality'

const minWidth = Number(process.env.MIN_IMAGE_WIDTH)
const minHeight = Number(process.env.MIN_IMAGE_HEIGHT)
const maxFileSize = Number(process.env.MAX_UPLOAD_FILE_SIZE)

/**
 * Common screenshot resolutions, for the Screenshots page's sizes table
 */
export const resolutions = [
    { name: '1080p', width: 1920, height: 1080 },
    { name: '1440p', width: 2560, height: 1440 },
    { name: '4K', width: 3840, height: 2160 }
]

/**
 * The Screenshots page's pro tips
 */
export const screenshotTips = [
    {
        title: 'Use the original file',
        body: 'Download the screenshot straight from your console or PC (see the guides above). Copies shared on social media or messaging apps are usually shrunk and compressed, and print noticeably worse.'
    },
    {
        title: 'More pixels, bigger prints',
        body: `We need at least ${minWidth} × ${minHeight} pixels, and grade every size by how sharp your screenshot will print at it. Sizes it's too small for (under ${qualityThresholds.ok} pixels per inch) can't be ordered. If your console or PC can capture in 4K, use it.`
    },
    {
        title: 'JPG or PNG',
        body: `Upload a JPG or PNG file, up to ${maxFileSize}MB.`
    },
    {
        title: 'Hide the HUD',
        body: "If the game has a photo mode, use it: you can frame the shot and turn off health bars, maps and button prompts for a cleaner print. Otherwise, check the game's settings for a way to hide the HUD."
    },
    {
        title: 'Mind the edges',
        body: 'Our prints are long rectangles, close to a widescreen screenshot, and yours is cropped from the centre to fill one. Keep anything important away from the very edges. You can check the crop in the preview before you order.'
    }
]
