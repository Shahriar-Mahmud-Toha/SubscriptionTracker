'use client';

import Image from 'next/image';
import { useSubscription } from '@/features/subscription/contexts/subscription-context';

export default function SubscriptionAddButton() {
    const { setIsAddModalOpen } = useSubscription();

    const handleAddClick = () => {
        setIsAddModalOpen(true);
    };

    return (
        <div
            onClick={handleAddClick}
            className="p-2 bg-secondary-background rounded-lg cursor-pointer group relative"
        >
            <Image
                src={'/assets/icons/add-regular.svg'}
                width={24}
                height={24}
                alt="add"
                className="w-6 h-6 block group-hover:hidden"
            />
            <Image
                src={'/assets/icons/add-hover.svg'}
                width={24}
                height={24}
                alt="add"
                className="w-6 h-6 hidden group-hover:block group-hover:scale-130 transition-transform duration-300"
            />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-tooltip-background text-foreground text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Add Subscription
            </div>
        </div>
    );
}
