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
        return { data: null, error: `Failed to update subscription - status: ${response.status}` };
    } catch (error) {
        return { data: null, error: 'Failed to update subscription information' };
    } finally {
        revalidatePath('/dashboard');
    }
}
export async function deleteSubscription(id: string) {
    try {
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