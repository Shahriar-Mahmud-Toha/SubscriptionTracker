'use server';

import { getClientId, getClientIP, getDeviceInfo } from "@/actions";
import { LoginFormData, ResetPasswordFormData, SignupFormData } from "@/features/auth/types";
import { cookies } from 'next/headers';

export async function login(formData: LoginFormData) {
    try {
        const [clientId, clientIP, deviceInfo] = await Promise.all([
            getClientId(),
            getClientIP(),
            getDeviceInfo()
        ]);

        const response = await fetch(`${process.env.BACKEND_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Client-ID': clientId,
                'X-Client-IP': clientIP,
                'X-Device-Info': deviceInfo,
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (response.status === 200 && data.tokens) {
            const cookieStore = await cookies();
            const accessTokenValidity = Number(data.tokens.access_token_validity) || 1 * 60;
            const refreshTokenValidity = Number(data.tokens.refresh_token_validity) || 1 * 60 * 60;
            
            cookieStore.delete('access_token');
            cookieStore.delete('refresh_token');
            
            cookieStore.set('access_token', data.tokens.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: accessTokenValidity,
                sameSite: 'strict',
                path: '/',
            });
            cookieStore.set('refresh_token', data.tokens.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: refreshTokenValidity,
                sameSite: 'strict',
                path: '/',
            });
            return { data: data, error: null };
        }
        if (response.status === 401 && data?.error) {
            return { data: null, error: data.error };
        }
        if (response.status === 400 && data?.message) {
            return { data: null, error: data.message };
        }
        if (response.status === 429 && data?.message) {
            return { data: null, error: data.message };
        }
        return { data: null, error: `Login failed with status: ${response.status}` };
    } catch (error) {
        return { data: null, error: "Failed to Login" };
    }
}
export async function refreshAccessToken(refreshToken: string) {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/refresh_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshToken}`,
            },
        });
        const data = await response.json();
        if (response.status === 201 && data.tokens) {
            return { tokens: data.tokens, error: null };
        }
        return { tokens: null, error: 'Unauthenticated Access Request. Please Login.' };
    }
    catch (error) {
        return { tokens: null, error: 'Internal Server Error. Authentication Failed, Please Login.' };
    }
}
export async function refreshAccessTokenOnLogout(refreshToken: string) {
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/refresh_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshToken}`,
            },
        });
        const data = await response.json();
        if (response.status === 201 && data.tokens) {
            const cookieStore = await cookies();
            cookieStore.delete('access_token');
            cookieStore.delete('refresh_token');
            cookieStore.set('access_token', data.tokens.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: Number(data.tokens.access_token_validity) || 1 * 60,
                sameSite: 'strict',
                path: '/',
            });
            cookieStore.set('refresh_token', data.tokens.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: Number(data.tokens.refresh_token_validity) || 1 * 60 * 60,
                sameSite: 'strict',
                path: '/',
            });
            return { tokens: data.tokens, error: null };
        }
        return { tokens: null, error: 'Unauthenticated Access Request. Please Login.' };
    }
    catch (error) {
        return { tokens: null, error: 'Internal Server Error. Authentication Failed, Please Login.' };
    }
}
export async function logout() {
    try {
        const cookieStore = await cookies();
        let accessToken = cookieStore.get('access_token')?.value;
        const refreshToken = cookieStore.get('refresh_token')?.value;
        if (!refreshToken) {
            return { data: null, error: 'Unauthenticated Access Request. Please Login.' };
        }
        if (!accessToken) {
            const { tokens, error } = await refreshAccessTokenOnLogout(refreshToken);
            if (tokens && !error) {
                accessToken = tokens.access_token;
            }
            else{
                return { data: null, error: 'Unauthenticated Access Request. Please Login.' };
            }
        }
        const response = await fetch(`${process.env.BACKEND_URL}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        const data = await response.json();
        if (response.status === 200 && data.message) {
            cookieStore.delete('access_token');
            cookieStore.delete('refresh_token');
            return { data: data.message, error: null };
        }
        return { data: null, error: 'Logout Failed!' };
    }
    catch (error) {
        return { data: null, error: 'Internal Server Error. Logout Failed!' };
    }
}
export async function getAuthToken() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('access_token')?.value;

        if (!accessToken) {
            return { token: null, error: 'Unauthenticated Access Request. Please Login.' };
        }
        return { token: accessToken, error: null };
    }
    catch (error) {
        return { token: null, error: 'Internal Server Error. Authentication Failed, Please Login.' };
    }
}
export async function signup(formData: SignupFormData) {
    try {
        const [clientId, clientIP, deviceInfo] = await Promise.all([
            getClientId(),
            getClientIP(),
            getDeviceInfo()
        ]);

        const response = await fetch(`${process.env.BACKEND_URL}/user/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Client-ID': clientId,
                'X-Client-IP': clientIP,
                'X-Device-Info': deviceInfo,
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (response.status === 201 && data.token) {
            return { data: data, error: null };
        }
        if (response.status === 400 && data?.email) {
            return { data: null, error: data.email[0] };
        }
        return { data: null, error: `Signup failed with status: ${response.status}` };
    } catch (error) {
        return { data: null, error: "Failed to Sign Up" };
    }
}

export async function resendVerificationLink(token: string) {
    try {
        const [clientId, clientIP, deviceInfo] = await Promise.all([
            getClientId(),
            getClientIP(),
            getDeviceInfo()
        ]);

        const response = await fetch(`${process.env.BACKEND_URL}/user/signup/reverifyEmail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Client-ID': clientId,
                'X-Client-IP': clientIP,
                'X-Device-Info': deviceInfo,
            },
            body: JSON.stringify({ token: token }),
        });
        const data = await response.json();
        if (response.status === 200 && data.message) {
            return { data: data.message, error: null };
        }
        if (response.status === 429 && data?.message) {
            return { data: null, error: data.message };
        }
        return { data: null, error: `Resend verification email failed with status: ${response.status}` };
    } catch (error) {
        return { data: null, error: "Failed to Resend Verification Email" };
    }
}

