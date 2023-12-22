import { SteamIcon } from '@/components/brand-icons'
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
import { PcCaseIcon } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Steam Screenshots',
    description:
        'How to download your Steam screenshots, ready to create awesome prints.',
    alternates: {
        canonical: '/screenshots/steam/'
    }
}

const ScreenshotsSteam = () => {
    return (
        <>
            <div className='container'>
                <PageHeader>
                    <PageHeaderHeading>Steam Screenshots</PageHeaderHeading>
                    <PageHeaderDescription>
                        How to download your Steam screenshots, ready to create
                        awesome prints.
                    </PageHeaderDescription>
                    <div className='w-full grid md:grid-flow-dense md:grid-cols-3 gap-8 mt-12 md:mt-24'>
                        <ScrollToTarget target='steam-app'>
                            <Card className='bg-neutral-100 dark:bg-neutral-900 group transition-all duration-200 hover:border-pink-500 hover:dark:border-pink-500'>
                                <CardHeader className='relative'>
                                    <CardTitle className='group-hover:text-pink-500 transition-colors duration-200'>
                                        Steam App
                                        <SteamIcon className='absolute opacity-20 text-neutral-500 group-hover:fill-pink-500 transition-all duration-200 top-6 right-6 size-7 group-hover:opacity-100 stroke-1' />
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        </ScrollToTarget>
                        <ScrollToTarget target='file-system'>
                            <Card className='bg-neutral-100 dark:bg-neutral-900 group transition-all duration-200 hover:border-pink-500 hover:dark:border-pink-500'>
                                <CardHeader className='relative'>
                                    <CardTitle className='group-hover:text-pink-500 transition-colors duration-200'>
                                        File System
                                        <PcCaseIcon className='absolute opacity-20 text-neutral-500 group-hover:text-pink-500 transition-all duration-200 top-6 right-6 size-7 group-hover:opacity-100 stroke-1' />
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        </ScrollToTarget>
                    </div>
                </PageHeader>
            </div>

            <div className='container'>
                <PageSection id='steam-app'>
                    <PageSectionHeading>Steam App</PageSectionHeading>
                    <PageSectionDescription>
                        The Steam App provides an integrated system that
                        organizes and allows easy access to your captured
                        in-game moments.
                    </PageSectionDescription>

                    <Typography variant='ol'>
                        <Typography
                            variant='li'
                            className='font-extrabold'>
                            Open Steam:
                            <Typography
                                variant='ul'
                                className='font-normal'>
                                <Typography variant='li'>
                                    Open Steam on your device.
                                </Typography>
                                <Typography variant='li'>
                                    Click on{' '}
                                    <Typography variant='em'>
                                        &quot;View&quot;
                                    </Typography>{' '}
                                    on the menu bar, then{' '}
                                    <Typography variant='em'>
                                        &quot;Screenshots&quot;
                                    </Typography>{' '}
                                    from the drop-down menu.
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
                                    Click on the desired screenshot.
                                </Typography>
                                <Typography variant='li'>
                                    Click the{' '}
                                    <Typography variant='em'>
                                        &quot;Show on Disk&quot;
                                    </Typography>{' '}
                                    button to open the file explorer in the
                                    directory where the screenshot is stored.
                                </Typography>
                            </Typography>
                        </Typography>
                    </Typography>
                </PageSection>
            </div>

            <div className='container'>
                <PageSection id='file-system'>
                    <PageSectionHeading>File System</PageSectionHeading>
                    <PageSectionDescription>
                        To locate Steam screenshots via the file system, you can
                        navigate to the Steam folder where the screenshots are
                        stored.
                    </PageSectionDescription>

                    <Typography variant='ol'>
                        <Typography
                            variant='li'
                            className='font-extrabold'>
                            Open the Steam directory:
                            <Typography
                                variant='ul'
                                className='font-normal'>
                                <Typography variant='li'>
                                    Finding and opening Steam&apos;s
                                    installation directory depends on the
                                    operating system you&apos;re using:
                                    <Typography
                                        variant='ul'
                                        className='font-normal'>
                                        <Typography variant='li'>
                                            On Windows, the default is{' '}
                                            <Typography variant='em'>
                                                &quot;C:\Program Files
                                                (x86)\Steam&quot;
                                            </Typography>
                                            .
                                        </Typography>
                                        <Typography variant='li'>
                                            On a Mac, the default is{' '}
                                            <Typography variant='em'>
                                                &quot;Users/[your-mac-username]/Library/Application
                                                Support/Steam&quot;
                                            </Typography>
                                            .
                                        </Typography>
                                        <Typography variant='li'>
                                            On a Linux system, the default is
                                            <Typography variant='em'>
                                                &quot;
                                                ~/.local/share/Steam&quot;
                                            </Typography>
                                            .
                                        </Typography>
                                    </Typography>
                                </Typography>
                                <Typography variant='li'>
                                    If you have changed the default installation
                                    directory or customized your Steam settings,
                                    you may need to adjust the path accordingly.
                                </Typography>
                            </Typography>
                        </Typography>
                        <Typography
                            variant='li'
                            className='font-extrabold'>
                            Navigate to the Screenshots Folder:
                            <Typography
                                variant='ul'
                                className='font-normal'>
                                <Typography variant='li'>
                                    Within the Steam installation directory,
                                    look for a folder named{' '}
                                    <Typography variant='em'>
                                        &lsquo;userdata&rsquo;
                                    </Typography>
                                    . The exact path might vary based on your
                                    Steam account ID. Typically, it is found in
                                    a structure like:
                                    <br />
                                    <Typography variant='em'>
                                        &lsquo;userdata\[your-steam-ID]\760\remote\[app-ID]\screenshots&rsquo;
                                    </Typography>
                                    .
                                </Typography>
                                <Typography variant='li'>
                                    The{' '}
                                    <Typography variant='strong'>
                                        [your-steam-ID]
                                    </Typography>{' '}
                                    part will be a numerical value unique to
                                    your Steam account.
                                </Typography>
                                <Typography variant='li'>
                                    The{' '}
                                    <Typography variant='strong'>
                                        [app-ID]
                                    </Typography>{' '}
                                    is the application ID of the game for which
                                    you want to access screenshots. Each game on
                                    Steam has a unique ID.
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
                                    Inside the{' '}
                                    <Typography variant='em'>
                                        &lsquo;screenshots&rsquo;
                                    </Typography>{' '}
                                    folder, you should see subfolders named with
                                    numbers, each corresponding to a different
                                    game.
                                </Typography>
                                <Typography variant='li'>
                                    Locate the folder for the specific game
                                    you&apos;re interested in.
                                </Typography>
                                <Typography variant='li'>
                                    Inside the game&apos;s folder, you should
                                    see a list of all the screenshots for that
                                    game.
                                </Typography>
                            </Typography>
                        </Typography>
                    </Typography>
                </PageSection>
            </div>
        </>
    )
}

export default ScreenshotsSteam
