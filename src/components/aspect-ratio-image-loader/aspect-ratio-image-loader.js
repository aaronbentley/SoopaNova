/** @jsx jsx */
/**
 * Stacks.io Aspect Ratio Image Loader
 *
 * @export AspectRatioImageLoader
 */
import { Image } from '@theme-ui/components'
import { jsx } from 'theme-ui'
import LazyPlaceholderSVG from '../../assets/lazy-placeholder.svg'

export const AspectRatioImageLoader = () => <Image src={LazyPlaceholderSVG} />
