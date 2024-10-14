'use client'
/**
 * Canvaspop Cart Window Event Listener
 *
 * @link https://developers.canvaspop.com/documentation/features#events
 *
 * This script listens for events from the Canvaspop Cart window.
 */
import { ProductEdge, ProductFrame, ProductType } from '@/types'
import { useUser } from '@clerk/nextjs'
import { track } from '@vercel/analytics'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const CanvasPopCartEventListener = () => {
    // Create state for handling event data to monitor
    const [productWidth, setProductWidth] = useState<number | null>(null)
    const [productHeight, setProductHeight] = useState<number | null>(null)
    const [productType, setProductType] = useState<ProductType>(null)
    const [productFrame, setProductFrame] = useState<ProductFrame>(null)
    const [productEdge, setProductEdge] = useState<ProductEdge>(null)
    const [productPrice, setProductPrice] = useState<number | null>(null)

    // Get the router
    const router = useRouter()

    // Get the user
    const { user } = useUser()

    /**
     * Call route handler to create the order in firestore db
     */
    const createOrder = async ({
        productType,
        productWidth,
        productHeight,
        productFrame,
        productEdge,
        productPrice
    }: {
        productType: ProductType
        productWidth: number | null
        productHeight: number | null
        productFrame: ProductFrame
        productEdge: ProductEdge
        productPrice: number | null
    }) => {
        try {
            const createOrderResponse = await fetch(
                '/api/firestore/create-order',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productType,
                        productWidth,
                        productHeight,
                        productFrame,
                        productEdge,
                        productPrice
                    })
                }
            )

            const createOrderResponseJson = await createOrderResponse.json()

            if (!createOrderResponseJson.ok) {
                throw new Error(
                    `Error creating order: ${createOrderResponseJson.message}`
                )
            }

            return createOrderResponseJson
        } catch (error) {
            console.error(error)
            let message = 'Something went wrong.'
            if (error instanceof Error) message = error.message
            console.error(message, error)
        }
    }

    /**
     * Attach event listener to the Canvaspop Cart iframe
     */
    useEffect(() => {
        /**
         * Create a listener for events from the Canvaspop Cart iframe
         */
        const listener = async (event: MessageEvent) => {
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
                // Ignore events outside of Canvaspop Cart or untrusted events
                if (
                    event.source !== cartWindow.contentWindow ||
                    !event.isTrusted
                ) {
                    return
                }

                // Bail if the user is not logged in
                if (!user) return null

                try {
                    // Debug
                    // console.log('🦄 RAW event:', event)

                    // Strip prefix '/*framebus*/' from event.data string if it exists
                    const data = event.data.replace('/*framebus*/', '')

                    // Parse the event data
                    const eventData = JSON.parse(data)

                    // Debug
                    // console.log('🦄 PARSED eventData:', eventData)

                    // Pluck the event name from the event data
                    const { event: eventType = null, args: eventArgs = null } =
                        eventData

                    // Thorw an error if the event type is fatal
                    if (
                        eventType !== null &&
                        eventType.startsWith('appErrorFatal--')
                    ) {
                        throw new Error(
                            `Fatal error: ${eventType} - ${eventArgs.message}`
                        )
                    }

                    // Handle the events
                    switch (eventType) {
                        /**
                         * Errors
                         */
                        //#region Error events
                        // Error condition where the attributes for a customer's print could not be updated
                        case 'appErrorCouldNotUpdateAttributes':
                            console.error(
                                '🚨 appErrorCouldNotUpdateAttributes',
                                eventData
                            )
                            break
                        //#endregion

                        /**
                         * Page loads
                         */
                        //#region Page load events
                        // Initial store/cart page loaded successfully
                        // case 'appPageLoaded--cart':
                        //     console.info('⭐️ appPageLoaded--cart', eventData)
                        //     break

                        // User chose a size, frame and edge option and loaded the checkout page successfully
                        // case 'appPageLoaded--checkout':
                        //     console.info(
                        //         '⭐️ appPageLoaded--checkout',
                        //         eventData
                        //     )
                        //     break

                        // User completed checkout and viewed receipt page
                        // case 'appPageLoaded--receipt':
                        //     console.info(
                        //         '⭐️ appPageLoaded--receipt',
                        //         eventData
                        //     )
                        //     break
                        //#endregion

                        /**
                         * User actions
                         */
                        //#region User action events
                        // User changed product option from drop down menu
                        case 'userChangedProduct':
                            // console.info('⭐️ userChangedProduct', eventArgs)

                            // Update the product type
                            setProductType(eventArgs.slug)

                            // Reset product attribues to default according to product type
                            switch (eventArgs.slug) {
                                // Poster
                                case 'PO':
                                    setProductFrame(null)
                                    setProductEdge(null)
                                    break
                                // Canvas
                                case 'S':
                                    setProductFrame('075DW')
                                    setProductEdge('WB')
                                    break
                                // Framed Print
                                case 'FP':
                                    setProductFrame('BF')
                                    setProductEdge('NOMA')
                                    break
                            }

                            break

                        // User changed product size option from drop down menu
                        case 'userChangedSize':
                            // console.info('⭐️ userChangedSize', eventArgs)

                            // Update the product width and height
                            setProductWidth(eventArgs.width)
                            setProductHeight(eventArgs.height)
                            break

                        // User changed frame option from drop down menu
                        case 'userChangedFrame':
                            // console.info('⭐️ userChangedFrame', eventArgs)

                            // Update the product frame
                            setProductFrame(eventArgs.slug)

                            /**
                             * Remove the edge option if the frame selection is:
                             * 'BF' (black wood)
                             * 'WF' (white wood)
                             */
                            if (['BF', 'WF'].includes(eventArgs.slug)) {
                                setProductEdge(null)
                            }

                            break

                        // User changed edge option from drop down menu
                        case 'userChangedEdge':
                            // console.info('⭐️ userChangedEdge', eventArgs)

                            // Update the product edge
                            setProductEdge(eventArgs.slug)
                            break

                        // User clicked continue from initial cart page
                        case 'userClickedCartContinue':
                            // console.info( '⭐️ userClickedCartContinue', eventArgs )

                            /**
                             * Deduce the product type from the frame and edge options as if a user returns to the cart page from the checkout page, the default product type [from last session] is not sent in the event data.
                             */
                            switch (true) {
                                // Set product type to 'poster' if no frame or edge is present
                                case eventArgs.frame === null &&
                                    eventArgs.edge === null:
                                    setProductType('PO')
                                    break
                                // Set product type to 'framed print' if the edge value is one of 'NOMA' or '250MA'
                                case ['NOMA', '250MA'].includes(eventArgs.edge):
                                    setProductType('FP')
                                    break
                                // Set product type to 'canvas' if previous conditions are not met
                                default:
                                    setProductType('S')
                                    break
                            }

                            // Update remaining product data attributes
                            setProductWidth(eventArgs.width)
                            setProductHeight(eventArgs.height)
                            setProductFrame(eventArgs.frame)
                            setProductEdge(eventArgs.edge)
                            setProductPrice(eventArgs.price)

                            break

                        // User clicked on Continue button on shipping tab
                        // case 'userClickedShippingContinue':
                        //     console.info(
                        //         '⭐️ userClickedShippingContinue',
                        //         eventArgs
                        //     )
                        //     break

                        // User clicked continue on the shipping method tab
                        // case 'userClickedShippingMethodContinue':
                        //     console.info(
                        //         '⭐️ userClickedShippingMethodContinue',
                        //         eventArgs
                        //     )
                        //     break

                        // User clicked the edit button to go back to view/change their shipping information
                        // case 'userClickedShippingEdit':
                        //     console.info(
                        //         '⭐️ userClickedShippingEdit',
                        //         eventArgs
                        //     )
                        //     break

                        // User clicked the edit button to go back to view/change their shipping method
                        // case 'userClickedShippingMethodEdit':
                        //     console.info(
                        //         '⭐️ userClickedShippingMethodEdit',
                        //         eventArgs
                        //     )
                        //     break

                        // User clicked on option to set billing address the same as shipping address
                        // case 'userSetBillingSameAsShipping':
                        //     console.info(
                        //         '⭐️ userSetBillingSameAsShipping',
                        //         eventArgs
                        //     )
                        //     break

                        // User set billing address from shipping address
                        // case 'userSetBillingDifferentFromShipping':
                        //     console.info(
                        //         '⭐️ userSetBillingDifferentFromShipping',
                        //         eventArgs
                        //     )
                        //     break

                        // User changed billing country from drop down menu
                        // case 'userChangedBillingCountry':
                        //     console.info(
                        //         '⭐️ userChangedBillingCountry',
                        //         eventArgs
                        //     )
                        //     break

                        // User clicked on checkout button to complete checkout
                        // case 'userClickedCheckoutComplete':
                        //     console.info(
                        //         '⭐️ userClickedCheckoutComplete',
                        //         eventArgs
                        //     )
                        //     break

                        // User changed shipping country from drop down menu
                        // case 'userChangedShippingCountry':
                        //     console.info(
                        //         '⭐️ userChangedShippingCountry',
                        //         eventArgs
                        //     )
                        //     break

                        // User clicked on the close store button
                        // case 'userCancelStore':
                        //     console.info('⭐️ userCancelStore', eventArgs)
                        //     break
                        //#endregion

                        /**
                         * Completions
                         */
                        //#region Completion events
                        // User has completed a purchase
                        case 'appOrderComplete':
                            // console.info('⭐️ appOrderComplete', eventArgs)

                            // console.info('📕 appOrderComplete State:', {
                            //     type: productType,
                            //     width: productWidth,
                            //     height: productHeight,
                            //     frame: productFrame,
                            //     edge: productEdge,
                            //     price: productPrice
                            // })

                            // Call route to create new order in firestore db
                            // console.info(
                            //     '⭐️ Sending order data to firestore...'
                            // )
                            const createOrderResponse = await createOrder({
                                productType,
                                productWidth,
                                productHeight,
                                productFrame,
                                productEdge,
                                productPrice
                            })

                            // console.log(
                            //     '🦄 ~ file: canvaspop-event-listener.tsx:404 ~ listener ~ createOrderResponse:',
                            //     createOrderResponse
                            // )

                            // Check createOrderResponse, reset state and redirect to orders page
                            if (createOrderResponse.ok === true) {
                                // Destrucure new order data the response
                                const {
                                    data: { orderId = '' }
                                } = createOrderResponse

                                setProductType(null)
                                setProductWidth(null)
                                setProductHeight(null)
                                setProductFrame(null)
                                setProductEdge(null)
                                setProductPrice(null)

                                track('print-order-completed', {
                                    userID: user.id,
                                    orderId
                                })

                                // Redirect to orders page with a 1 second delay, include order complete param
                                setTimeout(() => {
                                    router.push(
                                        `/orders/${user.id}/?orderId=${orderId}`
                                    )
                                }, 1000)
                            }

                            break
                        //#endregion
                    }
                } catch (error) {
                    let message = 'Something went wrong.'
                    if (error instanceof Error) message = error.message
                    console.error(message, error)
                }
            }
        }
        window.addEventListener('message', listener, true)
        // Clean up the event listener
        return () => {
            window.removeEventListener('message', listener)
        }
    }, [
        productEdge,
        productFrame,
        productHeight,
        productPrice,
        productType,
        productWidth,
        router,
        user
    ])

    // Debug

    if (process.env.NODE_ENV !== 'production') {
        console.info('📘 State:', {
            type: productType,
            width: productWidth,
            height: productHeight,
            frame: productFrame,
            edge: productEdge,
            price: productPrice
        })
    }

    return null
}

export default CanvasPopCartEventListener
