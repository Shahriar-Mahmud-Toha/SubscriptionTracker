import InfoField from "@/components/data-showcase/info-field";
import { formatStringDateToReadable } from "@/utils/helper";
import { GeneralInfoType } from "@/features/profile/types";

export default function ShowGeneralInfo({ data, customClass }: { data: GeneralInfoType, customClass?: string }) {

    return (
        <div className={`${customClass}`}>
            <div className="space-y-4">
                <InfoField
                    label="First Name"
                    value={data.first_name || 'Add First Name'}
                />
                <InfoField
                    label="Last Name"
                    value={data.last_name || 'Add Last Name'}
                />
                <InfoField
                    label="Date of Birth"
                    value={data.dob ? formatStringDateToReadable(data.dob) : 'Add Date of Birth'}
                />
            </div>
        </div>
    );
}