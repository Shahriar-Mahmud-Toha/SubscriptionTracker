'use client';

import { useForm } from 'react-hook-form';
import SubmitButtonRegular from '@/components/buttons/submit-button-regular';
import FormInput from '@/components/forms/form-input';
import { GeneralInfoType } from '@/features/profile/types';

export default function GeneralInfoForm({
    handleUpdate,
    initialData,
    customClass = "" // provide default empty string
}: {
    handleUpdate: (data: GeneralInfoType) => Promise<void>,
    initialData: GeneralInfoType,
    customClass?: string
}) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<GeneralInfoType>({
        mode: "onBlur",
    });

    const formClass = `w-full max-w-md mx-auto bg-secondary-background rounded-xl shadow-lg ${customClass}`.trim();

    return (
        <div className={formClass}>
            <form onSubmit={handleSubmit(handleUpdate)} className="space-y-6" noValidate>
                <FormInput<GeneralInfoType>
                    id="first_name"
                    label="First Name"
                    type="text"
                    placeholder="Enter your first name"
                    defaultValue={initialData.first_name}
                    register={register}
                    errors={errors}
                    validation={{
                        validate: (value: string) => {
                            if (!value) return true;
                            if (!/^[a-zA-Z\s]*$/.test(value)) {
                                return "The first name must contain only letters and spaces.";
                            }
                            if (value.length > 255) {
                                return "The first name may not be greater than 255 characters.";
                            }
                            return true;
                        },
                    }}
                />

                <FormInput<GeneralInfoType>
                    id="last_name"
                    label="Last Name"
                    type="text"
                    placeholder="Enter your last name"
                    defaultValue={initialData.last_name}
                    register={register}
                    errors={errors}
                    validation={{
                        validate: (value: string) => {
                            if (!value) return true;
                            if (!/^[a-zA-Z\s]*$/.test(value)) {
                                return "The last name must contain only letters and spaces.";
                            }
                            if (value.length > 255) {
                                return "The last name may not be greater than 255 characters.";
                            }
                            return true;
                        },
                    }}
                />
                <FormInput<GeneralInfoType>
                    id="dob"
                    label="Date of Birth"
                    type="date"
                    placeholder="Enter your date of birth"
                    defaultValue={initialData.dob}
                    register={register}
                    errors={errors}
                    validation={{
                        validate: (value: string) => {
                            if (!value) return true;
                            const date = new Date(value);
                            if (isNaN(date.getTime())) {
                                return "The date of birth must be a valid date.";
                            }
                            if (date > new Date()) {
                                return "The date of birth cannot be in the future.";
                            }
                            return true;
                        },
                    }}
                />

                <SubmitButtonRegular isSubmitting={isSubmitting} disabledText="Updating..." text="Update" customClasses="" />
            </form>
        </div>
    );
}
