'use server';
import {delay} from "@/utils/timing";
import {UserProfileInfoType, GeneralInfoType, PasswordUpdateType} from "./types";
import {revalidatePath} from "next/cache";
import {isValidEmail} from "@/utils/validator";

const mockProfiles: UserProfileInfoType[] = [
    {
        first_name: 'John',
        last_name: 'Doe',
        dob: '1990-01-01',
        email: 'abc1@mail.com'
    },
    {
        first_name: 'Jane',
        last_name: 'Smith',
        dob: '1988-05-15',
        email: 'abc2@mail.com'
    },
    {
        first_name: 'Michael1',
        last_name: 'Johnson',
        dob: '1995-11-30',
        email: 'abc3@mail.com'
    },
    {
        first_name: 'Sarah',
        last_name: 'Williams',
        dob: '1992-07-22',
        email: 'abc4@mail.com'
    }
];

export async function fetchGeneralInfo() {
    try {
        const randomIndex = Math.floor(Math.random() * mockProfiles.length);
        const data = mockProfiles[randomIndex];
        await delay(1000); // Simulating API call
        return {data, error: null};
    } catch (error) {
        return {data: null, error: 'Failed to fetch profile information'};
    }
}

export async function updateGeneralInfo(formData: GeneralInfoType) {
    try {
        const data = JSON.stringify(formData);
        await delay(10000); // Simulating API call
        return {data: true, error: null};
    } catch (error) {
        return {error: 'Failed to update profile information'};
    } finally {
        revalidatePath('/profile');
    }
}

export async function fetchEmail() {
    try {
        const randomIndex = Math.floor(Math.random() * mockProfiles.length);
        const profile = mockProfiles[randomIndex];
        await delay(1000); // Simulating API call
        return {data: profile.email, error: null};
    } catch (error) {
        return {data: null, error: 'Failed to fetch Email.'};
    }
}

export async function updateEmail(email: string) {
    try {
        const validatedEmail: string | null = isValidEmail(email) ? email : null;
        await delay(2000); // Simulating API call
        return {data: true, error: null};
    } catch (error) {
        return {error: 'Failed to update Email.'};
    } finally {
        revalidatePath('/profile');
    }
}
export async function updatePassword(formData: PasswordUpdateType) {
    try {
        await delay(2000); // Simulating API call
        return {data: true, error: null};
    } catch (error) {
        return {error: 'Failed to update Password.'};
    } finally {
        revalidatePath('/profile');
    }
}