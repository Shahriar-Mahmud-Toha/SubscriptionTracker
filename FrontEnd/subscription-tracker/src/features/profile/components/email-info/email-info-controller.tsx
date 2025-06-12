'use client';
import { startTransition, useEffect, useOptimistic } from 'react';
import {updateEmail} from '@/features/profile/actions';
import ToastPromiseGeneral from '@/components/toasts/toast-promise-general';
import {useEmailInfo} from "@/features/profile/contexts/email-info-context";
import EmailUpdateForm from "@/features/profile/components/email-info/email-update-form";
import ShowEmail from "@/features/profile/components/email-info/show-email";
import { EmailType } from '@/features/profile/types';

export default function EmailInfoController({ initialData }: { initialData: string }) {
    const { isEditing, setIsEditing, backBtnClicked, setBackBtnClicked } = useEmailInfo();

    const [optimisticEmailData, updateOptimisticEmailData] = useOptimistic(
        initialData,
        (state: string, newData: string) => {
            return newData; 
        }
    );

    const handleUpdateEmail = async (formData: EmailType) => {
        setIsEditing(false);
        setBackBtnClicked(false);

        startTransition(async () => {
            updateOptimisticEmailData(formData.email);

            ToastPromiseGeneral({
                promise: updateEmail(formData.email),
                loadingMessage: 'Email Verification Link Sending...',
                successMessage: 'Email Verification Link Sent Successfully',
                errorMessage: 'Failed to send Email Verification Link',
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
                <EmailUpdateForm
                    handleUpdate={handleUpdateEmail}
                    initialData={optimisticEmailData}
                />
            ) : (
                <ShowEmail email={optimisticEmailData} />
            )}
        </>
    );
}
