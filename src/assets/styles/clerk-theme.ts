/**
 * Compose common Clerk theme styles
 */
const defaultTypography = ['text-neutral-950', 'dark:text-neutral-50']
const mutedTypography = ['text-neutral-900', 'dark:text-neutral-100']
const primaryTypography = ['text-pink-500', 'dark:text-pink-500']

const defaultBackground = ['bg-neutral-50', 'dark:bg-neutral-950']
const primaryMutedBackground = ['bg-pink-500/25', 'dark:bg-pink-500/25']

const defaultBorder = ['border-neutral-200', 'dark:border-neutral-800']

const primaryButton = [
    'bg-pink-500',
    'dark:bg-pink-500',
    'hover:bg-pink-500/90',
    'dark:hover:bg-pink-500/90',
    'capitalize'
]

const ghostButton = [
    ...mutedTypography,
    'bg-transparent',
    'hover:bg-neutral-200',
    'dark:hover:bg-neutral-800',
    'capitalize'
]

const primaryHover = ['hover:bg-pink-500/25', 'dark:hover:bg-pink-500/25']

const defaultInput = [
    'text-neutral-900',
    'dark:text-neutral-100',
    'rounded-md',
    'border',
    'border-neutral-200',
    'bg-white',
    'px-3',
    'py-2',
    'text-sm',
    'ring-offset-white',
    'placeholder:text-neutral-500',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-pink-500',
    'focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',
    'dark:border-neutral-800',
    'dark:bg-neutral-950',
    'dark:ring-offset-neutral-950',
    'dark:placeholder:text-neutral-400',
    'dark:focus-visible:ring-pink-500',
    'accent-pink-500',
    'focus:shadow-[0_0_0_1px_#ec4899]'
]

const defaultPopoverActionButton = [
    'hover:bg-pink-500/25',
    'dark:hover:bg-pink-500/25'
]

/**
 * Compose Clerk theme styles for Provider appearance prop
 */
