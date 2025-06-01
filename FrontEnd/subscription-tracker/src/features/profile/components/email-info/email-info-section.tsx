import {fetchEmail} from "@/features/profile/actions";
import EmailInfoController from "@/features/profile/components/email-info/email-info-controller";

export async function EmailInfoSection() {
    const response = await fetchEmail();

    if (response.error) {
        return <p>Error fetching data</p>
    }
    if (!response.data) {
        return (
            <EmailInfoController initialData={""}/>
        );
    }
    return (
        <EmailInfoController initialData={response.data}/>
    );
}