'use client';

import Modal from "@/components/modals/modal";
import InfoField from "@/components/data-showcase/info-field";
import { formatStringDateTimeToReadable, formatStringDateToReadable } from "@/utils/helper";
import { SubscriptionType } from "@/features/subscription/types";

export default function SubscriptionDetailsModal({ isOpen, onClose, subscription }: { isOpen: boolean, onClose: () => void, subscription: SubscriptionType }) {

    const subscriptionFields = [
        { key: 'name', label: 'Name', format: (value: any) => value as string },
        { key: 'seller_info', label: 'Seller Info', format: (value: any) => value as string },
        { key: 'date_of_purchase', label: 'Date of Purchase', format: (value: any) => formatStringDateToReadable(value as string) },
        { key: 'reminder_time', label: 'Reminder Time', format: (value: any) => formatStringDateTimeToReadable(value as string) },
        { key: 'duration', label: 'Duration', format: (value: any) => value?.toString() },
        { key: 'date_of_expiration', label: 'Date of Expiration', format: (value: any) => formatStringDateTimeToReadable(value as string) },
        { key: 'account_info', label: 'Account Info', format: (value: any) => value as string },
        { key: 'price', label: 'Price', format: (value: any) => value?.toString() },
        { key: 'currency', label: 'Currency', format: (value: any) => value as string },
        { key: 'comment', label: 'Comment', format: (value: any) => value as string },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Subscription Details">
            <div className="space-y-4">
                {subscriptionFields.map((field) => {
                    const value = subscription[field.key as keyof SubscriptionType];
                    return value != null ? (
                        <InfoField
                            key={field.key}
                            label={field.label}
                            value={field.format(value)}
                        />
                    ) : null;
                })}
            </div>
        </Modal>
    );
} 