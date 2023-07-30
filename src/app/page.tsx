const Home = () => {
    return (
        <main className='flex min-h-screen flex-col items-center justify-center p-24'>
            <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
                {process.env.NEXT_PUBLIC_APP_TITLE}
            </h1>
        </main>
    )
}

export default Home
