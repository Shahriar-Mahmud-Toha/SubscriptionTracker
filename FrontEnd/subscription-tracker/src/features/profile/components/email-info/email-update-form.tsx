'use client';

import { useForm } from 'react-hook-form';
import SubmitButtonRegular from '@/components/buttons/submit-button-regular';
import FormInput from '@/components/forms/form-input';
import { EmailType} from '@/features/profile/types';

export default function EmailUpdateForm({ handleUpdate, initialData, customClass = "" }: { handleUpdate: (data: EmailType) => Promise<void>, initialData: string, customClass?: string }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<EmailType>({
        mode: "onBlur",
    });

    return (
        <div className={`w-full max-w-md mx-auto bg-secondary-background rounded-xl shadow-lg ${customClass}`}>
            <form onSubmit={handleSubmit(handleUpdate)} className="space-y-6" noValidate>
                <FormInput<EmailType>
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="Enter your new email"
                    defaultValue={initialData}
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
                <SubmitButtonRegular isSubmitting={isSubmitting} disabledText="Updating..." text="Update" customClasses="" />
            </form>
        </div>
    );
}
