import { lighten } from '@theme-ui/color'

export default {
    breakpoints: ['40em', '52em', '64em'],
    colors: {
        text: '#fff',
        background: '#1d2424',
        primary: '#c0c',
        secondary: '##11e',
        highlight: '#e0e',
        muted: '#f6f6ff',
        modes: {
            light: {
                text: '#1d2424',
                background: '#fff',
                primary: '#0fc',
                secondary: '#0cf',
                highlight: '#f0c',
                muted: '#011'
            }
        }
    },
    fonts: {
        body: 'system-ui, sans-serif',
        // body: '"Avenir Next", system-ui, sans-serif',
        heading: 'inherit',
        moonospace: 'Menlo, monospace'
    },
    fontWeights: {
        fine: 100,
        body: 400,
        heading: 600,
        bold: 700,
        black: 900
    },
    lineHeights: {
        body: 1.75,
        heading: 1.25
    },
    space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
    fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 96],
    radii: [0, 2, 4, 6, 8, 10, 12, 24],
    borders: [1, 2, 4, 6, 8, 10, 12],
    durations: ['0.15s', '0.30s', '0.45s', '1s'],
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
            fontWeight: 'fine'
        },
        body: {
            fontFamily: 'body',
            fontWeight: 'fine'
        }
    },
    forms: {
        label: {},
        input: {
            color: 'primary',
            textAlign: 'center',
            borderColor: 'highlight',
            p: 3,
            fontWeight: 'fine',
            backgroundColor: lighten('highlight', 0.4),
            '&::placeholder': {
                color: 'primary'
            }
        },
        radio: {
            color: 'secondary'
        }
    },
    buttons: {
        primary: {
            backgroundColor: 'primary',
            py: 3,
            px: 6,
            fontFamily: 'body',
            fontWeight: 'bold',
            ':hover': {
                backgroundColor: 'highlight'
            }
        }
    },
    spinner: {
        color: 'background'
    }
}
