'use server';
import { delay } from "@/utils/timing";
import { SubscriptionType } from "./types";
import { revalidatePath } from "next/cache";

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