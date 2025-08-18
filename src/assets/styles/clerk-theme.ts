import { buttonVariants } from '@/components/ui/button'

/**
 * Compose common Clerk theme styles
 */
const defaultBackground = ['bg-card']
const defaultBackgroundGradient = ['bg-linear-to-r', 'from-card', 'to-card']
const mutedBackground = ['bg-muted']
const defaultTypography = ['text-card-foreground']
const mutedTypography = ['text-muted-foreground']

/**
 * Compose Clerk theme styles for Provider appearance prop
 */
export const clerkTheme = {
    elements: {
        //#region Sign In/Sign Up UI
        cardBox: [
            ...defaultBackground,
            'border',
            'rounded-lg',
            'shadow-none'
        ].join(' '),
        card: [...defaultBackground, 'rounded-t-lg', 'rounded-b-none'].join(
            ' '
        ),
        headerTitle: [...defaultTypography].join(' '),
        headerSubtitle: [...mutedTypography].join(' '),
        footer: [
            ...defaultBackgroundGradient,
            '[&_svg]:transition-colors',
            '[&_svg]:duration-200',
            '[&_svg]:text-muted-foreground',
            '[&_svg:hover]:text-primary'
        ].join(' '),
        footerActionText: [...mutedTypography].join(' '),
        footerActionLink: [
            ...mutedTypography,
            'font-medium',
            'underline-offset-4',
            'transition-colors',
            'duration-200',
            'hover:text-primary',
            'dark:hover:text-primary',
            'focus:shadow-none'
        ].join(' '),
        footerPagesLink: [
            ...mutedTypography,
            'font-medium',
            'underline-offset-4',
            'transition-colors',
            'duration-200',
            'hover:text-primary',
            'dark:hover:text-primary',
            'focus:shadow-none'
        ].join(' '),
        //#endregion

        //#region social buttons
        socialButtonsIconButton: [
            'shadow-[0_0_0_1px_rgba(229,229,229,1)]!',
            'dark:shadow-[0_0_0_1px_rgba(38,38,38,1)]!',
            'hover:shadow-[0_0_0_3px_rgba(236,72,153,0.75)]!',
            'dark:hover:shadow-[0_0_0_3px_rgba(236,72,153,0.75)]!',
            'focus:shadow-[0_0_0_3px_rgba(236,72,153,0.75)]!',
            'dark:focus:shadow-[0_0_0_3px_rgba(236,72,153,0.75)]!',
            '[&_.cl-spinner]:text-primary!'
        ].join(' '),
        //#endregion

        //#region Divider
        dividerLine: ['bg-muted-foreground/15'].join(' '),
        dividerText: [...mutedTypography].join(' '),
        //#endregion

        //#region Form
        formFieldLabel: [...mutedTypography].join(' '),
        formFieldInput: [
            'text-foreground',
            'rounded-md',
            'border',
            'bg-background',
            'px-3',
            'py-2',
            'text-sm',
            'ring-offset-background',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-hidden',
            'focus-visible:ring-2',
            'focus-visible:ring-primary',
            'focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed',
            'disabled:opacity-50',
            'dark:focus-visible:ring-primary',
            'focus:shadow-[0_0_0_1px_#ec4899]!'
        ].join(' '),
        formButtonPrimary: [
            buttonVariants({
                variant: 'default',
                className: ['shadow-none!', 'capitalize']
            })
        ].join(' '),
        formFieldErrorText: ['text-destructive'].join(' '),
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
            '[&_svg]:text-muted-foreground',
            '[&_svg:hover]:text-primary'
        ].join(' '),
        userPreviewMainIdentifier: [...defaultTypography].join(' '),
        userPreviewSecondaryIdentifier: [...mutedTypography].join(' '),
        userButtonPopoverActionButton: [
            ...mutedTypography,
            'rounded-none',
            'hover:bg-primary/25',
            'hover:text-accent-foreground'
        ].join(' '),
        userButtonPopoverCustomItemButton: [
            ...mutedTypography,
            'rounded-none',
            'hover:bg-primary/25',
            'hover:text-accent-foreground',
            '[&_.cl-spinner]:text-primary!'
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
            '[&_h1]:text-foreground',
            '[&_p]:text-muted-foreground',
            '[&_svg]:transition-colors',
            '[&_svg]:duration-200',
            '[&_svg:not(.cl-navbarButtonIcon)]:text-muted-foreground',
            '[&_svg:not(.cl-navbarButtonIcon):hover]:text-primary'
        ].join(' '),
        navbarMobileMenuRow: [...defaultBackgroundGradient].join(' '),
        navbarMobileMenuButton: [
            buttonVariants({
                variant: 'ghost',
                size: 'sm',
                className: ['text-muted-foreground']
            })
        ].join(' '),
        navbarButton: [
            ...defaultTypography,
            'data-[active=true]:bg-muted/25',
            'focus:shadow-[0_0_0_3px_rgba(236,72,153,0.75)]',
            'focus:[&.cl-active]:shadow-[0_0_0_3px_rgba(236,72,153,0.75)]'
        ].join(' '),
        //#endregion

        //#region modalContent -> ScrollBox
        scrollBox: [...mutedBackground].join(' '),
        profileSectionHeader: [...mutedTypography].join(' '),
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
                className: ['text-foreground!']
            })
        ].join(' '),
        profileSectionItem__emailAddresses: ['[&_p]:text-foreground'].join(' '),
        badge: ['text-primary', 'bg-primary/25', 'shadow-none!'].join(' '),
        menuButton: [
            ...mutedTypography,
            'focus:shadow-[0_0_0_3px_rgba(236,72,153,0.75)]'
        ].join(' '),
        menuList: [...defaultBackground].join(' '),
        profileSectionPrimaryButton__profile: [
            buttonVariants({
                variant: 'outline-solid',
                size: 'sm',
                className: ['text-muted-foreground']
            })
        ].join(' '),
        profileSectionPrimaryButton__emailAddresses: [
            buttonVariants({
                variant: 'outline-solid',
                size: 'sm',
                className: ['text-muted-foreground']
            })
        ].join(' '),
        profileSectionItem__connectedAccounts: ['[&_p]:text-foreground'].join(
            ' '
        ),
        menuButton__connectedAccounts: [
            buttonVariants({
                variant: 'outline-solid',
                size: 'sm'
            })
        ].join(' '),
        menuItem__connectedAccounts: [
            ...defaultTypography,
            'hover:bg-primary/50',
            'dark:hover:bg-primary/50'
        ].join(' '),
        profileSectionContent__activeDevices: [...mutedTypography].join(' '),
        profileSectionPrimaryButton__danger: [
            buttonVariants({
                variant: 'destructive',
                size: 'sm'
            })
        ].join(' ')
        //#endregion
    }
}
