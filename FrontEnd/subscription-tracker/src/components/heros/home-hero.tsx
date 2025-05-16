import Image, { StaticImageData } from "next/image";

export default function HomeHero({ image, imgAlt, appName, appNameColor = "text-custom-violet", heroText, customClasses = "" }: { image: StaticImageData, imgAlt: string, appName: string, appNameColor?: string, heroText: string, customClasses?: string }) {
    return (
        <div className={`${customClasses}`}>
            <Image src={image} alt={imgAlt} className="w-full h-auto max-w-[390px] mx-auto mb-5" priority />
            <p className="text-base text-justify max-w-[500px] mx-auto">
                <span className={`${appNameColor}`}>{appName} </span>
                {heroText}
            </p>
        </div>
    );
}
