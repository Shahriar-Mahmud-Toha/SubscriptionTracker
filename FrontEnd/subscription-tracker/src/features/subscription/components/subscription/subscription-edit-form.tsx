'use client';

import { useForm } from 'react-hook-form';
import SubmitButtonRegular from '@/components/buttons/submit-button-regular';
import FormInput from '@/components/forms/form-input';
import { SubscriptionType } from '@/features/subscription/types';
import { currencyOptions } from '@/utils/helper';

export default function SubscriptionEditForm({ subscription, onEdit, customClass = "" }: { subscription: SubscriptionType, onEdit: (subscription: SubscriptionType) => void, customClass?: string }) {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch
    } = useForm<SubscriptionType>({
        mode: "onBlur",
        defaultValues: subscription
    });

    // Watch the date fields to compare with original values
    const reminderTime = watch('reminder_time');
    const expirationTime = watch('date_of_expiration');

    return (
        <div className={`w-full max-w-md mx-auto bg-secondary-background rounded-xl shadow-lg ${customClass}`}>
            <form onSubmit={handleSubmit(onEdit)} className="space-y-6" noValidate>
                <FormInput<SubscriptionType>
                    id="name"
                    label="Name"
                    type="text"
                    placeholder="Enter Subscription Name"
                    register={register}
                    errors={errors}
                    validation={{
                        required: "The Subscription Name field is required.",
                        maxLength: {
                            value: 255,
                            message: "The Subscription Name may not be greater than 255 characters.",
                        },
                    }}
                />

                <FormInput<SubscriptionType>
                    id="seller_info"
                    label="Seller Info"
                    type="text"
                    placeholder="Enter subscription seller information"
                    register={register}
                    errors={errors}
                    validation={{
                        validate: {
                            maxLength: (value) => !value || (typeof value === 'string' && value.length <= 255) || "The seller info may not be greater than 255 characters."
                        }
                    }}
                />
                <FormInput<SubscriptionType>
                    id="date_of_purchase"
                    label="Date of Purchase"
                    type="date"
                    placeholder="Enter date of purchase"
                    register={register}
                    errors={errors}
                    validation={{
                        validate: {
                            isValidDate: (value) => !value || !isNaN(new Date(value as string).getTime()) || "The date of purchase must be a valid date."
                        }
                    }}
                />
                <FormInput<SubscriptionType>
                    id="reminder_time"
                    label="Reminder Time"
                    type="datetime-local"
                    placeholder="Enter reminder time"
                    register={register}
                    errors={errors}
                    validation={{
                        validate: {
                            isValidDate: (value) => !value || !isNaN(new Date(value as string).getTime()) || "The reminder time must be a valid date with time.",
                            isFutureDate: (value) => {
                                if (!value) return true;
                                // Only validate if the date has changed
                                if (value === subscription.reminder_time) return true;
                                return new Date(value as string) > new Date() || "The reminder time must be in the future.";
                            }
                        }
                    }}
                />
                <FormInput<SubscriptionType>
                    id="date_of_expiration"
                    label="Date of Expiration"
                    type="datetime-local"
                    placeholder="Enter time of expiration"
                    register={register}
                    errors={errors}
                    validation={{
                        validate: {
                            required: (value) => Boolean(value) || "The date of expiration field is required.",
                            isValidDate: (value) => !value || !isNaN(new Date(value as string).getTime()) || "The date of expiration must be a valid date.",
                            isFutureDate: (value) => {
                                if (!value) return true;
                                // Only validate if the date has changed
                                if (value === subscription.date_of_expiration) return true;
                                return new Date(value as string) > new Date() || "The expiration date must be in the future.";
                            }
                        }
                    }}
                />
                <FormInput<SubscriptionType>
                    id="account_info"
                    label="Account Info"
                    type="text"
                    placeholder="Enter subscription's connected account information"
                    register={register}
                    errors={errors}
                    validation={{
                        validate: {
                            maxLength: (value) => !value || (typeof value === 'string' && value.length <= 255) || "The account info may not be greater than 255 characters."
                        }
                    }}
                />
                <FormInput<SubscriptionType>
                    id="price"
                    label="Price"
                    type="number"
                    placeholder="Enter subscription's price"
                    register={register}
                    errors={errors}
                    validation={{
                        validate: {
                            isPositive: (value) => !value || (value as number) > 0 || "The price must be greater than 0."
                        }
                    }}
                />
                <FormInput<SubscriptionType>
                    id="currency"
                    label="Currency"
                    type="select"
                    placeholder="Select currency"
                    register={register}
                    errors={errors}
                    options={currencyOptions}
                    validation={{
                        validate: {
                            length: (value) => !value || (typeof value === 'string' && value.length === 3) || "The currency must be exactly 3 characters."
                        }
                    }}
                />
                <FormInput<SubscriptionType>
                    id="comment"
                    label="Comment"
                    type="text"
                    placeholder="Enter comment"
                    register={register}
                    errors={errors}
                    validation={{
                        validate: {
                            maxLength: (value) => !value || (typeof value === 'string' && value.length <= 255) || "The comment may not be greater than 255 characters."
                        }
                    }}
                />

                <SubmitButtonRegular isSubmitting={isSubmitting} disabledText="Updating..." text="Update" customClasses="" />
            </form>
        </div>
    );
} 