/**
 * Stacks.io Metadata Hook
 *
 * @export useOnClickOutside
 */
import { useEffect } from 'react'

export const useOnClickOutside = (ref, handler) => {
    useEffect(() => {
        const listener = event => {
            // Do nothing if clicking ref's element or descendent elements
            if (!ref.current || ref.current.contains(event.target)) {
                return
            }
            handler(event)
        }
        document.addEventListener('mousedown', listener)
        document.addEventListener('touchstart', listener)

        // Cleanup event listeners
        return () => {
            document.removeEventListener('mousedown', listener)
            document.removeEventListener('touchstart', listener)
        }
    }, [handler, ref])
}
