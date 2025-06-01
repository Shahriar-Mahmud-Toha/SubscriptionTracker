'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface PasswordUpdateContextType {
    isEditing: boolean;
    setIsEditing: (value: boolean) => void;
    backBtnClicked: boolean;
    setBackBtnClicked: (value: boolean) => void;
}

const PasswordUpdateContext = createContext<PasswordUpdateContextType | undefined>(undefined);

export function PasswordUpdateContextProvider({ children }: { children: ReactNode }) {
    const [isEditing, setIsEditing] = useState(false);
    const [backBtnClicked, setBackBtnClicked] = useState(false);

    return (
        <PasswordUpdateContext.Provider value={{ isEditing, setIsEditing, backBtnClicked, setBackBtnClicked}}>
            {children}
        </PasswordUpdateContext.Provider>
    );
}

export function usePasswordUpdate() {
    const context = useContext(PasswordUpdateContext);
    if (context === undefined) {
        throw new Error('usePasswordUpdate must be used within a PasswordUpdateContextProvider');
    }
    return context;
}
