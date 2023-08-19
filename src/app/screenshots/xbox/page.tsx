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

export const metadata: Metadata = {
    title: 'Xbox Screenshots',
    description:
        "Here's how to get your Xbox screenshots, ready to create awesome prints."
}

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
                    <div className='w-full grid md:grid-flow-dense sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 md:mt-24'>
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
                                    <em>&ldquo;Profile & system&rdquo;</em>,{' '}
                                    <em>&ldquo;Settings&rdquo;</em>,{' '}
                                    <em>&ldquo;Devices & connections&rdquo;</em>
                                    .
                                </li>
                                <li>
                                    Select{' '}
                                    <em>&ldquo;Media preferences&rdquo;</em>,{' '}
                                    <em>&ldquo;Capture & share&rdquo;</em>.
                                </li>
                                <li>
                                    Choose{' '}
                                    <em>&ldquo;Open captures folder&rdquo;</em>,
                                    and select
                                    <em>&ldquo;On&rdquo;</em> to enable
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
                                    <em>&ldquo;Screenshots&rdquo;</em> folder
                                    under <em>&ldquo;Xbox Game Bar&rdquo;</em>.
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
                                    Open the <em>&ldquo;Screenshots&rdquo;</em>{' '}
                                    folder under{' '}
                                    <em>&ldquo;Xbox Game Bar&rdquo;</em>.
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
                        The Xbox app provides a direct connection between your
                        Xbox console, PC, and mobile device.
                    </PageSectionDescription>

                    <ol className='list-decimal list-inside space-y-2'>
                        <li className='font-extrabold'>Install Xbox App:</li>
                        <ul className='list-disc list-inside ps-4 space-y-2 mt-2 font-normal'>
                            <li>
                                Download the Xbox app from the Microsoft Store
                                (PC) or your device&apos;s app store (phone).
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
                                <em>&ldquo;Capture & share&rdquo;</em> tab.
                            </li>
                            <li>
                                All your captured screenshots and game clips
                                will be available here.
                            </li>
                        </ul>
                        <li className='font-extrabold'>Sharing and Saving:</li>
                        <ul className='list-disc list-inside ps-4 space-y-2 mt-2 font-normal'>
                            <li>
                                To share a screenshot, select it and use the
                                sharing options provided.
                            </li>
                            <li>
                                On PC: Right-click the screenshot and choose
                                <em>&ldquo;Save image as...&rdquo;</em>.
                            </li>
                            <li>
                                On phone: Tap and hold the screenshot, then
                                select <em>&ldquo;Save image&rdquo;</em>.
                            </li>
                        </ul>
                        {/* <li>Download the Xbox app on your phone or PC.</li>
                        <li>
                            Sign in to the app with the same account you use on
                            your Xbox console.
                        </li>
                        <li>
                            At the bottom of the screen, select{' '}
                            <strong>&ldquo;My Library&rdquo;</strong>, then{' '}
                            <strong>&ldquo;Captures&rdquo;</strong>.
                        </li>
                        <li>Select the screenshot you want to download.</li>
                        <li>
                            Select <strong>&ldquo;Share&rdquo;</strong> and
                            choose a destination, such as your phone&apos;s
                            camera roll or file system.
                        </li> */}
                    </ol>
                </PageSection>
            </div>

            <div className='container'>
                <PageSection id='usb-drive'>
                    <PageSectionHeading>USB</PageSectionHeading>
                    <PageSectionDescription>
                        How to download your Xbox screenshots using a USB Drive:
                    </PageSectionDescription>

                    <ol className='list-decimal list-inside space-y-2'>
                        <li>Connect a USB drive to your Xbox console.</li>
                        <li>
                            Go to{' '}
                            <strong>&ldquo;Profile & system&rdquo;</strong>,{' '}
                            <strong>&ldquo;Settings&rdquo;</strong>,{' '}
                            <strong>&ldquo;System&rdquo;</strong>,{' '}
                            <strong>&ldquo;Storage&rdquo;</strong>.
                        </li>
                        <li>
                            Under{' '}
                            <strong>&ldquo;Capture location&rdquo;</strong>,
                            select <strong>&ldquo;USB drive&rdquo;</strong>.
                        </li>
                        <li>
                            Your screenshot or game clip will be saved to the
                            USB drive.
                        </li>
                    </ol>
                </PageSection>
            </div>

            {/* <div className='container'>
                <PageSection>
                    <PageSectionHeading>Xbox</PageSectionHeading>
                    <PageSectionDescription>
                        How to download your Xbox screenshots.
                    </PageSectionDescription>

                    <div className='w-full grid md:grid-flow-dense sm:grid-cols-2 gap-8 mt-2'>
                        <Card className='bg-neutral-100 dark:bg-neutral-900 group transition-all duration-200 hover:border-pink-500 hover:dark:border-pink-500'>
                            <CardHeader className='relative'>
                                <CardTitle className='group-hover:text-pink-500 transition-colors duration-200'>
                                    On Your Phone
                                    <Smartphone className='absolute opacity-20 text-neutral-500 top-6 right-6 h-10 w-10 sm:h-12 sm:w-12 stroke-1 group-hover:opacity-100 group-hover:text-pink-500 transition-all duration-200' />
                                </CardTitle>
                                <CardDescription>Xbox App</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    The Xbox App for mobile lets you save your
                                    screenshots to your phone.
                                </p>

                                <ol className='list-decimal list-inside mt-4'>
                                    <li>Open the Xbox App</li>
                                    <li>
                                        Navigate to the{' '}
                                        <strong>
                                            &ldquo;My Library&rdquo;
                                        </strong>{' '}
                                        tab
                                    </li>
                                    <li>
                                        Choose the screenshot you want and tap{' '}
                                        <strong>&ldquo;Save&rdquo;</strong>
                                    </li>
                                </ol>
                            </CardContent>
                            <CardContent>
                                <div className='flex gap-2 mt-2'>
                                    <Link
                                        href='https://apps.apple.com/app/xbox/id736179781'
                                        className={cn(
                                            buttonVariants({
                                                variant: 'outline'
                                            })
                                        )}>
                                        App Store
                                    </Link>
                                    <Link
                                        href='https://play.google.com/store/apps/details?id=com.microsoft.xboxone.smartglass&hl'
                                        className={cn(
                                            buttonVariants({
                                                variant: 'outline'
                                            })
                                        )}>
                                        Google Play
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className='bg-neutral-100 dark:bg-neutral-900 group transition-all duration-200 hover:border-pink-500 hover:dark:border-pink-500'>
                            <CardHeader className='relative'>
                                <CardTitle className='group-hover:text-pink-500 transition-colors duration-200'>
                                    On Your PC
                                    <Laptop2 className='absolute opacity-20 text-neutral-500 top-6 right-6 h-10 w-10 sm:h-12 sm:w-12 stroke-2 group-hover:opacity-100 group-hover:text-pink-500 transition-all duration-200' />
                                </CardTitle>
                                <CardDescription>
                                    Xbox App for Windows
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    The Xbox App for Windows lets you save your
                                    screenshots to your PC.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </PageSection>
            </div> */}
        </>
    )
}

export default ScreenshotsXbox
