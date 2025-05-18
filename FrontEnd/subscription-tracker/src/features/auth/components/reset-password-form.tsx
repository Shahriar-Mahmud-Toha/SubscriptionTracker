'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import FormInput from '@/components/forms/form-input';
import SubmitButtonRegular from '@/components/buttons/submit-button-regular';
import { delay } from '@/utils/timing';
import { ResetPasswordFormData } from '@/features/auth/types';


export default function ResetPasswordForm({ email, token, customClass = "" }: { email: string, token: string, customClass?: string }) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordFormData>({
        mode: "onBlur",
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        try {
            // Combine form data with token
            const resetData = {
                email,
                token,
                ...data
            };

            console.log(resetData);

            // const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/password/reset`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Accept': 'application/json', 
            //     },
            //     body: JSON.stringify(resetData),
            // });

            // const responseData = await response.json();

            // if (!response.ok) {
            //     throw new Error(responseData.message || 'Password reset failed');
            // }

            // Optional: Add a small delay for better UX
            await delay(500);

            // Redirect to login after successful password reset
            router.push('/login');
        } catch (error) {
            console.error('Reset Password failed:', error);
            // TODO: Add error toast notification here
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
                    customClasses=""
                />
            </form>
        </div>
    );
}
