'use client';

import Image from "next/image";

export default function PrivateLoading() {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Image
                    src="/logo.svg"
                    alt="Loading..."
                    width={64}
                    height={64}
                    className="animate-spin"
                />
                <p className="text-lg font-medium">Logging Out...</p>
            </div>
        </div>
    );
}
