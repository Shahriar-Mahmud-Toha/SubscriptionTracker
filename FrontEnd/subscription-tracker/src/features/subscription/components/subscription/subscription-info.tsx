import { formatDateToReadable } from "@/utils/helper";
import { SubscriptionType } from "@/features/subscription/types";
import InfoShort from "@/components/data-showcase/info-short";
import Image from "next/image";
import { useSubscription } from "@/features/subscription/contexts/subscription-context";
import SubscriptionDetailsModal from "@/features/subscription/components/subscription/subscription-details-modal";
import SubscriptionEditModal from "@/features/subscription/components/subscription/subscription-edit-modal";
import SubscriptionDeleteModal from "@/features/subscription/components/subscription/subscription-delete-modal";

export default function SubscriptionInfo({ data, customClass, handleEdit, handleDelete }: { data: SubscriptionType[], customClass?: string, handleEdit: (subscription: SubscriptionType) => void, handleDelete: (subscription: SubscriptionType) => void }) {
    const { setSelectedSubscription, isDetailsModalOpen, setIsDetailsModalOpen, isEditModalOpen, setIsEditModalOpen, isDeleteModalOpen, setIsDeleteModalOpen, selectedSubscription } = useSubscription();

    const handleDetailsClick = (subscription: SubscriptionType) => {
        setSelectedSubscription(subscription);
        setIsDetailsModalOpen(true);
    };

    const handleEditClick = (subscription: SubscriptionType) => {
        setSelectedSubscription(subscription);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (subscription: SubscriptionType) => {
        setSelectedSubscription(subscription);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedSubscription(null);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedSubscription(null);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedSubscription(null);
    };

    const selectedSubscriptionData = selectedSubscription ? data.find(item => item.id === selectedSubscription.id) : null;

    return (
        <div className={`${customClass}`}>
            {data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                    <div className="text-center space-y-4">
                        <p className="text-2xl font-bold text-foreground">No Subscriptions Added</p>
                        <p className="text-regular">Start by adding your first subscription to track</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-10">
                    {data.map((item) => (
                        <div key={item.id} className="space-y-4">
                            <div>
                                <InfoShort
                                    text={item.name ?? 'Subscription Name'}
                                    subText={`Expire Date: ${item.date_of_expiration ? formatDateToReadable(item.date_of_expiration) : 'N/A'}`}
                                />
                                <div className="flex items-center gap-2 mt-1 bg-secondary-background border-border rounded-xl px-2 py-1">
                                    <button
                                        onClick={() => handleDetailsClick(item)}
                                        className="p-2 cursor-pointer group relative"
                                    >
                                        <Image
                                            src={'/assets/icons/details-regular.svg'}
                                            width={24}
                                            height={24}
                                            alt="details"
                                            className="w-6 h-6 block group-hover:hidden"
                                        />
                                        <Image
                                            src={'/assets/icons/details-hover.svg'}
                                            width={24}
                                            height={24}
                                            alt="details"
                                            className="w-6 h-6 hidden group-hover:block group-hover:scale-130 transition-transform duration-300"
                                        />
                                        <p className="absolute -top-8 left-1/2 -translate-x-1/2 bg-tooltip-background text-foreground text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                            View Details
                                        </p>
                                    </button>
                                    <button
                                        onClick={() => handleEditClick(item)}
                                        className="p-2 cursor-pointer group relative"
                                    >
                                        <Image
                                            src={'/assets/icons/edit-regular.svg'}
                                            width={24}
                                            height={24}
                                            alt="edit"
                                            className="w-6 h-6 block group-hover:hidden"
                                        />
                                        <Image
                                            src={'/assets/icons/edit-hover.svg'}
                                            width={24}
                                            height={24}
                                            alt="edit"
                                            className="w-6 h-6 hidden group-hover:block group-hover:scale-130 transition-transform duration-300"
                                        />
                                        <p className="absolute -top-8 left-1/2 -translate-x-1/2 bg-tooltip-background text-foreground text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                            Edit
                                        </p>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(item)}
                                        className="p-2 cursor-pointer group relative"
                                    >
                                        <Image
                                            src={'/assets/icons/delete-regular.svg'}
                                            width={24}
                                            height={24}
                                            alt="delete"
                                            className="w-6 h-6 block group-hover:hidden"
                                        />
                                        <Image
                                            src={'/assets/icons/delete-hover.svg'}
                                            width={24}
                                            height={24}
                                            alt="delete"
                                            className="w-6 h-6 hidden group-hover:block group-hover:scale-130 transition-transform duration-300"
                                        />
                                        <p className="absolute -top-8 left-1/2 -translate-x-1/2 bg-tooltip-background text-foreground text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                            Delete
                                        </p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {isDetailsModalOpen && selectedSubscriptionData && (
                <SubscriptionDetailsModal
                    isOpen={isDetailsModalOpen}
                    onClose={handleCloseDetailsModal}
                    subscription={selectedSubscriptionData}
                />
            )}
            {isEditModalOpen && selectedSubscriptionData && (
                <SubscriptionEditModal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    subscription={selectedSubscriptionData}
                    handleEdit={handleEdit}
                />
            )}
            {isDeleteModalOpen && selectedSubscriptionData && (
                <SubscriptionDeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={handleCloseDeleteModal}
                    subscription={selectedSubscriptionData}
                    handleDelete={handleDelete}
                />
            )}
        </div>
    );
}