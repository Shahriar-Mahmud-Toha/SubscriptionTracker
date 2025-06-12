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
export const validateResetPasswordToken = (token: string): { isValid: boolean; error?: string } => {

    if (!isValidToken(token)) {
        return { isValid: false, error: 'Invalid token format' };
    }

    return { isValid: true };
};

export const validateSignupVerifyEmailParams = (expires: string, hash: string, id: string, signature: string): { isValid: boolean; error?: string } => {
    const expiresNum = Number(expires);
    if (isNaN(expiresNum)) {
        return { isValid: false, error: 'Invalid expiration timestamp' };
    }

    const idNum = Number(id);
    if (isNaN(idNum) || idNum <= 0) {
        return { isValid: false, error: 'Invalid user ID' };
    }

    //check expire date is expired or not (convert Date.now() to seconds)
    if (expiresNum < Math.floor(Date.now() / 1000)) {
        return { isValid: false, error: 'Verification link has expired' };
    }

    // Check if hash is exactly 40 characters
    if (!/^[a-f0-9]{40}$/.test(hash)) {
        return { isValid: false, error: 'Invalid hash format' };
    }

    // Check if signature is a valid hex string (64 characters)
    if (!/^[a-f0-9]{64}$/.test(signature)) {
        return { isValid: false, error: 'Invalid signature format' };
    }

    return { isValid: true };
};
export const validateUpdateVerifyEmailParams = (expires: string, hash: string, id: string, signature: string, type: string): { isValid: boolean; error?: string } => {
    const expiresNum = Number(expires);
    if (isNaN(expiresNum)) {
        return { isValid: false, error: 'Invalid expiration timestamp' };
    }

    const idNum = Number(id);
    if (isNaN(idNum) || idNum <= 0) {
        return { isValid: false, error: 'Invalid user ID' };
    }

    //check expire date is expired or not (convert Date.now() to seconds)
    if (expiresNum < Math.floor(Date.now() / 1000)) {
        return { isValid: false, error: 'Verification link has expired' };
    }

    // Check if hash is exactly 40 characters
    if (!/^[a-f0-9]{40}$/.test(hash)) {
        return { isValid: false, error: 'Invalid hash format' };
    }

    // Check if signature is a valid hex string (64 characters)
    if (!/^[a-f0-9]{64}$/.test(signature)) {
        return { isValid: false, error: 'Invalid signature format' };
    }

    if (type !== 'update') {
        return { isValid: false, error: 'Invalid type' };
    }

    return { isValid: true };
};