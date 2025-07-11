'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface GeneralInfoContextType {
    isEditing: boolean;
    setIsEditing: (value: boolean) => void;
    backBtnClicked: boolean;
    setBackBtnClicked: (value: boolean) => void;
}

const GeneralInfoContext = createContext<GeneralInfoContextType | undefined>(undefined);

export function GeneralInfoContextProvider({ children }: { children: ReactNode }) {
    const [isEditing, setIsEditing] = useState(false);
    const [backBtnClicked, setBackBtnClicked] = useState(false);

    return (
        <GeneralInfoContext.Provider value={{ isEditing, setIsEditing, backBtnClicked, setBackBtnClicked}}>
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
