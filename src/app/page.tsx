import UploadFile from '@/components/upload-file'

const Home = () => {
    return (
        <main className='flex min-h-screen flex-col items-center justify-start p-24 gap-y-16'>
            <h1 className='scroll-m-20 text-5xl font-extrabold tracking-tighter lg:text-7xl'>
                {process.env.NEXT_PUBLIC_APP_TITLE}
            </h1>

            <UploadFile />
        </main>
    )
}

export default Home
