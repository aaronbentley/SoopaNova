import UploadForm from '@/components/forms/upload-form'

const Home = () => {
    return (
        <main className='flex min-h-screen flex-col items-center justify-center p-24 gap-y-24'>
            <h1 className='scroll-m-20 text-5xl font-extrabold text-slate-300 tracking-tight lg:text-7xl'>
                {process.env.NEXT_PUBLIC_APP_TITLE}
            </h1>

            <UploadForm />
        </main>
    )
}

export default Home

// <div
//     className={cn(
//         'group max-w-lg relative mt-8 grid h-48 w-full cursor-pointer place-items-center rounded-lg border-2 // border-dashed border-slate-400/25 px-5 py-2.5 text-center transition hover:bg-muted/25',
//         'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring // focus-visible:ring-offset-2'
//         // isDragActive && 'border-slate-400/50',
//         // disabled && 'pointer-events-none opacity-60',
//         // className
//     )}
//     // {...props}
// >
//     <input
//     {...getInputProps()}
//     />
//     <div className='grid place-items-center gap-1 sm:px-5'>
//         <UploadCloud
//             className='h-8 w-8 text-slate-300'
//             aria-hidden='true'
//         />
//         <p className='mt-2 text-base font-medium text-slate-300'>
//             Drag {`'n'`} drop file here, or click to select file
//         </p>
//         <p className='text-sm text-slate-500'>
//             Please upload file with size less than{' '}
//             {formatBytes(1000)}
//         </p>
//     </div>
// </div>
// <p className='text-center text-sm font-medium text-muted-foreground'>
//         You can upload up to {maxFiles}{' '}
//         {maxFiles === 1 ? 'file' : 'files'}
//     </p> */}
//
// <div className='grid w-full max-w-sm items-center gap-1.5'>
//     <Label htmlFor='picture'>Picture</Label>
//     <Input
//         id='picture'
//         type='file'
//     />
// </div>
