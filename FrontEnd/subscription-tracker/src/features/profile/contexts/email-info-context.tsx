'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface EmailInfoContextType {
    isEditing: boolean;
    setIsEditing: (value: boolean) => void;
    backBtnClicked: boolean;
    setBackBtnClicked: (value: boolean) => void;
    // error: string | null;
    // setError: (value: string | null) => void;
}

const EmailInfoContext = createContext<EmailInfoContextType | undefined>(undefined);

export function EmailInfoContextProvider({ children }: { children: ReactNode }) {
    const [isEditing, setIsEditing] = useState(false);
    const [backBtnClicked, setBackBtnClicked] = useState(false);
    // const [error, setError] = useState<string | null>(null);

    return (
        <EmailInfoContext.Provider value={{ isEditing, setIsEditing, backBtnClicked, setBackBtnClicked}}>
            {children}
        </EmailInfoContext.Provider>
    );
}

export function useEmailInfo() {
    const context = useContext(EmailInfoContext);
    if (context === undefined) {
        throw new Error('useEmailInfo must be used within a EmailInfoContextProvider');
    }
    return context;
}
