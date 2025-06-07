'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import SubmitButtonRegular from '@/components/buttons/submit-button-regular';
import FormInput from '@/components/forms/form-input';
import { SignupFormData } from '@/features/auth/types';
import { resendVerificationLink, signup } from '@/features/subscription/actions';
import ToastGeneralError from '@/components/toasts/toast-general-error';
import ToastGeneralSuccess from '@/components/toasts/toast-general-success';

const RESEND_COOLDOWN_TIME = 5; // in Seconds

export default function SignupForm({ customClass }: { customClass?: string }) {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting, isSubmitSuccessful },
    } = useForm<SignupFormData>({
        mode: "onBlur",
    });

    const [resendVerificationEmail, setResendVerificationEmail] = useState(false);
    const [cooldownTime, setCooldownTime] = useState(0);
    const [isResending, setIsResending] = useState(false);
    const [resendAttempts, setResendAttempts] = useState(0);

    const MAX_RESEND_ATTEMPTS = 3;

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (cooldownTime > 0) {
            timer = setInterval(() => {
                setCooldownTime((prev) => prev - 1);
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [cooldownTime]);

    const onSubmit = async (data: SignupFormData) => {
        const response = await signup(data);
        if (!response.error) {
            document.cookie = `signup_token=; max-age=0; path=/`;
            setResendAttempts(0);
            document.cookie = `signup_token=${response.data.token}; max-age=3600; path=/`;
            ToastGeneralSuccess(response.data.message, 5000);
            setResendVerificationEmail(true);
        } else {
            ToastGeneralError(response.error);
        }
    };

    const handleResendVerificationEmail = async () => {
        if (cooldownTime > 0 || isResending) return;

        const signupToken = document.cookie.split('signup_token=')[1];
        if (!signupToken) {
            ToastGeneralError("No signup information found. Signup first!");
            return;
        }

        setIsResending(true);
        const response = await resendVerificationLink(signupToken);
        if (!response.error) {
            const newAttempts = resendAttempts + 1;
            setResendAttempts(newAttempts);

            if (newAttempts >= MAX_RESEND_ATTEMPTS) {
                document.cookie = `signup_token=; max-age=0; path=/`;
                setResendVerificationEmail(false);
                ToastGeneralSuccess("Maximum resend attempts reached. Please sign up again if needed.", 5000);
            } else {
                ToastGeneralSuccess("Verification link resent successfully.", 5000);
                setCooldownTime(RESEND_COOLDOWN_TIME);
            }
        } else {
            ToastGeneralError(response.error);
        }
        setIsResending(false);
    }

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful, reset]);

    return (
        <div className={`w-full max-w-md mx-auto p-6 bg-secondary-background rounded-xl shadow-lg ${customClass}`}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                <FormInput<SignupFormData>
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

                <FormInput<SignupFormData>
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="Create a password"
                    register={register}
                    errors={errors}
                    validation={{
                        required: "The password field is required.",
                        minLength: {
                            value: 3,
                            message: "The password must be at least 3 characters long.",
                        },
                    }}
                />

                <FormInput<SignupFormData>
                    id="password_confirmation"
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm your password"
                    register={register}
                    errors={errors}
                    validation={{
                        required: "Please confirm your password.",
                        validate: (value: string) =>
                            value === watch("password") || "Password confirmation does not match."
                    }}
                />

                <SubmitButtonRegular isSubmitting={isSubmitting} disabledText="Creating Account..." text="Sign Up" customClasses="" />
                {(resendVerificationEmail || cooldownTime > 0) && resendAttempts < MAX_RESEND_ATTEMPTS && (
                    <div className="flex flex-col items-center justify-center">
                        <button
                            type="button"
                            className={`underline text-sm enabled:hover:text-custom-violet enabled:cursor-pointer enabled:hover:scale-105 ${(cooldownTime > 0 || isResending) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleResendVerificationEmail}
                            disabled={cooldownTime > 0 || isResending}
                        >
                            {isResending ? 'Sending...' :
                                cooldownTime > 0 ? `Resend available in ${Math.floor(cooldownTime / 60)}:${(cooldownTime % 60).toString().padStart(2, '0')}` :
                                    `Resend Verification Email (${MAX_RESEND_ATTEMPTS - resendAttempts} attempts left)`}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
