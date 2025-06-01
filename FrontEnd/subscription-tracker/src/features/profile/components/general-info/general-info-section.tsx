import {fetchGeneralInfo} from "@/features/profile/actions";
import GeneralInfoController from "@/features/profile/components/general-info/general-info-controller";
import {GeneralInfoType} from "@/features/profile/types";

export default async function GeneralInfoSection() {
    const response = await fetchGeneralInfo();
    const DEFAULT_GENERAL_INFO: GeneralInfoType = {
        first_name: '',
        last_name: '',
        dob: ''
    };

    if (response.error) {
        return <p>Error fetching data</p>
    }
    if (!response.data) {
        return (
            <GeneralInfoController initialData={DEFAULT_GENERAL_INFO}/>
        );
    }
    return (
        <GeneralInfoController initialData={response.data}/>
    );
}