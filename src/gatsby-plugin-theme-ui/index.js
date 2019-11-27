import { lighten } from '@theme-ui/color'

export default {
    breakpoints: ['40em', '52em', '64em'],
    colors: {
        text: '#fff',
        background: '#0e1111',
        primary: '#11e',
        secondary: '#c0c',
        highlight: '#e0e',
        muted: '#f6f6ff',
        modes: {
            light: {
                text: '#0e1111',
                background: '#fff',
                primary: '#0fc',
                secondary: '#0cf',
                highlight: '#f0c',
                muted: '#011'
            }
        }
    },
    fonts: {
        body: '"Avenir Next", system-ui, sans-serif',
        heading: 'inherit',
        moonospace: 'Menlo, monospace'
    },
    fontWeights: {
        body: 400,
        heading: 600,
        bold: 700
    },
    lineHeights: {
        body: 1.75,
        heading: 1.25
    },
    space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
    fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 96],
    radii: [0, 2, 4, 6, 8, 10, 12, 24],
    styles: {
        root: {
            fontFamily: 'body',
            lineHeight: 'body',
            fontWeight: 'body'
        },
        h1: {
            color: 'text',
            fontFamily: 'heading',
            lineHeight: 'heading',
            fontWeight: 'heading',
            fontSize: 5
        },
        h2: {
            color: 'text',
            fontFamily: 'heading',
            lineHeight: 'heading',
            fontWeight: 'heading',
            fontSize: 4
        },
        h3: {
            color: 'text',
            fontFamily: 'heading',
            lineHeight: 'heading',
            fontWeight: 'heading',
            fontSize: 3
        },
        h4: {
            color: 'text',
            fontFamily: 'heading',
            lineHeight: 'heading',
            fontWeight: 'heading',
            fontSize: 2
        },
        h5: {
            color: 'text',
            fontFamily: 'heading',
            lineHeight: 'heading',
            fontWeight: 'heading',
            fontSize: 1
        },
        h6: {
            color: 'text',
            fontFamily: 'heading',
            lineHeight: 'heading',
            fontWeight: 'heading',
            fontSize: 0
        },
        p: {
            color: 'text',
            fontFamily: 'body',
            fontWeight: 'body',
            lineHeight: 'body'
        },
        a: {
            color: 'primary'
        },
        pre: {
            fontFamily: 'monospace',
            overflowX: 'auto',
            code: {
                color: 'inherit'
            }
        },
        code: {
            fontFamily: 'monospace',
            fontSize: 'inherit'
        },
        table: {
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: 0
        },
        th: {
            textAlign: 'left',
            borderBottomStyle: 'solid'
        },
        td: {
            textAlign: 'left',
            borderBottomStyle: 'solid'
        },
        img: {
            maxWidth: '100%'
        }
    },
    // variants
    text: {
        heading: {
            color: 'highlight',
            fontFamily: 'body',
            fontWeight: 'body'
        }
    },
    forms: {
        label: {},
        input: {
            color: 'primary',
            textAlign: 'center',
            borderColor: 'highlight',
            p: 3,
            backgroundColor: lighten('highlight', 0.4)
        }
    },
    buttons: {
        primary: {
            backgroundColor: 'highlight',
            py: 3,
            px: 6,
            ':hover': {
                backgroundColor: 'secondary'
            }
        }
    }
}
