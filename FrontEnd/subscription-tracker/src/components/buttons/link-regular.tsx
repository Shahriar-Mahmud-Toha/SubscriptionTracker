import Link from "next/link";

export default function LinkRegular({ href, text, customClasses }: { href: string, text: string, customClasses?: string }) {
    return (
        <Link href={href} className={`hover:text-custom-violet hover:underline hover:underline-offset-4 hover:decoration-custom-violet hover:font-bold ${customClasses}`}>
            {text}
        </Link>
    );
}

