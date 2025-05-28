import { GeneralInfoFormData } from "@/features/profile/types";

const mockProfiles: GeneralInfoFormData[] = [
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
        first_name: 'Michael',
        last_name: 'Johnson',
        dob: '1995-11-30'
    },
    {
        first_name: 'Sarah',
        last_name: 'Williams',
        dob: '1992-07-22'
    }
];

export async function getGeneralInfo(): Promise<GeneralInfoFormData> {
    // Generate random index between 0 and 3
    const randomIndex = Math.floor(Math.random() * mockProfiles.length);

    // Return the randomly selected profile
    return mockProfiles[randomIndex];
} 