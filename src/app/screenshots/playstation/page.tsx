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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Info, UsbIcon } from 'lucide-react'
import { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => ({
    title: 'PlayStation - Screenshots',
    description:
        'How to get your PlayStation screenshots, ready to create awesome prints.',
    openGraph: {
        url: '/screenshots/playstation/'
    }
})

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
                    <div className='w-full grid md:grid-flow-dense sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 md:mt-24'>
                        <ScrollToTarget target='xbox-app'>
                            <Card className='bg-neutral-100 dark:bg-neutral-900 group transition-all duration-200 hover:border-pink-500 hover:dark:border-pink-500'>
                                <CardHeader className='relative'>
                                    <CardTitle className='group-hover:text-pink-500 transition-colors duration-200'>
                                        PlayStation App
                                        <PlaystationIcon className='absolute opacity-20 text-neutral-500 group-hover:fill-pink-500 transition-all duration-200 top-6 right-6 h-7 w-7 group-hover:opacity-100 stroke-1' />
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
                <PageSection>
                    <PageSectionHeading>PlayStation App</PageSectionHeading>
                    <PageSectionDescription>
                        The PlayStation App is a handy tool for managing your
                        PlayStation screenshots.
                    </PageSectionDescription>

                    <ol className='list-decimal list-inside space-y-2'>
                        <li className='font-extrabold'>
                            Install the PlayStation App:
                        </li>
                        <ul className='list-disc list-inside ps-4 space-y-2 mt-2 font-normal'>
                            <li>
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
                            </li>
                            <li>
                                Sign in with your PlayStation Network (PSN)
                                account.
                            </li>
                        </ul>
                        <li className='font-extrabold'>
                            Connect your console:
                        </li>
                        <ul className='list-disc list-inside ps-4 space-y-2 mt-2 font-normal'>
                            <li>
                                Ensure that your PlayStation console and your
                                device are connected to the same Wi-Fi network.
                            </li>
                            <li>
                                Open the PlayStation App and tap the{' '}
                                <em>&lsquo;Connect to PS4/PS5</em>&rsquo;
                                option.
                            </li>
                        </ul>
                        <li className='font-extrabold'>Access Screenshots:</li>
                        <ul className='list-disc list-inside ps-4 space-y-2 mt-2 font-normal'>
                            <li>
                                In the PlayStation App, select{' '}
                                <em>&lsquo;Library</em>&rsquo; from the menu
                                bar.
                            </li>
                            <li>
                                All your captured screenshots will be available
                                here.
                            </li>
                        </ul>
                    </ol>

                    <Alert className='w-max'>
                        <Info className='h-4 w-4' />
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
                    <ol className='list-decimal list-inside space-y-2'>
                        <li className='font-extrabold'>Prepare USB Drive:</li>
                        <ul className='list-disc list-inside ps-4 space-y-2 mt-2 font-normal'>
                            <li>
                                Insert a compatible USB stick into one of your
                                PlayStation&rsquo;s USB ports.
                            </li>
                        </ul>
                        <li className='font-extrabold'>Copy Screenshots:</li>
                        <ul className='list-disc list-inside ps-4 space-y-2 mt-2 font-normal'>
                            <li>
                                Navigate to the{' '}
                                <em>&lsquo;Capture Gallery&rsquo;</em> under the
                                system&rsquo;s capture settings.
                            </li>
                            <li>
                                Find the screenshots you want to transfer and
                                press the <em>&lsquo;Options&rsquo;</em> button
                                on your controller.
                            </li>
                            <li>
                                Choose{' '}
                                <em>
                                    &lsquo;Copy to USB Storage Device&rsquo;
                                </em>{' '}
                                and follow the on-screen prompts.
                            </li>
                        </ul>
                    </ol>
                </PageSection>
            </div>
        </>
    )
}

export default ScreenshotsPlaystation
