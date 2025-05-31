'use client';

import { useForm } from 'react-hook-form';
import SubmitButtonRegular from '@/components/buttons/submit-button-regular';
import FormInput from '@/components/forms/form-input';
import { GeneralInfoType } from '@/features/profile/types';

export default function GeneralInfoForm({handleUpdate, customClass }: { handleUpdate: (data: GeneralInfoType) => Promise<void>, customClass?: string }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<GeneralInfoType>({
        mode: "onBlur",
    });

    return (
        <div className={`w-full max-w-md mx-auto bg-secondary-background rounded-xl shadow-lg ${customClass}`}>
            <form onSubmit={handleSubmit(handleUpdate)} className="space-y-6" noValidate>
                <FormInput<GeneralInfoType>
                    id="first_name"
                    label="First Name"
                    type="text"
                    placeholder="Enter your first name"
                    register={register}
                    errors={errors}
                    validation={{
                        required: "The first name field is required.",
                        pattern: {
                            value: /^[a-zA-Z\s]*$/,
                            message: "The first name must contain only letters and spaces.",
                        },
                        maxLength: {
                            value: 255,
                            message: "The first name may not be greater than 255 characters.",
                        },
                    }}
                />

                <FormInput<GeneralInfoType>
                    id="last_name"
                    label="Last Name"
                    type="text"
                    placeholder="Enter your last name"
                    register={register}
                    errors={errors}
                    validation={{
                        required: "The last name field is required.",
                        pattern: {
                            value: /^[a-zA-Z\s]*$/,
                            message: "The last name must contain only letters and spaces.",
                        },
                        maxLength: {
                            value: 255,
                            message: "The last name may not be greater than 255 characters.",
                        },
                    }}
                />
                <FormInput<GeneralInfoType>
                    id="dob"
                    label="Date of Birth"
                    type="date"
                    placeholder="Enter your date of birth"
                    register={register}
                    errors={errors}
                    validation={{
                        required: "The date of birth field is required.",
                        validate: {
                            isValidDate: (value) => {
                                const date = new Date(value);
                                return !isNaN(date.getTime()) || "The date of birth must be a valid date.";
                            },
                            notFutureDate: (value) => {
                                const date = new Date(value);
                                return date <= new Date() || "The date of birth cannot be in the future.";
                            }
                        }
                    }}
                />

                <SubmitButtonRegular isSubmitting={isSubmitting} disabledText="Updating..." text="Update" customClasses="" />
            </form>
        </div>
    );
}
