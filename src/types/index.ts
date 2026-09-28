/**
 * Screenshot dimensions, read from the preview image once it loads
 */
export type ImageMeta = {
    width: number
    height: number
    aspectRatio: string
}

/**
 * Response from the moderateImageUrl callable Cloud Function
 */
export type ModerationResult = {
    status: 'ok' | 'warning' | 'error'
    message: string
    verdict?: 'passed' | 'rejected'
    detections?: {
        adult: string
        racy: string
        violence: string
    }
}

export type ProductType =
    // Poster
    | 'PO'
    // Canvas
    | 'S'
    // Framed Print
    | 'FP'
    // Default
    | null

export type ProductFrame =
    // Canvas
    | '075DW'
    | '150DW'
    // Canvas & Framed Print
    | 'BF'
    | 'WF'
    // Framed Print
    | 'EF'
    // Default
    | null

export type ProductEdge =
    // Canvas
    | 'WB'
    | 'BB'
    // Framed Print
    | 'NOMA'
    | '250MA'
    // Default
    | null
