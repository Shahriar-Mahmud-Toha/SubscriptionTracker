'use client';

import Image from 'next/image';
import { useEmailInfo } from '@/features/profile/contexts/email-info-context';

export default function EmailEditButton() {
    const { isEditing, setIsEditing, setBackBtnClicked } = useEmailInfo();

    const handleEditClick = () => {
        setBackBtnClicked(false);
        setIsEditing(true);
    };

    if (isEditing) return null;

    return (
        <div
            onClick={handleEditClick}
            className="p-2 bg-background rounded-lg cursor-pointer group"
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
        </div>
    );
}
