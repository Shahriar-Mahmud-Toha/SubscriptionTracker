'use client';
import { startTransition, useOptimistic } from 'react';
import { addSubscription, deleteSubscription, updateSubscription } from '@/features/subscription/actions';
import ToastPromiseGeneral from '@/components/toasts/toast-promise-general';
import { SubscriptionType } from '@/features/subscription/types';
import { useSubscription } from '@/features/subscription/contexts/subscription-context';
import SubscriptionInfo from '@/features/subscription/components/subscription/subscription-info';
import SubscriptionAddModal from '@/features/subscription/components/subscription/subscription-add-modal';
import ToastGeneralError from '@/components/toasts/toast-general-error';

export default function SubscriptionController({ initialData }: { initialData: SubscriptionType[] }) {
    const { isAddModalOpen, setIsAddModalOpen, setIsEditModalOpen, setIsDeleteModalOpen, selectedSubscription } = useSubscription();

    const [optimisticSubscriptionsData, updateOptimisticSubscriptionsData] = useOptimistic(
        initialData,
        (state: SubscriptionType[], newData: SubscriptionType) => {
            if (!newData.id) {
                return [{ ...newData, id: `temp-${Date.now()}` }, ...state];
            } else if (newData._isDeleted) {
                return state.filter(sub => sub.id !== newData.id);
            } else {
                return state.map(sub => sub.id === newData.id ? newData : sub);
            }
        }
    );

    const handleAddSubscription = async (formData: SubscriptionType) => {
        setIsAddModalOpen(false);
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        startTransition(async () => {
            updateOptimisticSubscriptionsData(formData);

            ToastPromiseGeneral({
                promise: addSubscription(formData, userTimeZone),
                loadingMessage: 'Adding Subscription...',
                successMessage: 'Subscription Added Successfully',
                errorMessage: 'Failed to add Subscription',
            });
        });
    };

    const handleUpdateSubscription = async (formData: SubscriptionType) => {
        setIsEditModalOpen(false);
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if(!selectedSubscription){
            ToastGeneralError('No subscription selected for update');
            return;
        }
        startTransition(async () => {
            updateOptimisticSubscriptionsData(formData);
            ToastPromiseGeneral({
                promise: updateSubscription(formData, userTimeZone, selectedSubscription),
                loadingMessage: 'Updating Subscription...',
                successMessage: 'Subscription Updated Successfully',
                errorMessage: 'Failed to Update Subscription',
            });
        });
    };

    const handleDeleteSubscription = async (formData: SubscriptionType) => {
        setIsDeleteModalOpen(false);
        startTransition(async () => {
            updateOptimisticSubscriptionsData({ ...formData, _isDeleted: true });

            ToastPromiseGeneral({
                promise: deleteSubscription(formData.id as string),
                loadingMessage: 'Deleting Subscription...',
                successMessage: 'Subscription Deleted Successfully',
                errorMessage: 'Failed to Delete Subscription',
            });
        });
    };

    return (
        <div className="space-y-8">
            <SubscriptionInfo data={optimisticSubscriptionsData} handleEdit={handleUpdateSubscription} handleDelete={handleDeleteSubscription} />
            <SubscriptionAddModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                handleAdd={handleAddSubscription}
            />
        </div>
    );
}
