'use client';

import Modal from '@/components/modals/modal';
import { SubscriptionType } from '@/features/subscription/types';

export default function SubscriptionDeleteModal({ isOpen, onClose, subscription, handleDelete }: { isOpen: boolean, onClose: () => void, subscription: SubscriptionType, handleDelete: (subscription: SubscriptionType) => void }) {
    const handleConfirmDelete = () => {
        handleDelete(subscription);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Delete Subscription"
        >
            <div className="flex flex-col items-center justify-center space-y-6">
                <p className="text-lg font-medium text-foreground text-center">
                    Are you sure you want to delete <span className="text-custom-violet font-bold">{subscription.name}</span> subscription?
                </p>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleConfirmDelete}
                        className="bg-red-general/70 hover:bg-red-general text-foreground px-6 py-2 rounded-lg transition-all duration-300 hover:scale-112"
                    >
                        Delete
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-background hover:bg-background/60 text-foreground px-6 py-2 rounded-lg transition-all duration-300 hover:scale-112"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    );
} 