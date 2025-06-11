import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { refreshAccessToken } from '@/features/auth/actions';

export async function middleware(request: NextRequest) {
    const protectedRoutes = [
        '/dashboard',
        '/profile',
    ];

    if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
        const refreshToken = request.cookies.get('refresh_token')?.value;

        if (!refreshToken) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const accessToken = request.cookies.get('access_token')?.value;
        if (!accessToken) {
            try {
                const { tokens, error } = await refreshAccessToken(refreshToken);
                if (tokens && !error) {
                    const response = NextResponse.next();

                    response.cookies.delete('access_token');
                    response.cookies.delete('refresh_token');

                    response.cookies.set('access_token', tokens.access_token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        maxAge: Number(tokens.access_token_validity) || 15 * 60,
                        sameSite: 'strict',
                        path: '/',
                    });

                    response.cookies.set('refresh_token', tokens.refresh_token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        maxAge: Number(tokens.refresh_token_validity) || 1 * 60 * 60,
                        sameSite: 'strict',
                        path: '/',
                    });
                    return response;
                }
                return NextResponse.redirect(new URL('/login', request.url));
            } catch (error) {
                return NextResponse.redirect(new URL('/login', request.url));
            }
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/profile/:path*',
    ]
}; 