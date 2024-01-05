import { PlaystationIcon } from '@/components/brand-icons'
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Info, UsbIcon } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'PlayStation Screenshots',
    description:
        'How to download your PlayStation screenshots, ready to create awesome prints.',
    alternates: {
        canonical: '/screenshots/playstation/'
    }
}

const ScreenshotsPlaystation = () => {
    return (
        <>
            <div className='container'>
                <PageHeader>
                    <PageHeaderHeading>
                        PlayStation Screenshots
                    </PageHeaderHeading>
                    <PageHeaderDescription>
                        How to download your PlayStation screenshots, ready to
                        create awesome prints.
                    </PageHeaderDescription>
                    <div className='w-full grid md:grid-flow-dense md:grid-cols-3 gap-8 mt-12 md:mt-24'>
                        <ScrollToTarget target='xbox-app'>
                            <Card className='bg-neutral-100 dark:bg-neutral-900 group transition-all duration-200 hover:border-pink-500 hover:dark:border-pink-500'>
                                <CardHeader className='relative'>
                                    <CardTitle className='group-hover:text-pink-500 transition-colors duration-200'>
                                        PlayStation App
                                        <PlaystationIcon className='absolute opacity-20 text-neutral-500 group-hover:fill-pink-500 transition-all duration-200 top-6 right-6 size-7 group-hover:opacity-100 stroke-1' />
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        </ScrollToTarget>
                        <ScrollToTarget target='usb-drive'>
                            <Card className='bg-neutral-100 dark:bg-neutral-900 group transition-all duration-200 hover:border-pink-500 hover:dark:border-pink-500'>
                                <CardHeader className='relative'>
                                    <CardTitle className='group-hover:text-pink-500 transition-colors duration-200'>
                                        USB Drive
                                        <UsbIcon className='absolute opacity-20 text-neutral-500 group-hover:text-pink-500 transition-all duration-200 top-6 right-6 size-7 group-hover:opacity-100 stroke-1' />
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        </ScrollToTarget>
                    </div>
                </PageHeader>
            </div>

            <div className='container'>
                <PageSection>
                    <PageSectionHeading>PlayStation App</PageSectionHeading>
                    <PageSectionDescription>
                        The PlayStation App is a handy tool for managing your
                        PlayStation screenshots.
                    </PageSectionDescription>

                    <Typography variant='ol'>
                        <Typography
                            variant='li'
                            className='font-extrabold'>
                            Install the PlayStation App:
                            <Typography
                                variant='ul'
                                className='font-normal'>
                                <Typography variant='li'>
                                    Download the PlayStation App from your
                                    device&apos;s app store (
                                    <a
                                        href='https://apps.apple.com/us/app/playstation-app/id410896080'
                                        title='View PlayStation App on the App Store'
                                        target='_blank'
                                        className='font-medium text-primary underline underline-offset-4 transition-colors duration-200 hover:text-pink-500'>
                                        App Store
                                    </a>
                                    ,{' '}
                                    <a
                                        href='https://play.google.com/store/apps/details?id=com.scee.psxandroid'
                                        title='View PlayStation App on the Google Play Store'
                                        target='_blank'
                                        className='font-medium text-primary underline underline-offset-4 transition-colors duration-200 hover:text-pink-500'>
                                        Google Play Store
                                    </a>
                                    ).
                                </Typography>
                                <Typography variant='li'>
                                    Sign in with your PlayStation Network (PSN)
                                    account.
                                </Typography>
                            </Typography>
                        </Typography>
                        <Typography
                            variant='li'
                            className='font-extrabold'>
                            Connect your console:
                            <Typography
                                variant='ul'
                                className='font-normal'>
                                <Typography variant='li'>
                                    Ensure that your PlayStation console and
                                    your device are connected to the same Wi-Fi
                                    network.
                                </Typography>
                                <Typography variant='li'>
                                    Open the PlayStation App and tap the{' '}
                                    <Typography variant='em'>
                                        &lsquo;Connect to PS4/PS5&rsquo;
                                    </Typography>
                                    option.
                                </Typography>
                            </Typography>
                        </Typography>
                        <Typography
                            variant='li'
                            className='font-extrabold'>
                            Access screenshots:
                            <Typography
                                variant='ul'
                                className='font-normal'>
                                <Typography variant='li'>
                                    In the PlayStation App, select{' '}
                                    <Typography variant='em'>
                                        &lsquo;Library
                                    </Typography>
                                    &rsquo; from the menu bar.
                                </Typography>
                                <Typography variant='li'>
                                    All your captured screenshots will be
                                    available here.
                                </Typography>
                            </Typography>
                        </Typography>
                    </Typography>

                    <Alert className='w-max'>
                        <Info className='size-4' />
                        <AlertTitle>Heads up!</AlertTitle>
                        <AlertDescription>
                            Screenshots are available in the PlayStation App for
                            14 days after creation on your PS5 console.
                        </AlertDescription>
                        <AlertDescription>
                            Learn more more at{' '}
                            <a
                                href='https://www.playstation.com/en-gb/support/games/ps5-game-captures-ps-app/'
                                title='How to access PS5 game captures on PlayStation App'
                                target='_blank'
                                className='font-medium text-primary underline underline-offset-4 transition-colors duration-200 hover:text-pink-500'>
                                PlayStation.com
                            </a>
                            .
                        </AlertDescription>
                    </Alert>
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
                                    Insert a compatible USB stick into one of
                                    your PlayStation&rsquo;s USB ports.
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
                                    Navigate to the{' '}
                                    <Typography variant='em'>
                                        &lsquo;Capture Gallery&rsquo;
                                    </Typography>{' '}
                                    under the system&rsquo;s capture settings.
                                </Typography>
                                <Typography variant='li'>
                                    Find the screenshots you want to transfer
                                    and press the{' '}
                                    <Typography variant='em'>
                                        &lsquo;Options&rsquo;
                                    </Typography>{' '}
                                    button on your controller.
                                </Typography>
                                <Typography variant='li'>
                                    Choose{' '}
                                    <Typography variant='em'>
                                        &lsquo;Copy to USB Storage Device&rsquo;
                                    </Typography>{' '}
                                    and follow the on-screen prompts.
                                </Typography>
                            </Typography>
                        </Typography>
                    </Typography>
                </PageSection>
            </div>
        </>
    )
}

export default ScreenshotsPlaystation
