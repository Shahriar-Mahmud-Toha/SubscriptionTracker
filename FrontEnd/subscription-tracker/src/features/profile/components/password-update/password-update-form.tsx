'use client';

import { useForm } from 'react-hook-form';
import SubmitButtonRegular from '@/components/buttons/submit-button-regular';
import FormInput from '@/components/forms/form-input';
import { PasswordUpdateType } from '@/features/profile/types';

export default function PasswordUpdateForm({
    handleUpdate,
    customClass = "" 
}: {
    handleUpdate: (data: PasswordUpdateType) => Promise<void>,
    customClass?: string
}) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<PasswordUpdateType>({
        mode: "onBlur",
    });

    return (
        <div className={`w-full max-w-md mx-auto bg-secondary-background rounded-xl shadow-lg ${customClass}`}>
            <form onSubmit={handleSubmit(handleUpdate)} className="space-y-6" noValidate>
                <FormInput<PasswordUpdateType>
                    id="current_password"
                    label="Current Password"
                    type="password"
                    placeholder="Enter your current password"
                    register={register}
                    errors={errors}
                    validation={{
                        required: "The password field is required.",
                    }}
                />
                <FormInput<PasswordUpdateType>
                    id="password"
                    label="New Password"
                    type="password"
                    placeholder="Create a new password"
                    register={register}
                    errors={errors}
                    validation={{
                        required: "The new password field is required.",
                        minLength: {
                            value: 3,
                            message: "The password must be at least 3 characters long.",
                        },
                    }}
                />

                <FormInput<PasswordUpdateType>
                    id="password_confirmation"
                    label="Confirm New Password"
                    type="password"
                    placeholder="Confirm your new password"
                    register={register}
                    errors={errors}
                    validation={{
                        required: "Please confirm your new password.",
                        validate: (value: string) =>
                            value === watch("password") || "New Password confirmation does not match."
                    }}
                />

                <SubmitButtonRegular isSubmitting={isSubmitting} disabledText="Updating..." text="Update" customClasses="" />
            </form>
        </div>
    );
}
