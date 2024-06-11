import { buttonVariants } from '@/components/ui/button'

/**
 * Compose common Clerk theme styles
 */
const defaultTypography = ['text-neutral-950', 'dark:text-neutral-50']
const mutedTypography = ['text-neutral-900', 'dark:text-neutral-100']
const primaryTypography = ['text-pink-500', 'dark:text-pink-500']

const defaultBackground = ['bg-neutral-100', 'dark:bg-neutral-900']
const primaryMutedBackground = ['bg-pink-500/25', 'dark:bg-pink-500/25']

const defaultBorder = ['border-neutral-200', 'dark:border-neutral-800']

const secondaryButton = [
    buttonVariants({
        variant: 'secondary'
    })
]

const ghostButton = [
    buttonVariants({
        variant: 'ghost'
    })
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
    ...defaultTypography,
    'hover:bg-pink-500/25',
    'dark:hover:bg-pink-500/25'
]

/**
 * Compose Clerk theme styles for Provider appearance prop
 */
export const clerkTheme = {
    elements: {
        //#region UserButton
        userButtonPopoverCard: [
            ...defaultBackground,
            ...defaultTypography
        ].join(' '),
        userButtonPopoverMain: [...defaultBackground, 'rounded-none'].join(' '),
        userButtonPopoverActionButton: [
            ...defaultPopoverActionButton,
            'rounded-none'
        ].join(' '),
        userPreview: [...mutedTypography].join(' '),
        userPreviewMainIdentifier: [...primaryTypography].join(' '),
        userPreviewSecondaryIdentifier: ['text-muted-foreground'].join(' '),
        userButtonPopoverActionButtonText: [...mutedTypography].join(' '),
        userButtonPopoverActionButtonIcon: [...primaryTypography].join(' '),
        userButtonPopoverFooter: [
            'bg-gradient-to-r',
            'from-card',
            'to-card',
            '[&_p]:text-muted-foreground',
            '[&_a]:w-min',
            '[&_a_svg]:transition-all',
            '[&_a_svg]:duration-200',
            '[&_a_svg]:text-muted-foreground',
            '[&_a_svg]:hover:text-secondary-foreground'
        ].join(' '),
        //#endregion

        //#region Page
        page: [
            ...mutedTypography,
            // '[&_button[data-localization-key*=signIn.alternativeMethods.getHelp.blockButton__emailSupport]]:bg-red-500',
            '[&_button[data-localization-key*=formButtonReset]]:bg-transparent',
            '[&_button[data-localization-key*=formButtonReset]]:text-muted-foreground',
            '[&_button:hover[data-localization-key*=formButtonReset]]:bg-muted',
            '[&_button:focus[data-localization-key*=formButtonReset]]:shadow-[0_0_0_3px_rgba(229,229,229,0.75)]',
            '[&_button:focus[data-localization-key*=destructiveActionAccordionSubtitle]]:text-red-500'
        ].join(' '),
        card: [
            ...defaultBackground,
            ...defaultTypography,
            ...defaultBorder,
            'rounded-none'
        ].join(' '),
        breadcrumbsItem: [...mutedTypography].join(' '),
        breadcrumbsItemDivider: [...mutedTypography].join(' '),
        headerTitle: [...mutedTypography].join(' '),
        headerSubtitle: [...mutedTypography].join(' '),
        formFieldRow: [...mutedTypography].join(' '),
        formFieldLabel: [...mutedTypography].join(' '),
        dividerLine: ['bg-muted'].join(' '),
        dividerText: ['text-muted-foreground'].join(' '),
        //#endregion

        //#region Form
        formFieldInput: [...defaultInput].join(' '),
        formFieldInputShowPasswordButton: [
            'text-secondary',
            'hover:text-secondary-foreground'
        ].join(' '),
        formFieldWarningText: [...mutedTypography].join(' '),
        formFieldSuccessText: [...mutedTypography].join(' '),
        formHeaderTitle: [...defaultTypography].join(' '),
        formHeaderSubtitle: [...mutedTypography].join(' '),
        formButtonPrimary: [
            ...secondaryButton,
            'focus:shadow-[0_0_0_3px_rgba(236,72,153,0.75)]'
        ].join(' '),
        formButtonReset: [
            ...ghostButton,
            'focus:shadow-[0_0_0_3px_rgba(229,229,229,1)]'
        ].join(' '),
        identityPreviewText: [...primaryTypography].join(' '),
        identityPreviewEditButton: [
            'transition-opacity',
            'duration-200',
            'text-secondary',
            'hover:text-secondary-foreground'
        ].join(' '),
        otpCodeFieldInput: [
            ...mutedTypography,
            '!border-2',
            'border-secondary',
            'focus:border-secondary-foreground'
        ].join(' '),
        formResendCodeLink: ['text-secondary-foreground'].join(' '),
        footer: [
            'bg-gradient-to-r',
            'from-card',
            'to-card',
            'border-0',
            '[&_a]:w-fit',
            '[&_a_svg]:transition-colors',
            '[&_a_svg]:duration-200',
            '[&_a_svg]:text-muted-foreground',
            '[&_a_svg]:hover:text-secondary-foreground'
        ].join(' '),
        footerAction__signIn: ['hidden'].join(' '),
        footerActionText: [...mutedTypography].join(' '),
        footerActionLink: [
            ...mutedTypography,
            'font-medium',
            'underline-offset-4',
            'transition-colors',
            'duration-200',
            'hover:text-secondary-foreground',
            'focus:shadow-none'
        ].join(' '),
        formFieldAction__password: [
            'text-secondary',
            'hover:text-secondary-foreground'
        ].join(' '),
        footerPagesLink: [
            ...mutedTypography,
            'underline-offset-4',
            'transition-colors',
            'duration-200',
            'hover:text-secondary-foreground',
            'focus:shadow-none'
        ].join(' '),
        backLink: ['text-secondary', 'hover:text-secondary-foreground'].join(
            ' '
        ),
        alternativeMethodsBlockButton: [...secondaryButton].join(' '),
        //#endregion

        //#region Navbar
        navbar: [
            'bg-gradient-to-r',
            'from-neutral-100',
            'to-neutral-100',
            'dark:from-neutral-900',
            'dark:to-neutral-900',
            '[&_h1]:text-neutral-950',
            '[&_h1]:dark:text-neutral-50'
        ].join(' '),
        navbarButton: [
            ...mutedTypography,
            'outline-offset-2',
            'outline-2',
            'outline-secondary',
            'focus:shadow-[0_0_0_3px_rgba(236,72,153,0.75)]',
            'focus:[&.cl-active]:shadow-[0_0_0_3px_rgba(236,72,153,0.75)]'
        ].join(' '),
        //#endregion

        //#region Scrollbox
        scrollBox: [
            ...defaultBackground,
            'border-l-2',
            'border-accent/25',
            'rounded-none'
        ].join(' '),
        profileSectionItem: ['[&_p]:text-muted-foreground'].join(' '),
        //#endregion

        //#region Profile
        profileSectionTitleText: [...mutedTypography].join(' '),
        profileSectionPrimaryButton: [
            ...primaryTypography,
            'focus:shadow-[0_0_0_3px_rgba(236,72,153,0.75)]'
        ].join(' '),
        badge: [...primaryTypography, ...primaryMutedBackground].join(' '),
        avatarImageActionsUpload: [...primaryTypography].join(' '),
        avatarImageActionsRemove: ['text-muted'].join(' '),
        fileDropAreaButtonPrimary: [...primaryTypography].join(' '),
        profileSectionContent: [
            ...mutedTypography,
            '[&.cl-profileSectionContent__danger]:text-red-500'
        ].join(' '),
        accordionTriggerButton: [
            ...mutedTypography,
            'focus:shadow-[0_0_0_3px_rgba(236,72,153,0.75)]',
            'focus:[&.cl-active]:shadow-[0_0_0_3px_rgba(236,72,153,0.75)]',
            '[&_svg]:hover:text-secondary-foreground'
        ].join(' '),
        accordionContent: ['[&_p]:text-muted-foreground'].join(' '),
        activeDevice: ['[&_*]:text-muted-foreground'].join(' ')
        //#endregion
    }
}
