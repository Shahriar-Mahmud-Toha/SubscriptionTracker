"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function HeaderAction({ customClasses }: { customClasses: string }) {
    const pathname = usePathname();
    const isDashboard = pathname === "/dashboard";
    const isProfile = pathname === "/profile";

    return (
        <div className={`flex gap-10 ${customClasses}`}>
            <Link href="/dashboard" className="group">
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
            </Link>
            <Link href="/profile" className="group">
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
            </Link>
            <Link href="/logout" className="group">
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
            </Link>
        </div>
    );
}