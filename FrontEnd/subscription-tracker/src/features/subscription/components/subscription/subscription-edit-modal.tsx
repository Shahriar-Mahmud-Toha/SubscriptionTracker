'use client';

import Modal from '@/components/modals/modal';
import { SubscriptionType } from '@/features/subscription/types';
import SubscriptionEditForm from '@/features/subscription/components/subscription/subscription-edit-form';


export default function SubscriptionEditModal({ isOpen, onClose, subscription, handleEdit }: { isOpen: boolean, onClose: () => void, subscription: SubscriptionType, handleEdit: (subscription: SubscriptionType) => void }) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Subscription"
        >
            <SubscriptionEditForm
                subscription={subscription}
                onEdit={handleEdit}
            />
        </Modal>
    );
} 