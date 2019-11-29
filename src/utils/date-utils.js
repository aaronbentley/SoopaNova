/**
 * Stacks.io Date Utilities
 *
 */
import { format, parseISO } from 'date-fns'
// import { format } from 'date-fns'

export const formatDate = (date = '') => {
    // const parsedDate = parse(date)
    const parsedDate = parseISO(date, 'yyyy-MM-dd', new Date())
    // 2019-07-20T17:59:19Z
    return format(parsedDate, 'EEEE, d MMMM Y')
}
