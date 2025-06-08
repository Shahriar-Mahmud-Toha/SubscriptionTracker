'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import FormInput from '@/components/forms/form-input';
import SubmitButtonRegular from '@/components/buttons/submit-button-regular';
import { ResetPasswordFormData } from '@/features/auth/types';
import { resetPassword } from '@/features/subscription/actions';
import ToastGeneralSuccess from '@/components/toasts/toast-general-success';
import ToastGeneralError from '@/components/toasts/toast-general-error';

export default function ResetPasswordForm({ token, customClass = "" }: { token: string, customClass?: string }) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting, isSubmitSuccessful },
    } = useForm<ResetPasswordFormData>({
        mode: "onBlur",
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        const result = await resetPassword(token, data);
        if (!result.error) {
            ToastGeneralSuccess(result.data);
            router.push('/login');
        } else {
            ToastGeneralError(result.error);
            router.push('/forgot');
        }
    };

    return (
        <div className={`w-full max-w-md mx-auto p-6 bg-secondary-background rounded-xl shadow-lg ${customClass}`}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                <FormInput<ResetPasswordFormData>
                    id="password"
                    label="New Password"
                    type="password"
                    placeholder="Enter your new password"
                    register={register}
                    errors={errors}
                    validation={{
                        required: "Password is required",
                        minLength: {
                            value: 3,
                            message: "Password must be at least 3 characters",
                        },
                    }}
                />

                <FormInput<ResetPasswordFormData>
                    id="password_confirmation"
                    label="Confirm New Password"
                    type="password"
                    placeholder="Confirm your new password"
                    register={register}
                    errors={errors}
                    validation={{
                        required: "Please confirm your password",
                        validate: (value: string) =>
                            value === watch("password") || "Passwords do not match",
                    }}
                />

                <SubmitButtonRegular
                    isSubmitting={isSubmitting}
                    disabledText="Resetting Password..."
                    text="Reset Password"
                    disabledOnSubmit={isSubmitSuccessful}
                    customClasses=""
                />
            </form>
        </div>
    );
}
