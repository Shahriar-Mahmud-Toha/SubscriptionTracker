'use server';
import { delay } from "@/utils/timing";
import { SubscriptionType } from "@/features/subscription/types";
import { revalidatePath } from "next/cache";
import { SignupFormData } from "@/features/auth/types";
import { cookies, headers } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import * as UAParser from 'ua-parser-js';

const mockProfiles: SubscriptionType[] = [
    {
        id: '1',
        name: 'John',
        seller_info: 'John Doe',
        date_of_purchase: new Date("2024-12-25T00:00:00.000000Z"),
        reminder_time: new Date("2025-01-01T10:00:00.000000Z"),
        duration: 30, //days
        date_of_expiration: new Date("2025-01-02T00:00:00.000000Z"),
        account_info: 'abc1@mail.com',
        price: 100,
        currency: 'USD',
        comment: '1',
    },
    {
        id: '2',
        name: 'Jane',
        seller_info: 'Jane Smith',
        date_of_purchase: new Date("2024-12-20T00:00:00.000000Z"),
        reminder_time: new Date("2025-01-01T10:00:00.000000Z"),
        duration: 600, //days
        date_of_expiration: new Date("2025-01-02T00:00:00.000000Z"),
        account_info: 'abc2@mail.com',
        price: 200,
        currency: 'USD',
        comment: '1',
    },
    {
        id: '3',
        name: 'Michael',
        seller_info: 'Michael Johnson',
        date_of_purchase: new Date("2024-12-15T00:00:00.000000Z"),
        reminder_time: new Date("2025-01-01T10:00:00.000000Z"),
        duration: 35, //days
        date_of_expiration: new Date("2025-01-02T00:00:00.000000Z"),
        account_info: 'abc3@mail.com',
        price: 110,
        currency: 'USD',
        comment: '1',
    },
    {
        id: '4',
        name: 'Sarah',
        seller_info: 'Sarah Williams',
        date_of_purchase: new Date("2024-12-10T00:00:00.000000Z"),
        reminder_time: new Date("2025-01-01T10:00:00.000000Z"),
        duration: 30, //days
        date_of_expiration: new Date("2025-01-02T00:00:00.000000Z"),
        account_info: 'abc4@mail.com',
        price: 90,
        currency: 'USD',
        comment: '1',
    },
    {
        id: '5',
        name: 'Johniyhu',
        seller_info: 'John Doe45',
        date_of_purchase: new Date("2024-12-25T00:00:00.000000Z"),
        reminder_time: new Date("2025-01-01T10:00:00.000000Z"),
        duration: 30, //days
        date_of_expiration: new Date("2025-01-02T00:00:00.000000Z"),
        account_info: 'abc5@mail.com',
        price: 10,
        currency: 'USD',
        comment: '1',
    }
];


async function getClientIP(): Promise<string> {
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
            console.error('Failed to fetch public IP:', error);
            return ip;
        }
    }

    return ip.split(',')[0].trim();
}

async function getDeviceInfo(): Promise<string> {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';
    const parser = new UAParser.UAParser(userAgent);
    const device = parser.getDevice();
    const browser = parser.getBrowser();
    const os = parser.getOS();

    return `${device.vendor || ''} ${device.model || ''} ${os.name || ''} ${browser.name || ''}`.trim() || 'unknown';
}

async function getClientId(): Promise<string> {
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

export async function verifySignupEmail(path: string, uid:string) {
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

export async function fetchSubscriptions() {
    try {
        const randomIndex = Math.floor(Math.random() * mockProfiles.length);
        const data = mockProfiles.filter((_, index) => index !== randomIndex); //exclude the random index
        await delay(1000); // Simulating API call
        return { data, error: null };
    } catch (error) {
        return { data: null, error: 'Failed to fetch subscription information' };
    }
}

export async function addSubscription(formData: SubscriptionType) {
    try {
        const data = JSON.stringify(formData);
        console.log(data);
        await delay(2000); // Simulating API call
        return { data: true, error: null };
    } catch (error) {
        return { error: 'Failed to add subscription information' };
    } finally {
        revalidatePath('/dashboard');
    }
}
export async function updateSubscription(formData: SubscriptionType) {
    try {
        const data = JSON.stringify(formData);
        await delay(2000); // Simulating API call
        return { data: true, error: null };
    } catch (error) {
        return { error: 'Failed to update subscription information' };
    } finally {
        revalidatePath('/dashboard');
    }
}
export async function deleteSubscription(id: string) {
    try {
        const data = JSON.stringify(id);
        await delay(2000); // Simulating API call
        return { data: true, error: null };
    } catch (error) {
        return { error: 'Failed to delete subscription information' };
    } finally {
        revalidatePath('/dashboard');
    }
}