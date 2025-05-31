'use server';
import { delay } from "@/utils/timing";
import { GeneralInfoType } from "./types";
import { revalidatePath } from "next/cache";

const mockProfiles: GeneralInfoType[] = [
    {
        first_name: 'John',
        last_name: 'Doe',
        dob: '1990-01-01'
    },
    {
        first_name: 'Jane',
        last_name: 'Smith',
        dob: '1988-05-15'
    },
    {
        first_name: 'Michael1',
        last_name: 'Johnson',
        dob: '1995-11-30'
    },
    {
        first_name: 'Sarah',
        last_name: 'Williams',
        dob: '1992-07-22'
    }
];

export async function fetchGeneralInfo() {
    try {
        const randomIndex = Math.floor(Math.random() * mockProfiles.length);
        const data = mockProfiles[randomIndex];
        await delay(1000); // Simulating API call
        return { data, error: null };
    } catch (error) {
        return { data: null, error: 'Failed to fetch profile information' };
    }
} 
export async function updateGeneralInfo(formData: GeneralInfoType) {
    try {
        const data = await JSON.stringify(formData);
        await delay(2000); // Simulating API call
        return { data: true, error: null };
    } catch (error) {
        return { error: 'SS: Failed to update profile information' };
    }
    finally {
        revalidatePath('/profile');
    }
}