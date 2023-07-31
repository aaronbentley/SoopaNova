import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
    /**
     * Get form data from request body
     */
    const formData = await request.formData()
    console.log('🦄 ~ file: route.ts:8 ~ POST ~ formData:', formData)

    const image = formData.get('image')

    /**
     * Get image file from form data
     */
    // const file: File | null = formData.get('image') as unknown as File
    // console.log('🦄 ~ file: route.ts:14 ~ POST ~ file:', file)

    /**
     * If no file, return error
     */
    if (!image) {
        return NextResponse.json(
            { error: 'No image file found.' },
            { status: 500 }
        )
    }

    // const bytes = await file.arrayBuffer()
    // console.log('🦄 ~ file: route.ts:24 ~ POST ~ bytes:', bytes)
    // const buffer = Buffer.from(bytes)
    // console.log('🦄 ~ file: route.ts:26 ~ POST ~ buffer:', buffer)

    /**
     * Upload file to CanvasPop Push API
     */
    try {
        const data = new FormData()
        data.set('image', image)

        const baseAPI = 'https://store.canvaspop.com/api/push/image'
        const response = await fetch(baseAPI, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'multipart/form-data',
                'CP-Authorization': 'basic',
                'CP-ApiKey': process.env.CANVASPOP_ACCESS_KEY!
            },
            body: formData
        })

        // handle the error
        if (!response.ok) throw new Error(await response.text())
        console.log('🦄 ~ file: route.ts:25 ~ POST ~ response:', response)

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.log('🦄 ~ file: route.ts:55 ~ POST ~ error:', error)
        return NextResponse.json({ message: error }, { status: 500 })
    }
}
