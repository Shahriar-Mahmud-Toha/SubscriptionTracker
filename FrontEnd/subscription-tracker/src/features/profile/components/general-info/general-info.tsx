'use client';

import { useEffect, useState } from "react";
import { format } from "date-fns";
import InfoField from "@/components/data-showcase/info-field";
import { fetchGeneralInfo } from "@/features/profile/profile-actions";
import GeneralInfoLoader from "@/features/profile/components/general-info/general-info-loader";
import { useGeneralInfo } from "@/features/profile/contexts/general-info-context";

export default function GeneralInfo({ customClass }: { customClass?: string }) {
    const { data, setData, error, setError, isUpdated, backBtnClicked } = useGeneralInfo();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            if (!isUpdated.current && backBtnClicked) {
                setIsLoading(false);
                return;
            }
            const result = await fetchGeneralInfo();
            if (result.error) {
                setError(result.error);
            } else {
                setData(result.data);
            }
            setIsLoading(false);
        }
        loadData();
    }, []);

    if (isLoading) {
        return (
            <GeneralInfoLoader />
        );
    }

    if (error) {
        return (
            <div className="text-center py-4 text-red-500">
                {error}
            </div>
        );
    }

    if (!data) return null;

    const formattedDate = format(new Date(data.dob), 'MMMM d, yyyy');

    return (
        <div className={`${customClass}`}>
            <div className="space-y-4">
                <InfoField
                    label="First Name"
                    value={data.first_name}
                />
                <InfoField
                    label="Last Name"
                    value={data.last_name}
                />
                <InfoField
                    label="Date of Birth"
                    value={formattedDate}
                />
            </div>
        </div>
    );
}