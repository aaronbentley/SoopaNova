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

    // const bytes = await file.arrayBuffer()
    // console.log('🦄 ~ file: route.ts:23 ~ POST ~ bytes:', bytes)
    // const buffer = Buffer.from(bytes)
    // console.log('🦄 ~ file: route.ts:25 ~ POST ~ buffer:', buffer)

    // With the file data in the buffer, you can do whatever you want with it.
    // For this, we'll just write it to the filesystem in a new location
    // const path = `/tmp/${file.name}`
    // const foof = await writeFile(path, buffer)
    // console.log(`open ${path} to see the uploaded file`)

    try {
        /**
         * Create a new FormData object
         */
        const canvasPopData = new FormData()
        canvasPopData.append('image', file, file.name)

        console.log(
            '🦄 ~ file: route.ts:38 ~ POST ~ canvasPopData:',
            canvasPopData
        )

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
                    // 'Content-Type': 'multipart/form-data'
                },
                // credentials: 'omit',
                body: canvasPopData
            }
        )
        // console.log('🦄 ~ file: route.ts:42 ~ POST ~ response:', response)

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

    // const bytes = await file.arrayBuffer()
    // const buffer = Buffer.from(bytes)

    // With the file data in the buffer, you can do whatever you want with it.
    // For this, we'll just write it to the filesystem in a new location
    // const path = `/tmp/${file.name}`
    // await writeFile(path, buffer)
    // console.log(`open ${path} to see the uploaded file`)

    // return NextResponse.json({ success: true })
}