export async function verifySignupEmail(path: string, uid: string) {
    try {
        const [clientIP, deviceInfo] = await Promise.all([
            getClientIP(),
            getDeviceInfo()
        ]);
        const response = await fetch(`${process.env.BACKEND_URL}/user/signup${path}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Client-UID': uid,
                'X-Client-IP': clientIP,
                'X-Device-Info': deviceInfo,
            }
        });

        const data = await response.json();
        if (response.status === 201 && data.message) {
            return { data: data.message, error: null };
        }
        if (response.status === 200 && data?.message) {
            return { data: null, error: data.message };
        }
        if (response.status === 429 && data?.message) {
            return { data: null, error: data.message };
        }
        return { data: null, error: `Email verification failed with status: ${response.status}` };
    } catch (error) {
        return { data: null, error: "Invalid or Expired Verification Link" };
    }
}
export async function forgotPassword(email: string) {
    try {
        const [clientId, clientIP, deviceInfo] = await Promise.all([
            getClientId(),
            getClientIP(),
            getDeviceInfo()
        ]);
        const response = await fetch(`${process.env.BACKEND_URL}/user/password/forgot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Client-ID': clientId,
                'X-Client-IP': clientIP,
                'X-Device-Info': deviceInfo,
            },
            body: JSON.stringify({ email: email }),
        });

        const data = await response.json();
        if (response.status === 200 && data.message) {
            return { data: data.message, error: null };
        }
        if (response.status === 400 && data?.message) {
            return { data: null, error: data.message };
        }
        if (response.status === 429 && data?.message) {
            return { data: null, error: data.message };
        }
        return { data: null, error: `Forgot Password operation failed with status: ${response.status}` };
    } catch (error) {
        return { data: null, error: "Failed to Forgot Password" };
    }
}
export async function resetPassword(token: string, formData: ResetPasswordFormData) {
    try {
        const [clientId, clientIP, deviceInfo] = await Promise.all([
            getClientId(),
            getClientIP(),
            getDeviceInfo()
        ]);
        const response = await fetch(`${process.env.BACKEND_URL}/user/password/reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Client-ID': clientId,
                'X-Client-IP': clientIP,
                'X-Device-Info': deviceInfo,
            },
            body: JSON.stringify({ token: token, password: formData.password, password_confirmation: formData.password_confirmation }),
        });

        const data = await response.json();
        if (response.status === 200 && data.message) {
            return { data: data.message, error: null };
        }
        if (response.status === 400 && data?.message) {
            return { data: null, error: data.message };
        }
        if (response.status === 429 && data?.message) {
            return { data: null, error: data.message };
        }
        return { data: null, error: `Reset Password failed with status: ${response.status}` };
    } catch (error) {
        return { data: null, error: "Failed to Reset Password" };
    }
}