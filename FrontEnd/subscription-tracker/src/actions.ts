'use server';

import { cookies, headers } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import * as UAParser from 'ua-parser-js';

export async function getClientIP(): Promise<string> {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') ||
        headersList.get('x-real-ip') ||
        headersList.get('cf-connecting-ip') ||
        'unknown';

    // If we're in development (localhost), try to get public IP
    if (process.env.NODE_ENV === 'development' && (ip === '::1' || ip === '127.0.0.1')) {
        try {
            const response = await fetch(`${process.env.IP_LOOKUP}`);
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return ip;
        }
    }

    return ip.split(',')[0].trim();
}

export async function getDeviceInfo(): Promise<string> {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';
    const parser = new UAParser.UAParser(userAgent);
    const device = parser.getDevice();
    const browser = parser.getBrowser();
    const os = parser.getOS();

    return `${device.vendor || ''} ${device.model || ''} ${os.name || ''} ${browser.name || ''}`.trim() || 'unknown';
}

export async function getClientId(): Promise<string> {
    const cookieStore = await cookies();
    let clientId = cookieStore.get('client_id')?.value;

    if (!clientId) {
        clientId = uuidv4();
        cookieStore.set('client_id', clientId, {
            maxAge: 365 * 24 * 60 * 60,
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
    }

    return clientId;
}