import { OneDriveIcon, XboxIcon } from '@/components/brand-icons'
import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading
} from '@/components/page-header'
import {
    PageSection,
    PageSectionDescription,
    PageSectionHeading
} from '@/components/page-section'
import ScrollToTarget from '@/components/scroll-to-target'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { UsbIcon } from 'lucide-react'
import { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => ({
    title: 'Xbox Screenshots',
    description:
        'How to get your Xbox screenshots, ready to create awesome prints.',
    openGraph: {
        url: '/screenshots/xbox/'
    }
})

const ScreenshotsXbox = () => {
    return (
        <>
            <div className='container'>
                <PageHeader>
                    <PageHeaderHeading>Xbox Screenshots</PageHeaderHeading>
                    <PageHeaderDescription>
                        How to download your Xbox screenshots, ready to create
                        awesome prints.
                    </PageHeaderDescription>
                    <div className='w-full grid md:grid-flow-dense md:grid-cols-3 gap-8 mt-12 md:mt-24'>
                        <ScrollToTarget target='onedrive'>
                            <Card className='bg-neutral-100 dark:bg-neutral-900 group transition-all duration-200 hover:border-pink-500 hover:dark:border-pink-500'>
                                <CardHeader className='relative'>
                                    <CardTitle className='group-hover:text-pink-500 transition-colors duration-200'>
                                        OneDrive
                                        <OneDriveIcon className='absolute opacity-20 text-neutral-500 group-hover:fill-pink-500 transition-all duration-200 top-6 right-6 h-7 w-7 group-hover:opacity-100 stroke-1' />
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        </ScrollToTarget>
                        <ScrollToTarget target='xbox-app'>
                            <Card className='bg-neutral-100 dark:bg-neutral-900 group transition-all duration-200 hover:border-pink-500 hover:dark:border-pink-500'>
                                <CardHeader className='relative'>
                                    <CardTitle className='group-hover:text-pink-500 transition-colors duration-200'>
                                        Xbox App
                                        <XboxIcon className='absolute opacity-20 text-neutral-500 group-hover:fill-pink-500 transition-all duration-200 top-6 right-6 h-7 w-7 group-hover:opacity-100 stroke-1' />
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        </ScrollToTarget>
                        <ScrollToTarget target='usb-drive'>
                            <Card className='bg-neutral-100 dark:bg-neutral-900 group transition-all duration-200 hover:border-pink-500 hover:dark:border-pink-500'>
                                <CardHeader className='relative'>
                                    <CardTitle className='group-hover:text-pink-500 transition-colors duration-200'>
                                        USB Drive
                                        <UsbIcon className='absolute opacity-20 text-neutral-500 group-hover:text-pink-500 transition-all duration-200 top-6 right-6 h-7 w-7 group-hover:opacity-100 stroke-1' />
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        </ScrollToTarget>
                    </div>
                </PageHeader>
            </div>

            <div className='container'>
                <PageSection id='onedrive'>
                    <PageSectionHeading>OneDrive</PageSectionHeading>
                    <PageSectionDescription>
                        OneDrive, Microsoft&apos;s cloud storage service,
                        seamlessly connects your Xbox and PC, making it a
                        convenient option to transfer screenshots.
                    </PageSectionDescription>

                    <ol className='list-decimal list-inside space-y-8'>
                        <li className='font-extrabold'>
                            Enable OneDrive on Xbox:
                            <ul className='list-disc list-inside ps-4 space-y-2 mt-2 font-normal'>
                                <li>
                                    Press the Xbox button on your controller to
                                    open the guide.
                                </li>
                                <li>
                                    Navigate to{' '}
                                    <em>&lsquo;Profile & system&rsquo;</em>,{' '}
                                    <em>&lsquo;Settings&rsquo;</em>,{' '}
                                    <em>&lsquo;Devices & connections&rsquo;</em>
                                    .
                                </li>
                                <li>
                                    Select{' '}
                                    <em>&lsquo;Media preferences&rsquo;</em>,{' '}
                                    <em>&lsquo;Capture & share&rsquo;</em>.
                                </li>
                                <li>
                                    Choose{' '}
                                    <em>&lsquo;Open captures folder&rsquo;</em>,
                                    and select
                                    <em>&lsquo;On&rsquo;</em> to enable
                                    automatic upload to OneDrive.
                                </li>
                            </ul>
                        </li>
                        <li className='font-extrabold'>
                            Access Screenshots on PC:
                            <ul className='list-disc list-inside ps-4 space-y-2 mt-2 font-normal'>
                                <li>
                                    On your PC, ensure you&apos;re signed in to
                                    the same Microsoft account used on your
                                    Xbox.
                                </li>
                                <li>
                                    Visit the OneDrive website or open the
                                    OneDrive app.
                                </li>
                                <li>
                                    Navigate to the{' '}
                                    <em>&lsquo;Screenshots&rsquo;</em> folder
                                    under <em>&lsquo;Xbox Game Bar&rsquo;</em>.
                                </li>
                            </ul>
                        </li>
                        <li className='font-extrabold'>
                            Access Screenshots on Phone:
                            <ul className='list-disc list-inside ps-4 space-y-2 mt-2 font-normal'>
                                <li>
                                    Download the OneDrive app from your
                                    device&apos;s app store (
                                    <a
                                        href='https://apps.apple.com/us/app/microsoft-onedrive/id477537958'
                                        title='View One Drive on the App Store'
                                        target='_blank'
                                        className='font-medium text-primary underline underline-offset-4 transition-colors duration-200 hover:text-pink-500'>
                                        App Store
                                    </a>
                                    ,{' '}
                                    <a
                                        href='https://play.google.com/store/apps/details?id=com.microsoft.skydrive'
                                        title='View One Drive on the Google Play Store'
                                        target='_blank'
                                        className='font-medium text-primary underline underline-offset-4 transition-colors duration-200 hover:text-pink-500'>
                                        Google Play Store
                                    </a>
                                    ).
                                </li>
                                <li>
                                    Sign in with the same Microsoft account used
                                    on your Xbox.{' '}
                                </li>
                                <li>
                                    Open the <em>&lsquo;Screenshots&rsquo;</em>{' '}
                                    folder under{' '}
                                    <em>&lsquo;Xbox Game Bar&rsquo;</em>.
                                </li>
                            </ul>
                        </li>
                    </ol>
                </PageSection>
            </div>

            <div className='container'>
                <PageSection id='xbox-app'>
                    <PageSectionHeading>Xbox App</PageSectionHeading>
                    <PageSectionDescription>
                        The Xbox App provides a direct connection between your
                        Xbox console, PC, and mobile device.
                    </PageSectionDescription>

                    <ol className='list-decimal list-inside space-y-2'>
                        <li className='font-extrabold'>Install Xbox App:</li>
                        <ul className='list-disc list-inside ps-4 space-y-2 mt-2 font-normal'>
                            <li>
                                Download the Xbox app from the{' '}
                                <a
                                    href='https://apps.microsoft.com/detail/xbox/9MV0B5HZVK9Z'
                                    title='View Xbox App on the Microsoft Store'
                                    target='_blank'
                                    className='font-medium text-primary underline underline-offset-4 transition-colors duration-200 hover:text-pink-500'>
                                    {' '}
                                    Microsoft Store (PC)
                                </a>{' '}
                                or your device&apos;s app store (
                                <a
                                    href='https://apps.apple.com/app/xbox/id736179781'
                                    title='View Xbox App on the App Store'
                                    target='_blank'
                                    className='font-medium text-primary underline underline-offset-4 transition-colors duration-200 hover:text-pink-500'>
                                    App Store
                                </a>
                                ,{' '}
                                <a
                                    href='https://play.google.com/store/apps/details?id=com.microsoft.xboxone.smartglass&hl'
                                    title='View Xbox App on the Google Play Store'
                                    target='_blank'
                                    className='font-medium text-primary underline underline-offset-4 transition-colors duration-200 hover:text-pink-500'>
                                    Google Play Store
                                </a>
                                ).
                            </li>
                            <li>
                                Sign in with the Microsoft account linked to
                                your Xbox.
                            </li>
                        </ul>
                        <li className='font-extrabold'>Access Screenshots:</li>
                        <ul className='list-disc list-inside ps-4 space-y-2 mt-2 font-normal'>
                            <li>Open the Xbox app.</li>
                            <li>
                                Navigate to the{' '}
                                <em>&lsquo;Capture & share&rsquo;</em> tab.
                            </li>
                            <li>
                                All your captured screenshots and game clips
                                will be available here.
                            </li>
                        </ul>
                        <li className='font-extrabold'>Sharing and Saving:</li>
                        <ul className='list-disc list-inside ps-4 space-y-2 mt-2 font-normal'>
                            <li>
                                On PC: Right-click the screenshot and choose
                                <em>&lsquo;Save image as...&rsquo;</em>.
                            </li>
                            <li>
                                On phone: Tap and hold the screenshot, then
                                select <em>&lsquo;Save image&rsquo;</em>.
                            </li>
                        </ul>
                    </ol>
                </PageSection>
            </div>

            <div className='container'>
                <PageSection id='usb-drive'>
                    <PageSectionHeading>USB Drive</PageSectionHeading>
                    <PageSectionDescription>
                        If you prefer a wired connection, using a USB drive is a
                        straightforward way to transfer screenshots.
                    </PageSectionDescription>
                    <ol className='list-decimal list-inside space-y-2'>
                        <li className='font-extrabold'>Prepare USB Drive:</li>
                        <ul className='list-disc list-inside ps-4 space-y-2 mt-2 font-normal'>
                            <li>
                                Insert a USB storage device into your
                                Xbox&apos;s USB port.
                            </li>
                            <li>
                                In the Xbox guide, go to{' '}
                                <em>&lsquo;Profile & system&rsquo;</em>,
                                <em>&lsquo;Settings&rsquo;</em>,{' '}
                                <em>&lsquo;Devices & connections&rsquo;</em>,{' '}
                                <em>&lsquo;Media Devices&rsquo;</em>.
                            </li>
                            <li>
                                Select your USB drive and choose{' '}
                                <em>&lsquo;Format storage device&rsquo;</em>,
                                then follow the prompts.
                            </li>
                        </ul>
                        <li className='font-extrabold'>Copy Screenshots:</li>
                        <ul className='list-disc list-inside ps-4 space-y-2 mt-2 font-normal'>
                            <li>
                                Navigate to{' '}
                                <em>&lsquo;Profile & system&rsquo;</em>,{' '}
                                <em>&lsquo;Capture & share&rsquo;</em>,{' '}
                                <em>&lsquo;Recent captures&rsquo;</em>.
                            </li>
                            <li>
                                Select the screenshots you want to transfer and
                                choose{' '}
                                <em>&lsquo;Copy to storage device&rsquo;</em>.
                            </li>
                        </ul>
                    </ol>
                </PageSection>
            </div>
        </>
    )
}

export default ScreenshotsXbox
