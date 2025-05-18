import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateResetPasswordParams } from '@/utils/validator';

export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname === '/forgot/reset_password') {
        const token = request.nextUrl.searchParams.get('token');
        const email = request.nextUrl.searchParams.get('email');

        // Check if both token and email are present
        if (!token || !email) {
            return NextResponse.redirect(new URL('/forgot?error=missing_params', request.url));
        }

        // Validate token and email format
        const { isValid, errors } = validateResetPasswordParams(email, token);

        if (!isValid) {
            const errorParams = new URLSearchParams();
            if (errors.email) errorParams.append('error', 'invalid_email');
            if (errors.token) errorParams.append('error', 'invalid_token');
            return NextResponse.redirect(new URL(`/forgot?${errorParams.toString()}`, request.url));
        }

        const response = NextResponse.next();
        response.headers.set('x-reset-token', token);
        response.headers.set('x-reset-email', email);
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/forgot/reset_password'
}; 