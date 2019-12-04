/**
 * Stacks.io Data Utilities
 *
 */
import filesize from 'filesize'

export const formatMegabytes = (bytes = 0) => {
    const megabytes = filesize(bytes, { base: 10, round: 1 })
    return megabytes
}
