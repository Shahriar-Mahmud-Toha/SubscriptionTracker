'use client';

import { createContext, useContext, useState, ReactNode, useRef } from 'react';
import { GeneralInfoFormData } from '@/features/profile/types';

interface GeneralInfoContextType {
    isEditing: boolean;
    setIsEditing: (value: boolean) => void;
    backBtnClicked: boolean;
    setBackBtnClicked: (value: boolean) => void;
    data: GeneralInfoFormData | null;
    setData: (value: GeneralInfoFormData | null) => void;
    error: string | null;
    setError: (value: string | null) => void;
    isUpdated: React.RefObject<boolean>;
}

const GeneralInfoContext = createContext<GeneralInfoContextType | undefined>(undefined);

export function GeneralInfoContextProvider({ children }: { children: ReactNode }) {
    const [isEditing, setIsEditing] = useState(false);
    const [backBtnClicked, setBackBtnClicked] = useState(false);
    const isUpdated = useRef(false);
    const [data, setData] = useState<GeneralInfoFormData | null>(null);
    const [error, setError] = useState<string | null>(null);

    return (
        <GeneralInfoContext.Provider value={{ isEditing, setIsEditing, backBtnClicked, setBackBtnClicked, data, setData, error, setError, isUpdated }}>
            {children}
        </GeneralInfoContext.Provider>
    );
}

export function useGeneralInfo() {
    const context = useContext(GeneralInfoContext);
    if (context === undefined) {
        throw new Error('useGeneralInfo must be used within a GeneralInfoProvider');
    }
    return context;
}
