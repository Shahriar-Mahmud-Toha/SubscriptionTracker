import Link from "next/link";

export default function LinkButtonRegular({ href, text, customClasses = "" }: { href: string, text: string, customClasses?: string }) {
    return (    
        <Link
          href={href}
          className={`bg-foreground hover:bg-opacity-90 hover:bg-custom-violet hover:text-foreground text-background px-8 py-3 rounded-lg font-bold transition-all transform hover:scale-105 ${customClasses}`}
        >
          {text}
        </Link>
    );
}