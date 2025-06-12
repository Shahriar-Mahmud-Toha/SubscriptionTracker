import {fetchEmail} from "@/features/profile/actions";
import EmailInfoController from "@/features/profile/components/email-info/email-info-controller";
import { redirect } from "next/navigation";

export async function EmailInfoSection() {
    const response = await fetchEmail();

    if (response?.status === 401 && response.error) {
        redirect("/login");
    }
    if (response.error) {
        return (
            <p className="text-red-general text-center">
                {response.error}
            </p>
        );
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