'use client';

import Image from 'next/image';
import { usePasswordUpdate } from '@/features/profile/contexts/password-update-context';

export default function PasswordUpdateBackButton() {
    const { backBtnClicked, setBackBtnClicked, isEditing, setIsEditing } = usePasswordUpdate();

    const handleBackBtnClick = () => {
        setBackBtnClicked(true);
        setIsEditing(false);
    };

    if (backBtnClicked || !isEditing) return null;

    return (
        <div
            onClick={handleBackBtnClick}
            className="p-2 bg-background rounded-lg cursor-pointer group"
        >
            <Image
                src={'/assets/icons/back-regular.svg'}
                width={24}
                height={24}
                alt="edit"
                className="w-6 h-6 block group-hover:hidden"
            />
            <Image
                src={'/assets/icons/back-hover.svg'}
                width={24}
                height={24}
                alt="edit"
                className="w-6 h-6 hidden group-hover:block group-hover:scale-130 transition-transform duration-300"
            />
        </div>
    );
}
