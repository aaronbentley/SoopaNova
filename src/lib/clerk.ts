import {
    ClerkAPIResponseError,
    isClerkAPIResponseError
} from '@clerk/nextjs/errors'

/**
 * isClerkAPIResponseError throws on null/undefined instead of returning
 * false, and the custom flow methods return { error: null } on success
 */
const isApiError = (error: unknown): error is ClerkAPIResponseError =>
    error != null && isClerkAPIResponseError(error)

/**
 * Whether a Clerk error (or anything thrown) carries a given API error code,
 * e.g. form_identifier_not_found
 */
export const hasClerkErrorCode = (error: unknown, code: string) =>
    isApiError(error) && error.errors.some((apiError) => apiError.code === code)

/**
 * A readable message for a Clerk error (or anything thrown)
 */
export const clerkErrorMessage = (error: unknown) => {
    if (isApiError(error)) {
        const [apiError] = error.errors
        return apiError?.longMessage ?? apiError?.message ?? error.message
    }

    if (error instanceof Error) return error.message

    return 'Something went wrong. Please try again.'
}
