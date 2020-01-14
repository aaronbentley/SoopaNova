/** @jsx jsx */
/**
 * Stacks.io Aspect Ratio Spinner Loader
 *
 * @export AspectRatioSpinnerLoader
 */
import { AspectRatio, Spinner } from '@theme-ui/components'
import { jsx } from 'theme-ui'

export const AspectRatioSpinnerLoader = () => (
    <AspectRatio
        ratio={16 / 9}
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary'
        }}>
        <Spinner
            sx={{
                color: 'secondary'
            }}
        />
    </AspectRatio>
)
