'use server';
import { GeneralInfoType, PasswordUpdateType } from "./types";
import { revalidatePath } from "next/cache";
import { getAuthToken } from "@/features/auth/actions";
import { getClientIP, getDeviceInfo } from "@/actions";

export async function fetchGeneralInfo() {
    try {
        const { token, error } = await getAuthToken();
        if (error) {
            return { data: null, error: error };
        }
        const response = await fetch(`${process.env.BACKEND_URL}/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.status === 200 && data.id) {
            return { data: data.user, error: null };
        }
        if (response.status === 401 && data?.message) {
            return { data: null, error: data.message, status: response.status };
        }
        return { data: null, error: `Failed to fetch profile - status: ${response.status}` };
    } catch (error) {
        return { data: null, error: 'Failed to fetch profile - internal server error' };
    }
}

export async function updateGeneralInfo(formData: GeneralInfoType) {
    const filteredData: Partial<GeneralInfoType> = {};
    Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            filteredData[key as keyof GeneralInfoType] = value;
        }
    });
    try {
        const { token, error } = await getAuthToken();
        if (error) {
            return { data: null, error: error };
        }
        const response = await fetch(`${process.env.BACKEND_URL}/update`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(filteredData),
        });
        const data = await response.json();
        if (response.status === 200 && data.message) {
            return { data: data.message, error: null };
        }
        if (response.status === 201 && data.id) {
            return { data, error: null };
        }
        if (response.status === 401 && data?.message) {
            return { data: null, error: data.message, status: response.status };
        }
        return { data: null, error: `Failed to update profile - status: ${response.status}` };
    } catch (error) {
        return { data: null, error: 'Failed to update profile information' };
    } finally {
        revalidatePath('/profile');
    }
}

export async function fetchEmail() {
    try {
        const { token, error } = await getAuthToken();
        if (error) {
            return { data: null, error: error };
        }
        const response = await fetch(`${process.env.BACKEND_URL}/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.status === 200 && data.id) {
            return { data: data.email, error: null };
        }
        if (response.status === 401 && data?.message) {
            return { data: null, error: data.message, status: response.status };
        }
        return { data: null, error: `Failed to fetch profile - status: ${response.status}` };
    } catch (error) {
        return { data: null, error: 'Failed to fetch profile - internal server error' };
    }
}

export async function updateEmail(email: string) {
    try {
        const { token, error } = await getAuthToken();
        if (error) {
            return { data: null, error: error };
        }
        const response = await fetch(`${process.env.BACKEND_URL}/update/email`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ email: email }),
        });
        const data = await response.json();
        if (response.status === 200 && data.message) {
            return { data: data.message, error: null };
        }
        if (response.status === 400) {
            return { data: null, error: data };
        }
        if (response.status === 401 && data?.message) {
            return { data: null, error: data.message, status: response.status };
        }
        return { data: null, error: `Failed to update Email - status: ${response.status}` };
    } catch (error) {
        return { data: null, error: 'Failed to update Email information' };
    }
}
export async function verifyUpdateEmail(path: string, uid: string) {
    try {
        const [clientIP, deviceInfo] = await Promise.all([
            getClientIP(),
            getDeviceInfo()
        ]);
        const response = await fetch(`${process.env.BACKEND_URL}/user/update${path}`, {
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
        if (response.status === 400 && data?.message) {
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
export async function updatePassword(formData: PasswordUpdateType) {
    try {
        const { token, error } = await getAuthToken();
        if (error) {
            return { data: null, error: error };
        }
        const response = await fetch(`${process.env.BACKEND_URL}/update/password`, {
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
        if (response.status === 401 && data?.message) {
            return { data: null, error: data.message, status: response.status };
        }
        return { data: null, error: `Failed to update password - status: ${response.status}` };
    } catch (error) {
        return { data: null, error: 'Failed to update password' };
    }
}