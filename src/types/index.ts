import { type FileWithPath } from 'react-dropzone'
// import { type z } from "zod"

export type FileWithPreview = FileWithPath & {
    preview: string
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