export const clerkTheme = {
    elements: {
        //#region UserButton
        userButtonTrigger: ['focus:shadow-[0_0_0_3px_rgba(236,72,153,1)]'].join(
            ' '
        ),
        userButtonPopoverCard: [
            ...defaultBackground,
            ...defaultTypography
        ].join(' '),
        userButtonPopoverActionButton: [...defaultPopoverActionButton].join(
            ' '
        ),
        userButtonPopoverActionButtonText: [...mutedTypography].join(' '),
        userButtonPopoverActionButtonIcon: [...primaryTypography].join(' '),
        userButtonPopoverFooter: [
            '[&_p]:text-neutral-500',
            '[&_p]:dark:text-neutral-500',
            '[&_svg]:text-neutral-500',
            '[&_svg]:dark:text-neutral-500',
            '[&_svg]:hover:text-pink-500',
            '[&_svg]:dark:hover:text-pink-500',
            '[&_*]:transition-all',
            '[&_*]:duration-2000'
        ].join(' '),
        //#endregion

        //#region Page
        page: [
            ...mutedTypography,
            '[&_p]:text-neutral-900',
            '[&_p]:dark:text-neutral-100',

            '[&_button[id="google"]]:text-neutral-900',
            '[&_button[id="google"]]:dark:text-neutral-100',
            '[&_button[id="google"]]:border-neutral-200',
            '[&_button[id="google"]]:dark:border-neutral-800',
            '[&_button:focus[id="google"]]:bg-pink-500/25',
            '[&_button:focus[id="google"]]:shadow-[0_0_0_3px_rgba(236,72,153,0.75)]',
            '[&_button:focus[id="google"]>svg]:text-pink-500',
            '[&_button:hover[id="google"]]:bg-pink-500/25',
            '[&_button:hover[id="google"]]:border-pink-500/25',
            '[&_button:hover[id="google"]]:dark:border-pink-500/25',
            '[&_button:hover[id="google"]>svg]:text-pink-500',
            '[&_button:hover[id="google"]>svg]:dark:text-pink-500',

            '[&_button[id="microsoft"]]:text-neutral-900',
            '[&_button[id="microsoft"]]:dark:text-neutral-100',
            '[&_button[id="microsoft"]]:border-neutral-200',
            '[&_button[id="microsoft"]]:dark:border-neutral-800',
            '[&_button:focus[id="microsoft"]]:bg-pink-500/25',
            '[&_button:focus[id="microsoft"]]:shadow-[0_0_0_3px_rgba(236,72,153,0.75)]',
            '[&_button:focus[id="microsoft"]>svg]:text-pink-500',
            '[&_button:hover[id="microsoft"]]:bg-pink-500/25',
            '[&_button:hover[id="microsoft"]]:border-pink-500/25',
            '[&_button:hover[id="microsoft"]]:dark:border-pink-500/25',
            '[&_button:hover[id="microsoft"]>svg]:text-pink-500',
            '[&_button:hover[id="microsoft"]>svg]:dark:text-pink-500',

            '[&_button[data-localization-key*=formButtonReset]]:bg-transparent',
            '[&_button[data-localization-key*=formButtonReset]]:text-neutral-900',
            '[&_button[data-localization-key*=formButtonReset]]:dark:text-neutral-100',
            '[&_button:hover[data-localization-key*=formButtonReset]]:bg-neutral-200',
            '[&_button:hover[data-localization-key*=formButtonReset]]:dark:bg-neutral-800',
            '[&_button:focus[data-localization-key*=formButtonReset]]:shadow-[0_0_0_3px_rgba(229,229,229,0.75)]',

            '[&_button:focus[data-localization-key*=destructiveActionAccordionSubtitle]]:text-red-500',
            '[&_button:focus[data-localization-key*=destructiveActionAccordionSubtitle]]:dark:text-red-500'
        ].join(' '),
        card: [
            ...defaultBackground,
            ...defaultTypography,
            ...defaultBorder,
            'shadow-lg'
        ].join(' '),
        breadcrumbsItem: [...mutedTypography].join(' '),
        breadcrumbsItemDivider: [...mutedTypography].join(' '),
        headerTitle: [...mutedTypography].join(' '),
        headerSubtitle: [...mutedTypography].join(' '),
        socialButtonsBlockButton: [
            ...mutedTypography,
            ...defaultBorder,
            ...primaryHover,
            'hover:border-pink-500/25',
            'dark:hover:border-pink-500/25',
            'focus:bg-pink-500/25',
            'focus:shadow-[0_0_0_3px_rgba(236,72,153,0.75)]'
        ].join(' '),
        socialButtonsBlockButtonArrow: [...primaryTypography].join(' '),
        formFieldRow: [...mutedTypography].join(' '),
        formFieldLabel: [...mutedTypography].join(' '),
        dividerLine: ['bg-neutral-200', 'dark:bg-neutral-800'].join(' '),
        dividerText: ['text-neutral-500', 'dark:text-neutral-500'].join(' '),
        //#endregion

        //#region Form
        formFieldInput: [...defaultInput].join(' '),
        formFieldWarningText: [...mutedTypography].join(' '),
        formFieldSuccessText: [...mutedTypography].join(' '),
        formButtonPrimary: [
            ...primaryButton,
            'focus:shadow-[0_0_0_3px_rgba(236,72,153,0.75)]'
        ].join(' '),
        formButtonReset: [
            ...ghostButton,
            'focus:shadow-[0_0_0_3px_rgba(229,229,229,0.75)]'
        ].join(' '),
        footerActionText: [...mutedTypography].join(' '),
        footerActionLink: [
            ...mutedTypography,
            'font-medium',
            'underline',
            'underline-offset-4',
            'transition-colors',
            'duration-200',
            'hover:text-pink-500',
            'dark:hover:text-pink-500'
        ].join(' '),
        //#endregion

        //#region Navbar
        navbarButton: [
            ...mutedTypography,
            'outline-offset-2',
            'outline-2',
            'outline-pink-500',
            'focus:shadow-[0_0_0_3px_rgba(236,72,153,0.75)]',
            'focus:[&.cl-active]:shadow-[0_0_0_3px_rgba(236,72,153,0.75)]'
        ].join(' '),
        //#endregion

        //#region Profile
        profileSectionTitleText: [...mutedTypography].join(' '),
        profileSectionPrimaryButton: [
            ...primaryTypography,
            ...primaryHover,
            'focus:shadow-[0_0_0_3px_rgba(236,72,153,0.75)]'
        ].join(' '),
        badge: [...primaryTypography, ...primaryMutedBackground].join(' '),
        avatarImageActionsUpload: [...primaryTypography].join(' '),
        avatarImageActionsRemove: ['text-neutral-500'].join(' '),
        fileDropAreaButtonPrimary: [...primaryTypography, ...primaryHover].join(
            ' '
        ),
        profileSectionContent: [
            ...mutedTypography,
            '[&.cl-profileSectionContent__danger]:text-red-500',
            'dark:text-red-500'
        ].join(' '),
        userPreview: [...mutedTypography].join(' '),
        userPreviewMainIdentifier: [...primaryTypography].join(' '),
        userPreviewSecondaryIdentifier: ['text-neutral-500'].join(' '),
        accordionTriggerButton: [
            ...mutedTypography,
            ...primaryHover,
            'focus:shadow-[0_0_0_3px_rgba(236,72,153,0.75)]',
            'focus:[&.cl-active]:shadow-[0_0_0_3px_rgba(236,72,153,0.75)]',
            '[&_svg]:hover:text-pink-500',
            '[&_svg]:dark:hover:text-pink-500'
        ].join(' '),
        accordionContent: [
            '[&_p]:text-neutral-900',
            'dark:[&_p]:text-neutral-100'
        ].join(' '),
        activeDevice: [
            '[&_*]:text-neutral-900',
            'dark:[&_*]:text-neutral-100'
        ].join(' ')
        //#endregion
    }
}
