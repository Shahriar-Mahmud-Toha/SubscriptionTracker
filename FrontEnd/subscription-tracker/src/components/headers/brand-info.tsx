import Image, { StaticImageData } from "next/image";
import Link from "next/link";

export default function BrandInfo({ url = "/", logo, altImg, developerName, profileLink, customClasses = "", priority = false }: { url?: string, logo: StaticImageData, altImg: string, developerName: string, profileLink: string, customClasses?: string, priority?: boolean }) {
    return (
        <div className={`flex items-center gap-2 ${customClasses}`}>
            <Link href={url}>
                <Image src={logo} alt={altImg} priority={priority} className="w-10 h-10" />
            </Link>
            <div>
                <Link href={url}>
                    <h1 className="text-xl font-bold text-foreground">Subscription Tracker</h1>
                </Link>
                <p className="text-[11px]">
                    Developed by <Link href={profileLink} className="hover:text-custom-violet transition-colors"><span className=" font-bold">{developerName}</span></Link>
                </p>
            </div>
        </div>
    );
}
