'use client';

import { useForm } from 'react-hook-form';
import SubmitButtonRegular from '@/components/buttons/submit-button-regular';
import FormInput from '@/components/forms/form-input';
import { delay } from '@/utils/timing';
import { GeneralInfoFormData } from '@/features/profile/types';
import { useRouter } from 'next/navigation';
import { useGeneralInfo } from '@/features/profile/contexts/general-info-context';
import { getGeneralInfo } from '@/features/profile/api/profile';


export default function GeneralInfoForm({ customClass }: { customClass?: string }) {
    const router = useRouter();
    const { isEditing, setIsEditing, isUpdated } = useGeneralInfo();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<GeneralInfoFormData>({
        mode: "onBlur",
    });

    const onSubmit = async (data: GeneralInfoFormData) => {
        try {
            // Simulate API call delay
            console.log(data);
            // TODO: Implement your update logic here
            await delay(2000); // 2 seconds delay

            // Call the success callback if provided
            isUpdated.current = true;
            setIsEditing(false);
            getGeneralInfo(); //re-work needed. GO for states and make client.
            router.refresh();
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    return (
        <div className={`w-full max-w-md mx-auto bg-secondary-background rounded-xl shadow-lg ${customClass}`}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                <FormInput<GeneralInfoFormData>
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

                <FormInput<GeneralInfoFormData>
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
                <FormInput<GeneralInfoFormData>
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
