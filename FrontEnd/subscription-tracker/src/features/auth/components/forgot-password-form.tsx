'use client';

import { useForm } from 'react-hook-form';
import SubmitButtonRegular from '@/components/buttons/submit-button-regular';
import FormInput from '@/components/forms/form-input';
import { ForgotPasswordFormData } from '@/features/auth/types';
import { forgotPassword } from '@/features/subscription/actions';
import ToastGeneralSuccess from '@/components/toasts/toast-general-success';
import ToastGeneralError from '@/components/toasts/toast-general-error';

export default function ForgotPasswordForm({ customClass }: { customClass?: string }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordFormData>({
        mode: "onBlur",
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        const result = await forgotPassword(data.email);
        if (!result.error) {
            ToastGeneralSuccess(result.data);
        } else {
            ToastGeneralError(result.error);
        }
    };

    return (
        <div className={`w-full max-w-md mx-auto p-6 bg-secondary-background rounded-xl shadow-lg ${customClass}`}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                <FormInput<ForgotPasswordFormData>
                    id="email"
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    register={register}
                    errors={errors}
                    validation={{
                        required: "The email field is required.",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Please enter a valid email address.",
                        },
                        maxLength: {
                            value: 255,
                            message: "Max email address length is 255 characters.",
                        },
                    }}
                />

                <SubmitButtonRegular isSubmitting={isSubmitting} disabledText="Sending Reset Link..." text="Send Password Reset Link" customClasses="" />
            </form>
        </div>
    );
}
