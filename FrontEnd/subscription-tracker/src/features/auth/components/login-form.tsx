'use client';

import { useForm } from 'react-hook-form';
import SubmitButtonRegular from '@/components/buttons/submit-button-regular';
import FormInput from '@/components/forms/form-input';
import { delay } from '@/utils/timing';
import { LoginFormData } from '@/features/auth/types';
import { useRouter } from 'next/navigation';

export default function LoginForm({ customClass }: { customClass?: string }) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        mode: "onBlur",
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            // Simulate API call delay
            console.log(data);
            // TODO: Implement your login logic here
            await delay(2000); // 2 seconds delay

            router.push('/signup'); //temporary
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div className={`w-full max-w-md mx-auto p-6 bg-secondary-background rounded-xl shadow-lg ${customClass}`}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                <FormInput<LoginFormData>
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

                <FormInput<LoginFormData>
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    register={register}
                    errors={errors}
                    validation={{
                        required: "The password field is required.",
                    }}
                />

                <SubmitButtonRegular isSubmitting={isSubmitting} disabledText="Logging in..." text="Login" customClasses="" />
            </form>
        </div>
    );
}
