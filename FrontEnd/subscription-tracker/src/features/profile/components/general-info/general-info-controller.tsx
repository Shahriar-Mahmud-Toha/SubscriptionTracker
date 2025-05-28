'use client';

import { useGeneralInfo } from '@/features/profile/contexts/general-info-context';
import GeneralInfoForm from '@/features/profile/components/general-info/general-info-form';
import GeneralInfo from '@/features/profile/components/general-info/general-info';

export default function GeneralInfoController() {
    const { isEditing, backBtnClicked } = useGeneralInfo();

    return (
        <>
            {isEditing && !backBtnClicked ? (
                <GeneralInfoForm
                    customClass={""}
                />
            ) : (
                <GeneralInfo
                    customClass={""}
                />
            )}
        </>
    );
}
