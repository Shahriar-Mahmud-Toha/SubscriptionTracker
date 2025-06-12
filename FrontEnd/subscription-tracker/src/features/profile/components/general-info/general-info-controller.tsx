'use client';
import { startTransition, useEffect, useOptimistic } from 'react';
import { GeneralInfoType } from '@/features/profile/types';
import { useGeneralInfo } from '@/features/profile/contexts/general-info-context';
import GeneralInfoForm from '@/features/profile/components/general-info/general-info-form';
import { updateGeneralInfo } from '@/features/profile/actions';
import ShowGeneralInfo from '@/features/profile/components/general-info/show-general-info';
import ToastPromiseGeneral from '@/components/toasts/toast-promise-general';

export default function GeneralInfoController({ initialData }: { initialData: GeneralInfoType }) {
    const { isEditing, setIsEditing, backBtnClicked, setBackBtnClicked } = useGeneralInfo();

    const [optimisticData, updateOptimisticData] = useOptimistic(
        initialData,
        (state, newData: GeneralInfoType) => {
            return { ...state, ...newData }
        }
    );

    const handleUpdateGeneralInfo = async (formData: GeneralInfoType) => {
        setIsEditing(false);
        setBackBtnClicked(false);

        startTransition(async () => {
            updateOptimisticData(formData);

            ToastPromiseGeneral({
                promise: updateGeneralInfo(formData),
                loadingMessage: 'Updating General Info...',
                successMessage: 'General Information Updated Successfully',
                errorMessage: 'Failed to update General Information',
            });
        });
    };
    useEffect(() => {
        if (backBtnClicked && !isEditing) {
            setBackBtnClicked(false);
        }
    }, [backBtnClicked]);

    return (
        <>
            {isEditing && !backBtnClicked ? (
                <GeneralInfoForm
                    handleUpdate={handleUpdateGeneralInfo}
                    initialData={optimisticData}
                />
            ) : (
                <ShowGeneralInfo data={optimisticData} />
            )}
        </>
    );
}
