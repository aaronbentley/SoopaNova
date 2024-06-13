import { buttonVariants } from '@/components/ui/button'

/**
 * Compose common Clerk theme styles
 */
const defaultTypography = ['text-neutral-950', 'dark:text-neutral-50']
const mutedTypography = ['text-neutral-500', 'dark:text-neutral-500']

const defaultBackground = ['bg-neutral-100', 'dark:bg-neutral-900']
const defaultBackgroundGradient = [
    'bg-gradient-to-r',
    'from-neutral-100',
    'to-neutral-100',
    'dark:from-neutral-900',
    'dark:to-neutral-900'
]
const mutedBackground = ['bg-neutral-200', 'dark:bg-neutral-800']

/**
 * Compose Clerk theme styles for Provider appearance prop
 */
export const clerkTheme = {
    elements: {
        //#region Sign In/Sign Up UI
        card: [...defaultBackground].join(' '),
        headerTitle: [...defaultTypography].join(' '),
        headerSubtitle: [...mutedTypography].join(' '),
        footer: [
            ...defaultBackgroundGradient,
            '[&_svg]:transition-colors',
            '[&_svg]:duration-200',
            '[&_svg]:text-neutral-500',
            '[&_svg:hover]:text-pink-500'
        ].join(' '),
        footerActionText: [...mutedTypography].join(' '),
        footerActionLink: [
            ...mutedTypography,
            'font-medium',
            'underline-offset-4',
            'transition-colors',
            'duration-200',
            'hover:text-pink-500',
            'dark:hover:text-pink-500',
            'focus:shadow-none'
        ].join(' '),
        footerPagesLink: [
            ...mutedTypography,
            'font-medium',
            'underline-offset-4',
            'transition-colors',
            'duration-200',
            'hover:text-pink-500',
            'dark:hover:text-pink-500',
            'focus:shadow-none'
        ].join(' '),
        //#endregion

        //#region social buttons
        socialButtonsIconButton: [
            '!shadow-[0_0_0_1px_rgba(229,229,229,1)]',
            'dark:!shadow-[0_0_0_1px_rgba(38,38,38,1)]',
            'hover:!shadow-[0_0_0_3px_rgba(236,72,153,0.75)]',
            'dark:hover:!shadow-[0_0_0_3px_rgba(236,72,153,0.75)]',
            'focus:!shadow-[0_0_0_3px_rgba(236,72,153,0.75)]',
            'dark:focus:!shadow-[0_0_0_3px_rgba(236,72,153,0.75)]'
        ].join(' '),
        //#endregion

        //#region Divider
        dividerLine: ['bg-neutral-500/50', 'dark:bg-neutral-500/50'].join(' '),
        dividerText: [...mutedTypography].join(' '),
        //#endregion

        //#region Form
        formFieldLabel: [...mutedTypography].join(' '),
        formFieldInput: [
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
            'focus:!shadow-[0_0_0_1px_#ec4899]'
        ].join(' '),
        formButtonPrimary: [
            buttonVariants({
                variant: 'default',
                className: [
                    '!shadow-none',
                    'bg-pink-500',
                    'dark:bg-pink-500',
                    'hover:bg-pink-500/90',
                    'dark:hover:bg-pink-500/90',
                    'hover:text-neutral-50',
                    'dark:hover:text-neutral-950',
                    'capitalize'
                ]
            })
        ].join(' '),
        formFieldErrorText: ['text-red-500'].join(' '),
        formFieldInputShowPasswordButton: [
            ...mutedTypography,
            'focus:!shadow-[0_0_0_3px_rgba(229,229,229,1)]',
            'dark:focus:!shadow-[0_0_0_3px_rgba(38,38,38,1)]'
        ].join(' '),
        formButtonReset: [
            buttonVariants({
                variant: 'ghost'
            })
        ].join(' '),
        //#endregion

        //#region UserButton
        userButtonPopoverCard: [...defaultTypography].join(' '),
        userButtonPopoverMain: [...defaultBackground, 'rounded-none'].join(' '),
        userButtonPopoverFooter: [
            ...defaultBackgroundGradient,
            '[&_svg]:transition-colors',
            '[&_svg]:duration-200',
            '[&_svg]:text-neutral-500',
            '[&_svg:hover]:text-pink-500'
        ].join(' '),
        userPreviewMainIdentifier: [...defaultTypography].join(' '),
        userPreviewSecondaryIdentifier: [...mutedTypography].join(' '),
        userButtonPopoverActionButton: [
            ...mutedTypography,
            'rounded-none',
            'transition-colors',
            'hover:bg-pink-500/25',
            'hover:text-neutral-950',
            'dark:hover:bg-pink-500/25',
            'dark:hover:text-neutral-50'
        ].join(' '),
        //#endregion

        //#region Modal
        modalCloseButton: [
            buttonVariants({
                variant: 'ghost',
                size: 'icon'
            })
        ].join(' '),
        //#endregion

        //#region modalContent -> Navbar
        navbar: [
            ...defaultBackgroundGradient,
            '[&_h1]:text-neutral-950',
            '[&_h1]:dark:text-neutral-50',
            '[&_p]:text-neutral-500',
            '[&_p]:dark:text-neutral-500',
            '[&_svg]:transition-colors',
            '[&_svg]:duration-200',
            '[&_svg:not(.cl-navbarButtonIcon)]:text-neutral-500',
            '[&_svg:not(.cl-navbarButtonIcon):hover]:text-pink-500'
        ].join(' '),
        navbarMobileMenuRow: [...defaultBackgroundGradient].join(' '),
        navbarMobileMenuButton: [
            buttonVariants({
                variant: 'ghost',
                size: 'sm',
                className: [
                    'text-neutral-500',
                    'dark:text-neutral-500',
                    'hover:bg-neutral-100',
                    'dark:hover:bg-neutral-900'
                ]
            })
        ].join(' '),
        navbarButton: [
            ...defaultTypography,
            'data-[active=true]:bg-neutral-500/25',
            'data-[active=true]:dark:bg-neutral-500/25',
            'focus:shadow-[0_0_0_3px_rgba(236,72,153,0.75)]',
            'focus:[&.cl-active]:shadow-[0_0_0_3px_rgba(236,72,153,0.75)]'
        ].join(' '),
        //#endregion

        //#region modalContent -> ScrollBox
        scrollBox: [...mutedBackground].join(' '),
        profileSectionHeader: [...mutedTypography].join(' '),
        profileSectionPrimaryButton__profile: [
            buttonVariants({
                variant: 'ghost',
                size: 'sm',
                className: [
                    'text-neutral-500',
                    'dark:text-neutral-500',
                    'hover:bg-neutral-100',
                    'dark:hover:bg-neutral-900'
                ]
            })
        ].join(' '),
        actionCard: [...defaultBackground].join(' '),
        avatarImageActionsUpload: [
            buttonVariants({
                variant: 'default',
                size: 'sm'
            })
        ].join(' '),
        avatarImageActionsRemove: [
            buttonVariants({
                variant: 'destructive',
                size: 'sm',
                className: ['!text-neutral-50', 'dark:!text-neutral-950']
            })
        ].join(' '),
        profileSectionItem__emailAddresses: [
            '[&_p]:text-neutral-950',
            '[&_p]:dark:text-neutral-50'
        ].join(' '),
        badge: [
            'text-pink-500',
            'dark:text-pink-500',
            'bg-pink-500/25',
            'dark:bg-pink-500/25',
            '!shadow-none'
        ].join(' '),
        menuButton: [
            ...mutedTypography,
            'focus:shadow-[0_0_0_3px_rgba(236,72,153,0.75)]'
        ].join(' '),
        menuList: [...defaultBackground].join(' '),
        profileSectionPrimaryButton__emailAddresses: [
            buttonVariants({
                variant: 'ghost',
                size: 'sm',
                className: [
                    'text-neutral-500',
                    'dark:text-neutral-500',
                    'hover:bg-neutral-100',
                    'dark:hover:bg-neutral-900'
                ]
            })
        ].join(' '),
        profileSectionItem__connectedAccounts: [
            '[&_p]:text-neutral-950',
            '[&_p]:dark:text-neutral-50'
        ].join(' '),
        menuButton__connectedAccounts: [
            buttonVariants({
                variant: 'ghost',
                size: 'sm',
                className: [
                    'text-neutral-500',
                    'dark:text-neutral-500',
                    'hover:bg-neutral-100',
                    'dark:hover:bg-neutral-900'
                ]
            })
        ].join(' '),
        menuItem__connectedAccounts: [
            ...defaultTypography,
            'hover:bg-pink-500/50',
            'hover:dark:bg-pink-500/50'
        ].join(' '),
        profileSectionPrimaryButton__password: [
            buttonVariants({
                variant: 'ghost',
                size: 'sm',
                className: [
                    'text-neutral-500',
                    'dark:text-neutral-500',
                    'hover:bg-neutral-100',
                    'dark:hover:bg-neutral-900'
                ]
            })
        ].join(' '),
        profileSectionContent__activeDevices: [...mutedTypography].join(' '),
        profileSectionPrimaryButton__danger: [
            buttonVariants({
                variant: 'destructive',
                size: 'sm',
                className: ['!text-neutral-50', 'dark:!text-neutral-950']
            })
        ].join(' ')
        //#endregion
    }
}
