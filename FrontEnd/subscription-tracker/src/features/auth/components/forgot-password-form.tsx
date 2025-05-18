'use client';

import { useForm } from 'react-hook-form';
import SubmitButtonRegular from '@/components/buttons/submit-button-regular';
import FormInput from '@/components/forms/form-input';
import { delay } from '@/utils/timing';
import { ForgotPasswordFormData } from '@/features/auth/types';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordForm({ customClass }: { customClass?: string }) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitSuccessful },
    } = useForm<ForgotPasswordFormData>({
        mode: "onBlur",
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        try {
            // Simulate API call delay
            console.log(data);
            // TODO: Implement your login logic here
            await delay(2000); // 2 seconds delay

            // router.push('/login'); //temporary
        } catch (error) {
            console.error('Forgot Password failed:', error);
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
                {isSubmitSuccessful && (
                    <p className="text-sm text-custom-violet">
                        We will send a link to your email to reset your password.
                    </p>
                )}

                <SubmitButtonRegular isSubmitting={isSubmitting} disabledText="Sending Reset Link..." text="Send Password Reset Link" customClasses="" disabledOnSubmit={isSubmitSuccessful} />
            </form>
        </div>
    );
}
