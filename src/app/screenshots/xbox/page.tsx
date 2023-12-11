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
import { Typography } from '@/components/typography'
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

                    <Typography variant='ol'>
                        <Typography
                            variant='li'
                            className='font-extrabold'>
                            Enable OneDrive on Xbox:
                            <Typography
                                variant='ul'
                                className='font-normal'>
                                <Typography variant='li'>
                                    Press the Xbox button on your controller to
                                    open the guide.
                                </Typography>
                                <Typography variant='li'>
                                    Navigate to{' '}
                                    <Typography variant='em'>
                                        &lsquo;Profile & system&rsquo;
                                    </Typography>
                                    ,{' '}
                                    <Typography variant='em'>
                                        &lsquo;Settings&rsquo;
                                    </Typography>
                                    ,{' '}
                                    <Typography variant='em'>
                                        &lsquo;Devices & connections&rsquo;
                                    </Typography>
                                    .
                                </Typography>
                                <Typography variant='li'>
                                    Select{' '}
                                    <Typography variant='em'>
                                        &lsquo;Media preferences&rsquo;
                                    </Typography>
                                    ,{' '}
                                    <Typography variant='em'>
                                        &lsquo;Capture & share&rsquo;
                                    </Typography>
                                    .
                                </Typography>
                                <Typography variant='li'>
                                    Choose{' '}
                                    <Typography variant='em'>
                                        &lsquo;Open captures folder&rsquo;
                                    </Typography>
                                    , and select
                                    <Typography variant='em'>
                                        &lsquo;On&rsquo;
                                    </Typography>{' '}
                                    to enable automatic upload to OneDrive.
                                </Typography>
                            </Typography>
                        </Typography>
                        <Typography
                            variant='li'
                            className='font-extrabold'>
                            Access Screenshots on PC:
                            <Typography
                                variant='ul'
                                className='font-normal'>
                                <Typography variant='li'>
                                    On your PC, ensure you&apos;re signed in to
                                    the same Microsoft account used on your
                                    Xbox.
                                </Typography>
                                <Typography variant='li'>
                                    Visit the OneDrive website or open the
                                    OneDrive app.
                                </Typography>
                                <Typography variant='li'>
                                    Navigate to the{' '}
                                    <Typography variant='em'>
                                        &lsquo;Screenshots&rsquo;
                                    </Typography>{' '}
                                    folder under{' '}
                                    <Typography variant='em'>
                                        &lsquo;Xbox Game Bar&rsquo;
                                    </Typography>
                                    .
                                </Typography>
                            </Typography>
                        </Typography>
                        <Typography
                            variant='li'
                            className='font-extrabold'>
                            Access Screenshots on Phone:
                            <Typography
                                variant='ul'
                                className='font-normal'>
                                <Typography variant='li'>
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
                                </Typography>
                                <Typography variant='li'>
                                    Sign in with the same Microsoft account used
                                    on your Xbox.{' '}
                                </Typography>
                                <Typography variant='li'>
                                    Open the{' '}
                                    <Typography variant='em'>
                                        &lsquo;Screenshots&rsquo;
                                    </Typography>{' '}
                                    folder under{' '}
                                    <Typography variant='em'>
                                        &lsquo;Xbox Game Bar&rsquo;
                                    </Typography>
                                    .
                                </Typography>
                            </Typography>
                        </Typography>
                    </Typography>
                </PageSection>
            </div>

            <div className='container'>
                <PageSection id='xbox-app'>
                    <PageSectionHeading>Xbox App</PageSectionHeading>
                    <PageSectionDescription>
                        The Xbox App provides a direct connection between your
                        Xbox console, PC, and mobile device.
                    </PageSectionDescription>

                    <Typography variant='ol'>
                        <Typography
                            variant='li'
                            className='font-extrabold'>
                            Install Xbox App:
                            <Typography
                                variant='ul'
                                className='font-normal'>
                                <Typography variant='li'>
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
                                </Typography>
                                <Typography variant='li'>
                                    Sign in with the Microsoft account linked to
                                    your Xbox.
                                </Typography>
                            </Typography>
                        </Typography>
                        <Typography
                            variant='li'
                            className='font-extrabold'>
                            Access Screenshots:
                            <Typography
                                variant='ul'
                                className='font-normal'>
                                <Typography variant='li'>
                                    Open the Xbox app.
                                </Typography>
                                <Typography variant='li'>
                                    Navigate to the{' '}
                                    <Typography variant='em'>
                                        &lsquo;Capture & share&rsquo;
                                    </Typography>{' '}
                                    tab.
                                </Typography>
                                <Typography variant='li'>
                                    All your captured screenshots and game clips
                                    will be available here.
                                </Typography>
                            </Typography>
                        </Typography>
                        <Typography
                            variant='li'
                            className='font-extrabold'>
                            Sharing and Saving:
                            <Typography
                                variant='ul'
                                className='font-normal'>
                                <Typography variant='li'>
                                    On PC: Right-click the screenshot and choose
                                    <Typography variant='em'>
                                        &lsquo;Save image as...&rsquo;
                                    </Typography>
                                    .
                                </Typography>
                                <Typography variant='li'>
                                    On phone: Tap and hold the screenshot, then
                                    select{' '}
                                    <Typography variant='em'>
                                        &lsquo;Save image&rsquo;
                                    </Typography>
                                    .
                                </Typography>
                            </Typography>
                        </Typography>
                    </Typography>
                </PageSection>
            </div>

            <div className='container'>
                <PageSection id='usb-drive'>
                    <PageSectionHeading>USB Drive</PageSectionHeading>
                    <PageSectionDescription>
                        If you prefer a wired connection, using a USB drive is a
                        straightforward way to transfer screenshots.
                    </PageSectionDescription>

                    <Typography variant='ol'>
                        <Typography
                            variant='li'
                            className='font-extrabold'>
                            Prepare USB Drive:
                            <Typography
                                variant='ul'
                                className='font-normal'>
                                <Typography variant='li'>
                                    Insert a USB storage device into your
                                    Xbox&apos;s USB port.
                                </Typography>
                                <Typography variant='li'>
                                    In the Xbox guide, go to{' '}
                                    <Typography variant='em'>
                                        &lsquo;Profile & system&rsquo;
                                    </Typography>
                                    ,
                                    <Typography variant='em'>
                                        &lsquo;Settings&rsquo;
                                    </Typography>
                                    ,{' '}
                                    <Typography variant='em'>
                                        &lsquo;Devices & connections&rsquo;
                                    </Typography>
                                    ,{' '}
                                    <Typography variant='em'>
                                        &lsquo;Media Devices&rsquo;
                                    </Typography>
                                    .
                                </Typography>
                                <Typography variant='li'>
                                    Select your USB drive and choose{' '}
                                    <Typography variant='em'>
                                        &lsquo;Format storage device&rsquo;
                                    </Typography>
                                    , then follow the prompts.
                                </Typography>
                            </Typography>
                        </Typography>
                        <Typography
                            variant='li'
                            className='font-extrabold'>
                            Copy Screenshots:
                            <Typography
                                variant='ul'
                                className='font-normal'>
                                <Typography variant='li'>
                                    Navigate to{' '}
                                    <Typography variant='em'>
                                        &lsquo;Profile & system&rsquo;
                                    </Typography>
                                    ,{' '}
                                    <Typography variant='em'>
                                        &lsquo;Capture & share&rsquo;
                                    </Typography>
                                    ,{' '}
                                    <Typography variant='em'>
                                        &lsquo;Recent captures&rsquo;
                                    </Typography>
                                    .
                                </Typography>
                                <Typography variant='li'>
                                    Select the screenshots you want to transfer
                                    and choose{' '}
                                    <Typography variant='em'>
                                        &lsquo;Copy to storage device&rsquo;
                                    </Typography>
                                    .
                                </Typography>
                            </Typography>
                        </Typography>
                    </Typography>
                </PageSection>
            </div>
        </>
    )
}

export default ScreenshotsXbox
