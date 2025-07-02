'use server';

import { SubscriptionType } from "@/features/subscription/types";
import { revalidatePath } from "next/cache";
import { getAuthToken } from "@/features/auth/actions";
import { convertLocalStringDateTimeToUTC } from "@/utils/helper";

export async function fetchSubscriptions() {
    try {
        const { token, error } = await getAuthToken();
        if (error) {
            return { data: null, error: error };
        }
        const response = await fetch(`${process.env.BACKEND_URL}/subscription/showAll`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Server-Secret': process.env.SERVER_SECRET || '',
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.status === 200) {
            return { data, error: null };
        }
        if (response.status === 404 && data.message) {

            return { data: [], error: null };
        }
        if (response.status === 401 && data?.message) {
            return { data: null, error: data.message, status: response.status };
        }
        return { data: null, error: `Failed to fetch subscriptions - status: ${response.status}` };
    } catch (error) {
        return { data: null, error: 'Failed to fetch subscriptions - internal server error' };
    }
}

export async function addSubscription(formData: SubscriptionType, userTimeZone:string) {
    try {
        // Form validation
        if (!formData.name) {
            return { data: null, error: "The Subscription's Name field is required." };
        }
        if (formData.name.length > 255) {
            return { data: null, error: "The Subscription's Name may not be greater than 255 characters." };
        }

        if (formData.seller_info && formData.seller_info.length > 255) {
            return { data: null, error: "The seller info may not be greater than 255 characters." };
        }
        if (formData.date_of_purchase) {
            const dateOfPurchaseUtc = convertLocalStringDateTimeToUTC(formData.date_of_purchase, userTimeZone);
            if(!dateOfPurchaseUtc || isNaN(dateOfPurchaseUtc.getTime())) {
                return { data: null, error: "The date of purchase must be a valid date." };
            }
            formData.date_of_purchase = dateOfPurchaseUtc.toISOString();
        }
        if(formData.reminder_time){
            const reminderTimeUtc = convertLocalStringDateTimeToUTC(formData.reminder_time, userTimeZone);
            if(!reminderTimeUtc || isNaN(reminderTimeUtc.getTime())) {
                return { data: null, error: "The reminder time must be a valid date with time." };
            }
            if( reminderTimeUtc < new Date()) {
                return { data: null, error: "The reminder time must be in the future."};
            }
            formData.reminder_time = reminderTimeUtc.toISOString();
        }

        if (!formData.date_of_expiration) {
            return { data: null, error: "The date of expiration field is required." };
        }
        else {
            const dateOfExpirationUtc = convertLocalStringDateTimeToUTC(formData.date_of_expiration, userTimeZone);
            if (!dateOfExpirationUtc || isNaN(dateOfExpirationUtc.getTime())) {
                return { data: null, error: "The date of expiration must be a valid date." };
            }
            if (dateOfExpirationUtc < new Date()) {
                return { data: null, error: "The expiration date must be in the future." };
            }
            formData.date_of_expiration = dateOfExpirationUtc.toISOString();
        }

        if (formData.account_info && formData.account_info.length > 255) {
            return { data: null, error: "The account info may not be greater than 255 characters." };
        }

        if (formData.price && formData.price <= 0) {
            return { data: null, error: "The price must be greater than 0." };
        }

        if (formData.currency && formData.currency.length !== 3) {
            return { data: null, error: "The currency must be exactly 3 characters." };
        }

        if (formData.comment && formData.comment.length > 255) {
            return { data: null, error: "The comment may not be greater than 255 characters." };
        }

        const { token, error } = await getAuthToken();
        if (error) {
            return { data: null, error: error };
        }
        const formDataToSend = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value.toString());
        });
    
        const response = await fetch(`${process.env.BACKEND_URL}/subscription/store`, {
            method: 'POST',
            headers: {
                'X-Server-Secret': process.env.SERVER_SECRET || '',
                'Authorization': `Bearer ${token}`,
            },
            body: formDataToSend,
        });
        const data = await response.json();
        if (response.status === 201 && data.id) {
            return { data: true, error: null };
        }
        if (response.status === 400 && data.message) {
            return { data: null, error: data.message };
        }
        return { data: null, error: `Failed to add subscription - status: ${response.status}` };
    } catch (error) {
        return { error: 'Failed to add subscription information' };
    } finally {
        revalidatePath('/dashboard');
    }
}
export async function updateSubscription(formData: SubscriptionType, userTimeZone:string, previousData: SubscriptionType) {
    try {

        if (formData.name && formData.name.length > 255) {
            return { data: null, error: "The Subscription's Name may not be greater than 255 characters." };
        }

        if (formData.seller_info && formData.seller_info.length > 255) {
            return { data: null, error: "The seller info may not be greater than 255 characters." };
        }

        if (formData.date_of_purchase) {
            const dateOfPurchaseUtc = convertLocalStringDateTimeToUTC(formData.date_of_purchase, userTimeZone);
            if(!dateOfPurchaseUtc || isNaN(dateOfPurchaseUtc.getTime())) {
                return { data: null, error: "The date of purchase must be a valid date." };
            }
            formData.date_of_purchase = dateOfPurchaseUtc.toISOString();
        }

        if(formData.reminder_time){
            const reminderTimeUtc = convertLocalStringDateTimeToUTC(formData.reminder_time, userTimeZone);
            if(!reminderTimeUtc || isNaN(reminderTimeUtc.getTime())) {
                return { data: null, error: "The reminder time must be a valid date with time." };
            }

            if( reminderTimeUtc.getTime() !== new Date(previousData.reminder_time as string).getTime() && reminderTimeUtc <= new Date()) {
                return { data: null, error: "The reminder time must be in the future."};
            }
            formData.reminder_time = reminderTimeUtc.toISOString();
        }

        if (!formData.date_of_expiration) {
            return { data: null, error: "The date of expiration field is required." };
        }
        else {
            const dateOfExpirationUtc = convertLocalStringDateTimeToUTC(formData.date_of_expiration, userTimeZone);
            if (!dateOfExpirationUtc || isNaN(dateOfExpirationUtc.getTime())) {
                return { data: null, error: "The date of expiration must be a valid date." };
            }

            if (dateOfExpirationUtc.getTime() !== new Date(previousData.date_of_expiration as string).getTime() && dateOfExpirationUtc <= new Date()) {
                return { data: null, error: "_The expiration date must be in the future." };
            }
            formData.date_of_expiration = dateOfExpirationUtc.toISOString();
        }
        
        if (formData.account_info && formData.account_info.length > 255) {
            return { data: null, error: "The account info may not be greater than 255 characters." };
        }

        if (formData.price && formData.price <= 0) {
            return { data: null, error: "The price must be greater than 0." };
        }

        if (formData.currency && formData.currency.length !== 3) {
            return { data: null, error: "The currency must be exactly 3 characters." };
        }

        if (formData.comment && formData.comment.length > 255) {
            return { data: null, error: "The comment may not be greater than 255 characters." };
        }
        if (!formData.id) {
            return { data: null, error: "The subscription ID is required." };
        }
        if (!formData.name && !formData.seller_info && !formData.date_of_purchase && !formData.reminder_time && !formData.date_of_expiration && !formData.account_info && !formData.price && !formData.currency && !formData.comment) {
            return { data: null, error: "At least one field is required to update." };
        }
        const { token, error } = await getAuthToken();
        if (error) {
            return { data: null, error: error };
        }
        const response = await fetch(`${process.env.BACKEND_URL}/subscription/update/${formData.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Server-Secret': process.env.SERVER_SECRET || '',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (response.status === 200 && data.message) {
            return { data: data.message, error: null };
        }
        return { data: null, error: data.message ? data.message : `Failed to update subscription - status: ${response.status}` };
    } catch (error) {
        return { data: null, error: 'Failed to update subscription information' };
    } finally {
        revalidatePath('/dashboard');
    }
}
export async function searchSubscription(search: string) {
    try {
        if (!search) {
            return { data: null, error: "The search query is required." };
        }
        const { token, error } = await getAuthToken();
        if (error) {
            return { data: null, error: error };
        }
        const response = await fetch(`${process.env.BACKEND_URL}/subscription/search?keyword=${search}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Server-Secret': process.env.SERVER_SECRET || '',
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.status === 200 && data) {
            return { data: data, error: null };
        }
        return { data: null, error: `Failed to search subscription - status: ${response.status}` };
    } catch (error) {
        return { data: null, error: 'Failed to search subscription information' };
    }
}
export async function deleteSubscription(id: string) {
    try {
        if (!id) {
            return { data: null, error: "The subscription ID is required." };
        }
        if (isNaN(Number(id))) {
            return { data: null, error: "The subscription ID must be a valid number." };
        }
        const { token, error } = await getAuthToken();
        if (error) {
            return { data: null, error: error };
        }
        const response = await fetch(`${process.env.BACKEND_URL}/subscription/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'X-Server-Secret': process.env.SERVER_SECRET || '',
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.status === 200 && data.message) {
            return { data: data.message, error: null };
        }
        return { data: null, error: `Failed to delete subscription - status: ${response.status}` };
    } catch (error) {
        return { error: 'Failed to delete subscription information' };
    } finally {
        revalidatePath('/dashboard');
    }
}