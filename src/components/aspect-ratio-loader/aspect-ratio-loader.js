/** @jsx jsx */
/**
 * Stacks.io Aspect Ratio Loader
 *
 * @export LazyPlaceholder
 */
import { Image } from '@theme-ui/components'
import { jsx } from 'theme-ui'
import LazyPlaceholderSVG from '../../assets/lazy-placeholder.svg'

// export const AspectRatioLoader = () => {
//     return (
//         <AspectRatio
//             ratio={16 / 9}
//             sx={{
//                 position: 'relative',
//                 p: 0,
//                 m: 0,
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 color: 'background',
//                 bg: '#f0953f',
//                 label: 'AspectRatioLoader'
//             }}>
//             <Box>
//                 <Image src={LazyPlaceholderSVG} />
//             </Box>
//         </AspectRatio>
//     )
// }

export const AspectRatioLoader = () => <Image src={LazyPlaceholderSVG} />
