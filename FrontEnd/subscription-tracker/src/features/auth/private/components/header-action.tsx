"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { getAuthToken, logout } from "@/features/auth/actions";
import { startTransition, useEffect, useState } from "react";
import { delay } from "@/utils/timing";
import ToastPromiseGeneral from "@/components/toasts/toast-promise-general";

export default function HeaderAction({ customClasses }: { customClasses: string }) {
    const pathname = usePathname();
    const isDashboard = pathname === "/dashboard";
    const isProfile = pathname === "/profile";
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            console.log("clicked");
            await ToastPromiseGeneral({
                promise: logout(),
                loadingMessage: 'Logging Out...',
                successMessage: 'Logged Out Successfully',
                errorMessage: 'Failed to Log Out',
            });
            router.replace('/login');
        } catch (error) {
            setIsLoading(false);
        }
    };

    return (
        <div className={`flex gap-10 ${customClasses}`}>
            <Link href="/dashboard" className="group relative">
                <Image
                    src={isDashboard ? "/assets/icons/home-active.svg" : "/assets/icons/home-regular.svg"}
                    className={`w-6 h-6 block group-hover:scale-130 transition-all duration-300 ${!isDashboard && "group-hover:hidden"}`}
                    width={24}
                    height={24}
                    alt="Dashboard"
                />
                {!isDashboard && (
                    <Image
                        src="/assets/icons/home-active.svg"
                        className="w-6 h-6 hidden group-hover:block group-hover:scale-130 transition-all duration-300"
                        width={24}
                        height={24}
                        alt="Dashboard"
                    />
                )}
                <p className="absolute top-8 left-1/2 -translate-x-1/2 bg-tooltip-background text-foreground text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    Dashboard
                </p>
            </Link>
            <Link href="/profile" className="group relative">
                <Image
                    src={isProfile ? "/assets/icons/profile-active.svg" : "/assets/icons/profile-regular.svg"}
                    className={`w-6 h-6 block group-hover:scale-130 transition-all duration-300 ${!isProfile && "group-hover:hidden"}`}
                    width={24}
                    height={24}
                    alt="Profile"
                />
                {!isProfile && (
                    <Image
                        src="/assets/icons/profile-active.svg"
                        className="w-6 h-6 hidden group-hover:block group-hover:scale-130 transition-all duration-300"
                        width={24}
                        height={24}
                        alt="Profile"
                    />
                )}
                <p className="absolute top-8 left-1/2 -translate-x-1/2 bg-tooltip-background text-foreground text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    Profile
                </p>
            </Link>
            <button
                onClick={handleLogout}
                className="group relative enabled:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
            >
                <Image
                    src="/assets/icons/logout-regular.svg"
                    className="w-6 h-6 block group-hover:scale-130 transition-all duration-300 group-hover:hidden"
                    width={24}
                    height={24}
                    alt="Logout"
                />
                <Image
                    src="/assets/icons/logout-active.svg"
                    className="w-6 h-6 hidden group-hover:block group-hover:scale-130 transition-all duration-300"
                    width={24}
                    height={24}
                    alt="Logout"
                />
                <p className="absolute top-8 left-1/2 -translate-x-1/2 bg-tooltip-background text-foreground text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    Logout
                </p>
            </button>
        </div>
    );
}