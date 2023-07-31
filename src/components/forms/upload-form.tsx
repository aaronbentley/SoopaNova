'use client'

import { productSchema } from '@/lib/validations'
import { FileWithPreview } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { FileDialog } from '../file-dialog'
import { Button } from '../ui/button'
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useToast } from '../ui/use-toast'

const UploadForm = () => {
    const { toast } = useToast()

    const [files, setFiles] = React.useState<FileWithPreview[] | null>(null)

    const [isPending, startTransition] = React.useTransition()

    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema)
    })

    const previews = form.watch('images') as FileWithPreview[] | null

    const onSubmit = (data: z.infer<typeof productSchema>) => {
        console.log('🦄 ~ file: upload-form.tsx:32 ~ onSubmit ~ data:', data)
        toast({
            title: 'You submitted the following values:',
            description: (
                <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
                    <code className='text-white'>
                        {JSON.stringify(data, null, 2)}
                    </code>
                </pre>
            )
        })
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='w-2/3 space-y-6'>
                <FormItem className='flex w-full flex-col gap-1.5'>
                    <FormLabel>Images</FormLabel>
                    {previews?.length ? (
                        <div className='flex items-center gap-2'>
                            {previews.map((file) => (
                                <Image
                                    key={file.name}
                                    src={file.preview}
                                    alt={file.name}
                                    className='h-20 w-20 shrink-0 rounded-md object-cover object-center'
                                    width={80}
                                    height={80}
                                />
                            ))}
                        </div>
                    ) : null}
                    <FormControl>
                        <FileDialog
                            setValue={form.setValue}
                            name='images'
                            maxFiles={3}
                            maxSize={1024 * 1024 * 4}
                            files={files}
                            setFiles={setFiles}
                            //   isUploading={isUploading}
                            isUploading={false}
                            disabled={isPending}
                        />
                    </FormControl>
                    <FormMessage>
                        {form.formState.errors.images?.message}
                    </FormMessage>
                </FormItem>
                <Button
                    className='w-fit'
                    disabled={isPending}>
                    {isPending && (
                        <Loader2
                            className='mr-2 h-4 w-4 animate-spin'
                            aria-hidden='true'
                        />
                    )}
                    Add Product
                    <span className='sr-only'>Add Product</span>
                </Button>
            </form>
        </Form>
    )
}

export default UploadForm

// <FormItem className='flex w-full flex-col gap-1.5'>
//     <FormLabel>Images</FormLabel>
//     {preview ? (
//         <div className='flex items-center gap-2'>
//             {preview.map((file) => (
//                 <>
//                     <p>preview</p>
//                     {/* <Zoom key={file.name}>
//     <Image
//     src={file.preview}
//     alt={file.name}
//     className="h-20 w-20 shrink-0 rounded-md object-cover object-center"
//     width={80}
//     height={80}
//     />
// </Zoom>
//     */}
//                 </>
//             ))}
//         </div>
//     ) : null}
//     <FormControl>
//         <FileDialog
//             setValue={form.setValue}
//             name='images'
//             maxFiles={1}
//             maxSize={1024 * 1024 * 4}
//             files={files}
//             setFiles={setFiles}
//             //   isUploading={isUploading}
//             isUploading={false}
//             disabled={isPending}
//         />
//     </FormControl>
//     <FormMessage>
//         form.formState.errors.image?.message
//     </FormMessage>
// </FormItem>
