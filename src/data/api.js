import axios from 'axios'
import path from 'path'
import { XBOX_LIVE_DOMAINS } from './domains'
import { BASE_HEADERS } from './headers'

export const getUser = async gamertag => {
    try {
        const foo =
            XBOX_LIVE_DOMAINS.profile +
            path.join(
                'users',
                `gt(${encodeURIComponent(gamertag)})`,
                'settings'
            )

        console.log(foo)
        const uri = `${XBOX_LIVE_DOMAINS.profile}users/gt(${encodeURIComponent(
            gamertag
        )})/settings`
        console.log(uri)

        const response = await axios.get(
            uri,
            // {
            //     headers: {
            //         ...BASE_HEADERS,
            //         ...{
            //             'x-xbl-contract-version': 2,
            //             Authorization: `XBL3.0 x=${'userHash'};${'XSTSToken'}`
            //         }
            //     }
            // }
            {
                headers: Object.assign({}, BASE_HEADERS, {
                    'x-xbl-contract-version': 2,
                    Authorization: `XBL3.0 x=${'userHash'};${'XSTSToken'}`
                })
            }
        )
        // console.log({ response })
        return response
    } catch (error) {}
}
