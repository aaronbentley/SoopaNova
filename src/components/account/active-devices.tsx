'use client'

import {
    AccountRow,
    AccountSection
} from '@/components/account/account-section'
import {
    runAccountAction,
    useReverified
} from '@/components/account/reverification-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession, useUser } from '@clerk/nextjs'
import type { SessionWithActivitiesResource } from '@clerk/nextjs/types'
import { formatDistanceToNow } from 'date-fns'
import { Monitor, Smartphone } from 'lucide-react'
import { useEffect, useState } from 'react'

/**
 * Devices signed in to this account, with sign out for the others
 */
const ActiveDevices = () => {
    const { user } = useUser()
    const { session: currentSession } = useSession()
    const [sessions, setSessions] = useState<
        SessionWithActivitiesResource[] | null
    >(null)

    const revokeSession = useReverified(
        (session: SessionWithActivitiesResource) => session.revoke()
    )

    /**
     * Bumped to reload the list after signing a device out
     */
    const [reloads, setReloads] = useState(0)
    const currentSessionId = currentSession?.id

    useEffect(() => {
        if (!user) return

        let active = true

        user.getSessions().then((all) => {
            if (!active) return

            /**
             * This device first, then most recently active
             */
            setSessions(
                all.sort(
                    (a, b) =>
                        Number(b.id === currentSessionId) -
                            Number(a.id === currentSessionId) ||
                        b.lastActiveAt.getTime() - a.lastActiveAt.getTime()
                )
            )
        })

        return () => {
            active = false
        }
    }, [currentSessionId, reloads, user])

    if (!user) return null

    return (
        <AccountSection
            title='Active devices'
            description='Where you’re signed in. Sign out anywhere you don’t recognise.'>
            {!sessions && (
                <AccountRow>
                    <Skeleton className='h-10 w-full' />
                </AccountRow>
            )}
            {sessions?.map((session) => {
                const activity = session.latestActivity
                const isCurrent = session.id === currentSessionId
                const DeviceIcon = activity?.isMobile ? Smartphone : Monitor
                const browser = [
                    activity?.browserName,
                    activity?.browserVersion
                ]
                    .filter(Boolean)
                    .join(' ')
                const place = [activity?.city, activity?.country]
                    .filter(Boolean)
                    .join(', ')

                return (
                    <AccountRow key={session.id}>
                        <DeviceIcon className='size-5 text-muted-foreground' />
                        <div className='flex min-w-0 flex-1 flex-col'>
                            <span className='text-sm font-medium'>
                                {activity?.deviceType || browser || 'Device'}
                            </span>
                            <span className='truncate text-xs text-muted-foreground'>
                                {[
                                    activity?.deviceType && browser,
                                    place,
                                    `active ${formatDistanceToNow(session.lastActiveAt, { addSuffix: true })}`
                                ]
                                    .filter(Boolean)
                                    .join(' · ')}
                            </span>
                        </div>
                        {isCurrent ? (
                            <Badge variant='outline'>This device</Badge>
                        ) : (
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() =>
                                    runAccountAction(async () => {
                                        await revokeSession(session)
                                        setReloads((count) => count + 1)
                                    }, 'Signed out of that device')
                                }>
                                Sign out
                            </Button>
                        )}
                    </AccountRow>
                )
            })}
        </AccountSection>
    )
}

export default ActiveDevices
