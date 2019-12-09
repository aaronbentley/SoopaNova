import { darken } from '@theme-ui/color'

export default {
    initialColorMode: 'system',
    breakpoints: ['40em', '52em', '64em'],
    colors: {
        // text: '#fff',
        text: '#E2DBDB',
        background: '#1d2424',
        primary: '#ca50b7',
        secondary: '#28c0e1',
        // secondary: '#64c0d0',
        highlight: '#e0e',
        // highlight: '#d2ae6b',
        muted: '#f6f6ff',
        grey: '#888888',
        modes: {
            light: {
                text: '#1d2424',
                background: '#E2DBDB'
            }
        }
    },
    fonts: {
        body: 'system-ui, sans-serif',
        heading: 'system-ui, sans-serif',
        moonospace: 'Menlo, monospace'
    },
    fontWeights: {
        fine: 900,
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
    fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 96, 128, 256],
    radii: [0, 2, 4, 6, 8, 10, 12, 24],
    borders: [1, 2, 4, 6, 8, 10, 12],
    durations: ['0.15s', '0.30s', '0.45s', '1s'],
    sizes: {
        container: '1200px',
        header: {
            button: '36px'
        }
    },
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
            color: 'primary',
            fontFamily: 'body',
            fontWeight: 'fine'
        },
        body: {
            fontFamily: 'body',
            fontWeight: 'fine'
        }
    },
    links: {
        logo: {
            textDecoration: 'none'
        }
    },
    forms: {
        label: {},
        input: {
            color: 'primary',
            textAlign: 'center',
            borderColor: 'highlight',
            p: 3,
            fontWeight: 'body',
            backgroundColor: 'muted',
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
            color: 'background',
            fontWeight: 'fine',
            bg: 'primary',
            '&:hover': {
                bg: darken('primary', 0.075)
            },
            ':focus': {
                outline: 'none'
            }
        },
        secondary: {
            variant: 'buttons.primary',
            color: 'background',
            bg: 'secondary',
            '&:hover': {
                bg: darken('secondary', 0.075)
            }
        },
        outline: {
            primary: {
                color: 'primary',
                bg: 'transparent',
                boxShadow: 'inset 0 0 0 1px',
                fontWeight: 'fine',
                '&:hover': {
                    color: 'background'
                },
                ':disabled': {
                    cursor: 'not-allowed',
                    // color: 'muted',
                    background: 'transparent',
                    opacity: 0.4,
                    color: 'text'
                }
            },
            secondary: {
                variant: 'buttons.outline.primary',
                color: 'secondary',
                '&:hover': {
                    bg: 'secondary',
                    color: 'background'
                }
            }
        }
    },
    spinner: {
        color: 'primary'
    },
    alerts: {
        primary: {
            color: 'background',
            bg: 'primary',
            borderLeftColor: 'secondary',
            borderLeftWidth: ({ space }) => space[2],
            borderLeftStyle: 'solid',
            fontFamily: 'body',
            fontWeight: 'fine',
            fontSize: 5
        },
        muted: {
            color: 'text',
            bg: 'muted'
        }
    }
}
