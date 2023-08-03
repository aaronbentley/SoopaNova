import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
    /**
     * Get form data from request body as payload
     */
    const payload = await request.formData()
    // const file: File | null = data.get('file') as unknown as File

    /**
     * If no payload (formData) return error
     */
    if (!payload) {
        return NextResponse.json(
            {
                message: 'error',
                data: 'No payload formData.'
            },
            { status: 422 }
        )
    }

    /**
     * Upload file to CanvasPop API
     */
    try {
        /**
         * POST payload to CanvasPop API
         */
        const response = await fetch(
            'https://store.canvaspop.com/api/push/image',
            {
                method: 'POST',
                headers: {
                    'CP-Authorization': 'basic',
                    'CP-ApiKey': process.env.CANVASPOP_ACCESS_KEY!
                },
                body: payload
            }
        )

        /**
         * Throw error if response is not ok
         */
        if (!response.ok) {
            throw new Error('Error uploading image to CanvasPop API')
        }

        /**
         * Get api response data as JSON
         */
        const json = await response.json()

        /**
         * Return response, with API response data
         */
        return NextResponse.json(
            {
                message: 'success',
                data: json
            },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            {
                message: 'error',
                data: error
            },
            { status: 500 }
        )
    }
}
