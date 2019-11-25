/**
 * Async Xbox live Api
 *
 *
 */
import Cookies from 'js-cookie'
import Qs from 'qs'

// TODO:
// Use Context as cache?

export const convertToTimestamp = dateTime => {
    const date = new Date(dateTime)
    return Math.floor(date.getTime() / 1000)
}

export const parseCookies = cookie => {
    let cookies = ''

    cookie.forEach((ck, index) => {
        let a_cookie = Cookies.get(ck)
        const keys = Object.keys(a_cookie)
        const desiredKey = keys[0]
        const desiredValue = a_cookie[desiredKey]

        cookies += `${desiredKey}=${desiredValue}`

        if (index < cookie.length - 1) cookies += '; '
    })
    return cookies
}

export const fetchPreAuthData = async () => {
    let urlPost = null
    let ppft = null

    // cache solution to store the tokens in cache
    //  const cacheUrlPost = await xlaCache.get(
    //          'url_post'
    //      ),
    //      cachePpftRe = await xlaCache.get(
    //          'ppft_re'
    //      )
    //  if (cacheUrlPost.value)
    //      url_post = cacheUrlPost.value
    //  if (cachePpftRe.value)
    //      ppft_re = cachePpftRe.value

    const postVals = {
        client_id: '0000000048093EE3',
        redirect_uri: 'https://login.live.com/oauth20_desktop.srf',
        response_type: 'token',
        display: 'touch',
        scope: 'service::user.auth.xboxlive.com::MBI_SSL',
        locale: 'en'
    }

    const postValsQs = unescape(Qs.stringify(postVals))

    const options = {
        uri: 'https://login.live.com' + '/oauth20_authorize.srf?' + postValsQs,
        resolveWithFullResponse: true,
        headers: {
            host: 'login.live.com'
        }
    }
}
