'use client';
import { startTransition, useEffect } from 'react';
import { PasswordUpdateType } from '@/features/profile/types';
import { updatePassword } from '@/features/profile/actions';
import ToastPromiseGeneral from '@/components/toasts/toast-promise-general';
import { usePasswordUpdate } from '@/features/profile/contexts/password-update-context';
import PasswordUpdateForm from '@/features/profile/components/password-update/password-update-form';

export default function PasswordUpdateController() {
    const { isEditing, setIsEditing, backBtnClicked, setBackBtnClicked } = usePasswordUpdate();

    const handleUpdatePassword = async (formData: PasswordUpdateType) => {
        setIsEditing(false);
        setBackBtnClicked(false);

        startTransition(async () => {
            ToastPromiseGeneral({
                promise: updatePassword(formData),
                loadingMessage: 'Updating Password...',
                successMessage: 'Password Updated Successfully',
                errorMessage: 'Failed to update Password',
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
                <PasswordUpdateForm
                    handleUpdate={handleUpdatePassword}
                />
            ) : ""}
        </>
    );
}
