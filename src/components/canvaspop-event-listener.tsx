/**
 * Canvaspop Cart Window Event Listener
 *
 * @link https://developers.canvaspop.com/documentation/features#events
 *
 * This script listens for events from the Canvaspop Cart window.
 *
 * Events available are:
 *
 * - appPageLoaded--cart
 * - appPageLoaded--checkout
 * - appPageLoaded--receipt
 * - appOrderComplete
 * - appErrorCouldNotUpdateAttributes
 * - appErrorFatal--camelCasedExceptionMessage
 *
 * - userClickedCartContinue -- [args: { width, height, frame, edge, price}]
 * - userClickedShippingContinue
 * - userClickedShippingMethodContinue
 * - userClickedShippingEdit
 * - userClickedShippingMethodEdit
 * - userSetBillingSameAsShipping
 * - userSetBillingDifferentFromShipping
 * - userChangedBillingCountry
 * - userChangedShippingCountry
 * - userClickedCheckoutComplete
 * - userChangedProduct -- [product slugs: { PO: poster, S: canvas, FP: framed print }]
 * - userChangedSize -- [args: { width, height }]
 * - userChangedEdge -- [edge slugs: { NOMA: no mat, 250MA, 2" mat }]
 * - userChangedFrame -- [frame slugs: { WF: white frame, EF: espresso frame, BF: black frame }]
 * - userCancelStore
 */

import { useState } from 'react'

// type ProductType = 'PO' | 'S' | 'FP'
// type ProductFrame = 'WF' | 'EF' | 'BG' | '075DW' | '150DW'
// type ProductEdge = 'NOMA' | '250MA'

// Create slug value lookup maps
const productTypeSlugs = {
    PO: 'poster',
    S: 'canvas',
    FP: 'framed print'
}

const productFrameSlugs = {
    WF: 'white frame',
    EF: 'espresso frame',
    BF: 'black frame',
    '075DW': '0.75" depth', // Canvas depth
    '150DW': '1.5" depth' // Canvas depth
}

const productEdgeSlugs = {
    NOMA: 'no mat',
    '250MA': '2" mat'
}

/**
 * FIXME:
 * - Get default values from the Canvaspop Cart iframe controls
 * - Handle frame and edge data on product changes
 */
