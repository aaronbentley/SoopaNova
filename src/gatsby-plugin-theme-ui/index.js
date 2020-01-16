import { darken } from '@theme-ui/color'

export default {
    useCustomProperties: true,
    useColorSchemeMediaQuery: true,
    initialColorMode: 'dark',
    breakpoints: ['40em', '52em', '64em'],
    colors: {
        text: '#E2DBDB',
        background: '#1d2424',
        primary: '#ca50b7',
        secondary: '#28c0e1',
        highlight: '#f0953f',
        muted: '#f6f6ff',
        grey: '#888888',
        black: '#333333',
        error: '#ff0033',
        modes: {
            light: {
                primary: '#f0953f',
                secondary: '#ca50b7',
                highlight: '#28c0e1',
                text: '#1d2424',
                background: '#E2DBDB'
            },
            tribute: {
                primary: '#b088ff',
                secondary: '#eb88ff',
                highlight: '#574b70',
                background: '#1c1f2e'
            },
            elsa: {
                primary: '#28c0e1',
                secondary: '#55d8f6',
                highlight: '#F47DA5',
                background: '#e5e5ff',
                text: '#1d2424'
            }
        }
    },
    fonts: {
        body: 'system-ui, sans-serif',
        heading: 'system-ui, sans-serif',
        moonospace: 'Menlo, monospace'
    },
    fontWeights: {
        fine: 200,
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
    radii: [0, 2, 4, 6, 8, 10, 12, 24, 99],
    borders: [1, 2, 4, 6, 8, 10, 12],
    durations: ['0.15s', '0.30s', '0.45s', '1s'],
    zIndices: [0, 1, 2, 3, 4, 5],
    scales: [1, 1.07, 1.15, 1.3, 1.6],
    sizes: {
        header: {
            button: '36px'
        }
    },
    // Base Styles (Markdown)
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
    layout: {
        container: {
            maxWidth: '1600px'
        }
    },
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
        },
        footer: {
            textDecoration: 'none',
            color: 'primary',
            fontFamily: 'body',
            fontWeight: 'fine',
            '&:hover': {
                color: darken('primary', 0.075)
            }
        },
        '404': {
            variant: 'buttons.outline.primary'
        }
    },
    forms: {
        label: {
            fontFamily: 'body',
            lineHeight: 'body',
            fontWeight: 'fine',
            width: 'auto',
            px: 3,
            svg: {
                marginTop: 1
            }
        },
        input: {
            caretColor: ({ colors }) => colors.primary,
            color: 'primary',
            textAlign: 'center',
            borderColor: 'primary',
            borderWidth: 2,
            p: 3,
            fontWeight: 'body',
            backgroundColor: 'background',
            '&::placeholder': {
                color: 'primary',
                opacity: 0.6
            },
            ':focus': {
                outline: 'none'
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
            transition: ({ durations }) =>
                `background-color ${durations[1]} ease`,
            '&:hover': {
                backgroundColor: darken('primary', 0.075)
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
                transition: ({ durations }) =>
                    `background-color ${durations[1]} ease`,
                '&:hover': {
                    color: 'background'
                },
                ':disabled': {
                    cursor: 'not-allowed',
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
        },
        naked: {
            variant: 'buttons.outline.primary',
            boxShadow: 'none',
            '&:hover': {
                background: 'transparent',
                boxShadow: 'inset 0 0 0 1px'
            }
        },
        dropdown: {
            fontFamily: 'body',
            fontWeight: 'fine',
            cursor: 'pointer',
            display: 'flex',
            width: '100%',
            px: 1,
            py: 2,
            borderRadius: 3,
            ':hover': {
                color: 'white'
            },
            ':disabled': {
                opacity: 0.4,
                cursor: 'not-allowed'
            }
        }
    },
    spinner: {
        color: 'primary'
    },
    alerts: {
        base: {
            color: 'text',
            fontFamily: 'body',
            fontWeight: 'fine',
            px: 3,
            py: 2,
            fontSize: 4
        },
        primary: {
            variant: 'alerts.base',
            bg: 'primary'
        },
        secondary: {
            variant: 'alerts.base',
            bg: 'secondary'
        },
        error: {
            variant: 'alerts.base',
            color: 'muted',
            bg: 'error'
        }
    }
}
