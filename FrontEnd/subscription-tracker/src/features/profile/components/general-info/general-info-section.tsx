import { fetchGeneralInfo } from "@/features/profile/actions";
import GeneralInfoController from "@/features/profile/components/general-info/general-info-controller";

export default async function GeneralInfoSection() {
    const response = await fetchGeneralInfo();
    if (response.error) {
        return <p>Error fetching data</p>
    }
    if (!response.data) {
        return <GeneralInfoController initialData={{
            first_name: '',
            last_name: '',
            dob: ''
        }} />
    }
    return (
        <GeneralInfoController initialData={response.data} />
    );
}