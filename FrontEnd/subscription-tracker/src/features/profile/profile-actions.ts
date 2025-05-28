import { getGeneralInfo } from "@/features/profile/api/profile";

export async function fetchGeneralInfo() {
    try {
        const data = await getGeneralInfo();
        return { data, error: null };
    } catch (error) {
        return { data: null, error: 'Failed to fetch profile information' };
    }
} 