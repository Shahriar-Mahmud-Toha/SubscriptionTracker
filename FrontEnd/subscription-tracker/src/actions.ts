'use server';

import { cookies, headers } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import * as UAParser from 'ua-parser-js';

export async function getClientIP(): Promise<string> {
    try {
        const response = await fetch(`${process.env.IP_LOOKUP}`);
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return 'unknown';
    }
}

export async function getDeviceInfo(): Promise<string> {
    try {
        const headersList = await headers();
        const userAgent = headersList.get('user-agent') || '';
        const parser = new UAParser.UAParser(userAgent);
        const device = parser.getDevice();
        const browser = parser.getBrowser();
        const os = parser.getOS();

        return `${device.vendor || ''} ${device.model || ''} ${os.name || ''} ${browser.name || ''}`.trim() || 'unknown';
    }
    catch (error) {
        return 'unknown';
    }
}

export async function getClientId(): Promise<string> {
    try {
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
    catch (error) {
        return 'unknown';
    }
}
export async function isValidTimezone(timezone: string): Promise<boolean> {
    try {
        // Trying to create a DateTimeFormat with the timezone. If it fails, the timezone is invalid.
        Intl.DateTimeFormat(undefined, { timeZone: timezone });
        return true;
    } catch (e) {
        return false;
    }
}