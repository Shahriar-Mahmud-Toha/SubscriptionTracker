'use client';

import Modal from '@/components/modals/modal';
import SubscriptionAddForm from '@/features/subscription/components/subscription/subscription-add-form';
import { SubscriptionType } from '@/features/subscription/types';


export default function SubscriptionAddModal({ isOpen, onClose, handleAdd }: { isOpen: boolean, onClose: () => void, handleAdd: (data: SubscriptionType) => Promise<void> }) {
    
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Add Subscription"
        >
            <SubscriptionAddForm
                handleAdd={handleAdd}
            />
        </Modal>
    );
} 