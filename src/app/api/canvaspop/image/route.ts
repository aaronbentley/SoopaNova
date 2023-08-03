import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
    /**
     * Get form data from request body
     */
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    /**
     * If no file, return error
     */
    if (!file) {
        console.error('🦄 ~ file: route.ts:14 ~ POST ~ file:', file)
        return NextResponse.json({ message: 'No image file.' }, { status: 500 })
    }

    /**
     * Upload file to CanvasPop API
     */
    try {
        /**
         * Create a new FormData object
         */
        const canvasPopData = new FormData()
        canvasPopData.append('image', file, file.name)

        /**
         * POST formData to CanvasPop API
         */
        const response = await fetch(
            'https://store.canvaspop.com/api/push/image',
            {
                method: 'POST',
                headers: {
                    'CP-Authorization': 'basic',
                    'CP-ApiKey': process.env.CANVASPOP_ACCESS_KEY!
                },
                // credentials: 'omit',
                // body: canvasPopData
                body: data
            }
        )
        // console.log('🦄 ~ file: route.ts ~ POST ~ response:', response)

        const json = await response.json()
        console.log('🦄 ~ file: route.ts:64 ~ POST ~ json:', json)

        // handle the error
        if (!response.ok)
            // throw new Error(`${response.status}: ${response.statusText}`)
            throw new Error(await response.text())

        return NextResponse.json({ message: 'success' }, { status: 200 })
    } catch (error) {
        console.error('🦄 ~ file: route.ts ~ POST ~ error:', error)
        return NextResponse.json({ message: error }, { status: 500 })
    }
}
