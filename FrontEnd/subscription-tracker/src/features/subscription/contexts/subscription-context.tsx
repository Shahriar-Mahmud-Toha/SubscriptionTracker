'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { SubscriptionType } from '@/features/subscription/types';

interface SubscriptionContextType {
    subscriptions: SubscriptionType[];
    setSubscriptions: (subscriptions: SubscriptionType[]) => void;
    selectedSubscription: SubscriptionType | null;
    setSelectedSubscription: (subscription: SubscriptionType | null) => void;
    isDetailsModalOpen: boolean;
    setIsDetailsModalOpen: (isOpen: boolean) => void;
    isEditModalOpen: boolean;
    setIsEditModalOpen: (isOpen: boolean) => void;
    isAddModalOpen: boolean;
    setIsAddModalOpen: (isOpen: boolean) => void;
    isDeleteModalOpen: boolean;
    setIsDeleteModalOpen: (isOpen: boolean) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
    const [subscriptions, setSubscriptions] = useState<SubscriptionType[]>([]);
    const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionType | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    

    return (
        <SubscriptionContext.Provider value={{
            subscriptions,
            setSubscriptions,
            selectedSubscription,
            setSelectedSubscription,
            isDetailsModalOpen,
            setIsDetailsModalOpen,
            isEditModalOpen,
            setIsEditModalOpen,
            isAddModalOpen,
            setIsAddModalOpen,
            isDeleteModalOpen,
            setIsDeleteModalOpen,
        }}>
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscription() {
    const context = useContext(SubscriptionContext);
    if (context === undefined) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
}
