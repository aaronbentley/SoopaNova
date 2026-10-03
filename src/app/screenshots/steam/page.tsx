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
            <div>
                <PageHeader eyebrow='Screenshots'>
                    <PageHeaderHeading>Steam</PageHeaderHeading>
                    <PageHeaderDescription>
                        How to download your Steam screenshots, ready to create
                        awesome prints.
                    </PageHeaderDescription>
                    <PlatformStrip className='mt-6 w-full overflow-hidden rounded-xl border bg-background'>
                        <PlatformTile
                            href='#steam-app'
                            name='Steam app'
                            className='px-6'
                        />
                        <PlatformTile
                            href='#file-system'
                            name='File system'
                            className='px-6'
                        />
                    </PlatformStrip>
                </PageHeader>
            </div>

            <div>
                <PageSection id='steam-app'>
                    <PageSectionHeading>Steam app</PageSectionHeading>
                    <PageSectionDescription>
                        The Steam app provides an integrated system that
                        organizes and allows easy access to your captured
                        in-game moments.
                    </PageSectionDescription>

                    <Typography variant='ol'>
                        <Typography
                            variant='li'
                            className='font-semibold text-foreground'>
                            Open Steam:
                            <Typography
                                variant='ul'
                                className='font-normal text-muted-foreground'>
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
                            className='font-semibold text-foreground'>
                            Access screenshots:
                            <Typography
                                variant='ul'
                                className='font-normal text-muted-foreground'>
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

            <div>
                <PageSection id='file-system'>
                    <PageSectionHeading>File system</PageSectionHeading>
                    <PageSectionDescription>
                        To locate Steam screenshots via the file system, you can
                        navigate to the Steam folder where the screenshots are
                        stored.
                    </PageSectionDescription>

                    <Typography variant='ol'>
                        <Typography
                            variant='li'
                            className='font-semibold text-foreground'>
                            Open the Steam directory:
                            <Typography
                                variant='ul'
                                className='font-normal text-muted-foreground'>
                                <Typography variant='li'>
                                    Finding and opening Steam&apos;s
                                    installation directory depends on the
                                    operating system you&apos;re using:
                                    <Typography
                                        variant='ul'
                                        className='font-normal text-muted-foreground'>
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
                            className='font-semibold text-foreground'>
                            Go to the screenshots folder:
                            <Typography
                                variant='ul'
                                className='font-normal text-muted-foreground'>
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
                            className='font-semibold text-foreground'>
                            Access screenshots:
                            <Typography
                                variant='ul'
                                className='font-normal text-muted-foreground'>
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
