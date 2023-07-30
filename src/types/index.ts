import { type FileWithPath } from 'react-dropzone'
// import { type z } from "zod"

export type FileWithPreview = FileWithPath & {
    preview: string
}
