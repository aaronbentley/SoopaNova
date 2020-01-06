/** @jsx jsx */
/**
 * Stacks.io Lazy Placeholder
 *
 * @export LazyPlaceholder
 */
import { jsx, useThemeUI } from 'theme-ui'
import LazyPlaceholderSVG from '../../assets/lazy-placeholder.svg'

export const LazyPlaceholder = () => {
    const context = useThemeUI()
    const {
        theme: { colors = {} }
    } = context

    return <LazyPlaceholderSVG sx={{ fill: colors.primary }} />
}
