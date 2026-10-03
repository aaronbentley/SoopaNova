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
import PlatformTile, { PlatformStrip } from '@/components/platform-tile'
import { Typography } from '@/components/typography'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Xbox Screenshots',
    description:
        'How to download your Xbox screenshots, ready to create awesome prints.',
    alternates: {
        canonical: '/screenshots/xbox/'
    }
}

const ScreenshotsXbox = () => {
    return (
        <>
            <div>
                <PageHeader eyebrow='Screenshots'>
                    <PageHeaderHeading>Xbox</PageHeaderHeading>
                    <PageHeaderDescription>
                        How to download your Xbox screenshots, ready to create
                        awesome prints.
                    </PageHeaderDescription>
                    <PlatformStrip className='mt-6 w-full overflow-hidden rounded-xl border bg-background'>
                        <PlatformTile
                            href='#onedrive'
                            name='OneDrive'
                            className='px-6'
                        />
                        <PlatformTile
                            href='#xbox-app'
                            name='Xbox app'
                            className='px-6'
                        />
                        <PlatformTile
                            href='#usb-drive'
                            name='USB drive'
                            className='px-6'
                        />
                    </PlatformStrip>
                </PageHeader>
            </div>

            <div>
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
                            className='font-semibold text-foreground'>
                            Enable OneDrive on Xbox:
                            <Typography
                                variant='ul'
                                className='font-normal text-muted-foreground'>
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
                            className='font-semibold text-foreground'>
                            Access screenshots on PC:
                            <Typography
                                variant='ul'
                                className='font-normal text-muted-foreground'>
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
                            className='font-semibold text-foreground'>
                            Access screenshots on your phone:
                            <Typography
                                variant='ul'
                                className='font-normal text-muted-foreground'>
                                <Typography variant='li'>
                                    Download the OneDrive app from your
                                    device&apos;s app store (
                                    <a
                                        href='https://apps.apple.com/us/app/microsoft-onedrive/id477537958'
                                        title='View One Drive on the App Store'
                                        target='_blank'
                                        className='font-medium text-primary underline underline-offset-4 transition-colors duration-200 hover:text-primary'>
                                        App Store
                                    </a>
                                    ,{' '}
                                    <a
                                        href='https://play.google.com/store/apps/details?id=com.microsoft.skydrive'
                                        title='View One Drive on the Google Play Store'
                                        target='_blank'
                                        className='font-medium text-primary underline underline-offset-4 transition-colors duration-200 hover:text-primary'>
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

            <div>
                <PageSection id='xbox-app'>
                    <PageSectionHeading>Xbox app</PageSectionHeading>
                    <PageSectionDescription>
                        The Xbox app provides a direct connection between your
                        Xbox console, PC, and mobile device.
                    </PageSectionDescription>

                    <Typography variant='ol'>
                        <Typography
                            variant='li'
                            className='font-semibold text-foreground'>
                            Install the Xbox app:
                            <Typography
                                variant='ul'
                                className='font-normal text-muted-foreground'>
                                <Typography variant='li'>
                                    Download the Xbox app from the{' '}
                                    <a
                                        href='https://apps.microsoft.com/detail/xbox/9MV0B5HZVK9Z'
                                        title='View the Xbox app on the Microsoft Store'
                                        target='_blank'
                                        className='font-medium text-primary underline underline-offset-4 transition-colors duration-200 hover:text-primary'>
                                        {' '}
                                        Microsoft Store (PC)
                                    </a>{' '}
                                    or your device&apos;s app store (
                                    <a
                                        href='https://apps.apple.com/app/xbox/id736179781'
                                        title='View the Xbox app on the App Store'
                                        target='_blank'
                                        className='font-medium text-primary underline underline-offset-4 transition-colors duration-200 hover:text-primary'>
                                        App Store
                                    </a>
                                    ,{' '}
                                    <a
                                        href='https://play.google.com/store/apps/details?id=com.microsoft.xboxone.smartglass&hl'
                                        title='View the Xbox app on the Google Play Store'
                                        target='_blank'
                                        className='font-medium text-primary underline underline-offset-4 transition-colors duration-200 hover:text-primary'>
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
                            className='font-semibold text-foreground'>
                            Access screenshots:
                            <Typography
                                variant='ul'
                                className='font-normal text-muted-foreground'>
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
                            className='font-semibold text-foreground'>
                            Sharing and saving:
                            <Typography
                                variant='ul'
                                className='font-normal text-muted-foreground'>
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

            <div>
                <PageSection id='usb-drive'>
                    <PageSectionHeading>USB drive</PageSectionHeading>
                    <PageSectionDescription>
                        If you prefer a wired connection, using a USB drive is a
                        straightforward way to transfer screenshots.
                    </PageSectionDescription>

                    <Typography variant='ol'>
                        <Typography
                            variant='li'
                            className='font-semibold text-foreground'>
                            Prepare a USB drive:
                            <Typography
                                variant='ul'
                                className='font-normal text-muted-foreground'>
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
                            className='font-semibold text-foreground'>
                            Copy your screenshots:
                            <Typography
                                variant='ul'
                                className='font-normal text-muted-foreground'>
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