const CanvasPopCartEventListener = () => {
    // Create state for handling event data to monitor
    const [productWidth, setProductWidth] = useState<number | null>(null)
    const [productHeight, setProductHeight] = useState<number | null>(null)
    const [productType, setProductType] = useState<'PO' | 'S' | 'FP' | null>(
        null
    )

    const [productFrame, setProductFrame] = useState<
        'WF' | 'EF' | 'BG' | '075DW' | '150DW' | null
    >(null)

    const [productEdge, setProductEdge] = useState<'NOMA' | '250MA' | null>(
        null
    )

    const [productPrice, setProductPrice] = useState<number | null>(null)

    // Specify the ID of the Canvaspop Cart iframe
    const cartWindowID = 'canvaspop-cart-iframe'

    // Get the Canvaspop Cart iframe
    const cartWindow = document.getElementById(
        cartWindowID
    ) as HTMLIFrameElement

    // Bail if the iframe doesn't exist
    if (!cartWindow) {
        // Might want to handle this case appropriately
        console.warn(`Iframe with ID '${cartWindowID}' not found.`)
    } else {
        // Listen for events from the Canvaspop Cart iframe
        window.addEventListener('message', (event) => {
            // Ignore events outside of Canvaspop Cart or untrusted events
            if (event.source !== cartWindow.contentWindow || !event.isTrusted) {
                return
            }

            try {
                // Parse the event data
                const eventData = JSON.parse(event.data)

                // Debug
                // console.log(
                //     '🦄 ~ file: canvaspop-event-listener.tsx ~ window.addEventListener ~ eventData:',
                //     eventData
                // )

                // Pluck the event name from the event data
                const { event: eventType, args: eventArgs = null } = eventData

                // Thorw an error if the event type is fatal
                if (eventType.startsWith('appErrorFatal--')) {
                    throw new Error(
                        `Fatal error: ${eventType} - ${eventArgs.message}`
                    )
                }

                // Handle the events
                switch (eventType) {
                    /**
                     * Errors
                     */

                    // Error condition where the attributes for a customer's print could not be updated
                    case 'appErrorCouldNotUpdateAttributes':
                        console.error(
                            '🚨 appErrorCouldNotUpdateAttributes',
                            eventData
                        )
                        break

                    /**
                     * Page loads
                     */
                    // Initial store/cart page loaded successfully
                    case 'appPageLoaded--cart':
                        // console.info('⭐️ appPageLoaded--cart', eventData)
                        break

                    // User chose a size, frame and edge option and loaded the checkout page successfully
                    case 'appPageLoaded--checkout':
                        // console.info('⭐️ appPageLoaded--checkout', eventData)
                        break

                    // User completed checkout and viewed receipt page
                    case 'appPageLoaded--receipt':
                        // console.info('⭐️ appPageLoaded--receipt', eventData)
                        break

                    /**
                     * User actions
                     */
                    // User clicked continue from initial cart page
                    case 'userClickedCartContinue':
                        // console.info('⭐️ userClickedCartContinue', eventArgs)
                        // Update all product data
                        setProductWidth(eventArgs.width)
                        setProductHeight(eventArgs.height)
                        // setProductType(eventArgs.product)
                        setProductFrame(eventArgs.frame)
                        setProductEdge(eventArgs.edge)
                        setProductPrice(eventArgs.price)
                        break

                    // User clicked on Continue button on shipping tab
                    case 'userClickedShippingContinue':
                        // console.info('⭐️ userClickedShippingContinue', eventArgs)
                        break

                    // User clicked continue on the shipping method tab
                    case 'userClickedShippingMethodContinue':
                        // console.info('⭐️ userClickedShippingMethodContinue', eventArgs)
                        break

                    // User clicked the edit button to go back to view/change their shipping information
                    case 'userClickedShippingEdit':
                        // console.info('⭐️ userClickedShippingEdit', eventArgs)
                        break

                    // User clicked the edit button to go back to view/change their shipping method
                    case 'userClickedShippingMethodEdit':
                        // console.info('⭐️ userClickedShippingMethodEdit', eventArgs)
                        break

                    // User clicked on option to set billing address the same as shipping address
                    case 'userSetBillingSameAsShipping':
                        // console.info('⭐️ userSetBillingSameAsShipping', eventArgs)
                        break

                    // User set billing address from shipping address
                    case 'userSetBillingDifferentFromShipping':
                        // console.info('⭐️ userSetBillingDifferentFromShipping', eventArgs)
                        break

                    // User changed billing country from drop down menu
                    case 'userChangedBillingCountry':
                        // console.info('⭐️ userChangedBillingCountry', eventArgs)
                        break

                    // User clicked on checkout button to complete checkout
                    case 'userClickedCheckoutComplete':
                        // console.info('⭐️ userClickedCheckoutComplete', eventArgs)
                        break

                    // User changed shipping country from drop down menu
                    case 'userChangedShippingCountry':
                        // console.info('⭐️ userChangedShippingCountry', eventArgs)
                        break

                    // User changed product option from drop down menu
                    case 'userChangedProduct':
                        // console.info('⭐️ userChangedProduct', eventArgs)
                        // Update the product type
                        setProductType(eventArgs.slug)
                        break

                    // User changed product size option from drop down menu
                    case 'userChangedSize':
                        // console.info('⭐️ userChangedSize', eventArgs)
                        // Update the product width and height
                        setProductWidth(eventArgs.width)
                        setProductHeight(eventArgs.height)
                        break

                    // User changed edge option from drop down menu
                    case 'userChangedEdge':
                        // console.info('⭐️ userChangedEdge', eventArgs)
                        // Update the product edge
                        setProductEdge(eventArgs.slug)
                        break

                    // User changed frame option from drop down menu
                    case 'userChangedFrame':
                        // console.info('⭐️ userChangedFrame', eventArgs)
                        // Update the product frame
                        setProductFrame(eventArgs.slug)
                        break

                    // User clicked on the close store button
                    case 'userCancelStore':
                        // console.info('⭐️ userCancelStore', eventArgs)
                        break

                    /**
                     * Completions
                     */
                    case 'appOrderComplete':
                        // console.info('⭐️ appOrderComplete', eventArgs)
                        break
                }
            } catch (error) {
                let message = 'Something went wrong.'
                if (error instanceof Error) message = error.message
                console.error(message, error)
            } finally {
                // console.log('State:', {
                //     productWidth,
                //     productHeight,
                //     productType,
                //     productFrame,
                //     productEdge,
                //     productPrice
                // })
            }
        })
    }

    return null
}

export default CanvasPopCartEventListener
