/**
 * Email validation regex pattern
 * Allows:
 * - Uppercase and lowercase letters (A-Z, a-z)
 * - Numbers (0-9)
 * - Special characters (._%+-) in local part
 * - Domain with letters, numbers, dots, and hyphens
 * - TLD with 2 or more characters
 */
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

/**
 * Token validation regex pattern
 * Allows:
 * - Letters (a-z, A-Z)
 * - Numbers (0-9)
 * - Minimum 6 characters
 * - Maximum 128 characters
 */
const TOKEN_REGEX = /^[A-Za-z0-9]{6,128}$/;

/**
 * Validates an email address
 * @param email - The email address to validate
 * @returns boolean - True if email is valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
    if (!email) return false;
    return EMAIL_REGEX.test(email);
};

/**
 * Validates a token
 * @param token - The token to validate
 * @returns boolean - True if token is valid, false otherwise
 */
export const isValidToken = (token: string): boolean => {
    if (!token) return false;
    return TOKEN_REGEX.test(token);
};

/**
 * Validates both email and token
 * @param email - The email address to validate
 * @param token - The token to validate
 * @returns object - Contains validation results and any error messages
 */
export const validateResetPasswordParams = (email: string, token: string): {
    isValid: boolean;
    errors: {
        email?: string;
        token?: string;
    };
} => {
    const errors: { email?: string; token?: string } = {};

    if (!isValidEmail(email)) {
        errors.email = 'Invalid email format';
    }

    if (!isValidToken(token)) {
        errors.token = 'Invalid token format';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}; 