'use server';

import { SubscriptionType } from "@/features/subscription/types";
import { revalidatePath } from "next/cache";
import { getAuthToken } from "@/features/auth/actions";

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
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.status === 200) {
            if (Array.isArray(data)) {
                data.forEach(subscription => {
                    if (subscription.reminder_time) {
                        // Convert UTC to local time for display
                        const date = new Date(subscription.reminder_time);
                        const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
                        subscription.reminder_time = localDate.toISOString().slice(0, 16);
                    }
                    if (subscription.date_of_purchase) {
                        // Format date for date input type (YYYY-MM-DD)
                        const date = new Date(subscription.date_of_purchase);
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        subscription.date_of_purchase = `${year}-${month}-${day}`;
                    }
                    if (subscription.date_of_expiration) {
                        // Convert UTC to local time for display
                        const date = new Date(subscription.date_of_expiration);
                        const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
                        subscription.date_of_expiration = localDate.toISOString().slice(0, 16);
                    }
                });
            }
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

export async function addSubscription(formData: SubscriptionType) {
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

        if (formData.date_of_purchase && isNaN(new Date(formData.date_of_purchase).getTime())) {
            return { data: null, error: "The date of purchase must be a valid date." };
        }

        if (formData.reminder_time && isNaN(new Date(formData.reminder_time).getTime())) {
            return { data: null, error: "The reminder time must be a valid date with time." };
        }
        if (formData.reminder_time && new Date(formData.reminder_time) < new Date()) {
            return { data: null, error: "The reminder time must be in the future." };
        }

        if (!formData.date_of_expiration) {
            return { data: null, error: "The date of expiration field is required." };
        }
        if (isNaN(new Date(formData.date_of_expiration).getTime())) {
            return { data: null, error: "The date of expiration must be a valid date." };
        }
        if (formData.date_of_expiration && new Date(formData.date_of_expiration) < new Date()) {
            return { data: null, error: "The expiration date must be in the future." };
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
            if (value instanceof Date) {
                formDataToSend.append(key, value.toISOString());
            } else {
                formDataToSend.append(key, value.toString());
            }
        });

        const response = await fetch(`${process.env.BACKEND_URL}/subscription/store`, {
            method: 'POST',
            headers: {
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
export async function updateSubscription(formData: SubscriptionType) {
    try {
        if (formData.name && formData.name.length > 255) {
            return { data: null, error: "The Subscription's Name may not be greater than 255 characters." };
        }

        if (formData.seller_info && formData.seller_info.length > 255) {
            return { data: null, error: "The seller info may not be greater than 255 characters." };
        }

        if (formData.date_of_purchase && isNaN(new Date(formData.date_of_purchase).getTime())) {
            return { data: null, error: "The date of purchase must be a valid date." };
        }

        if (formData.reminder_time && isNaN(new Date(formData.reminder_time).getTime())) {
            return { data: null, error: "The reminder time must be a valid date with time." };
        }
        // if (formData.reminder_time && new Date(formData.reminder_time) < new Date()) {
        //     return { data: null, error: "The reminder time must be in the future." };
        // }

        if (formData.date_of_expiration && isNaN(new Date(formData.date_of_expiration).getTime())) {
            return { data: null, error: "The date of expiration must be a valid date." };
        }
        // if (formData.date_of_expiration && new Date(formData.date_of_expiration) < new Date()) {
        //     return { data: null, error: "The expiration date must be in the future." };
        // }
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