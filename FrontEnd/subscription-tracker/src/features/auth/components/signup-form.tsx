'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import SubmitButtonRegular from '@/components/buttons/submit-button-regular';
import FormInput from '@/components/forms/form-input';
import { delay } from '@/utils/timing';
import { SignupFormData } from '@/features/auth/types';

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

    const onSubmit = async (data: SignupFormData) => {
        try {
            // Simulate API call delay
            await delay(2000); // 2 seconds delay

            // TODO: Implement your signup logic here
            console.log(data);
        } catch (error) {
            console.error('Signup failed:', error);
        }
    };

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
            </form>
        </div>
    );
}
