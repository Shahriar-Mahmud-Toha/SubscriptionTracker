import { Toaster } from 'sonner'
import logo from "../../../public/logo.svg";
import BrandInfo from "@/components/headers/brand-info";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container mx-auto px-5 pt-2">
      <BrandInfo
        url="/"
        logo={logo}
        altImg="Subscription Tracker Logo"
        developerName="Md. Shahriar Mahmud"
        profileLink="https://mdshahriar.me/"
        customClasses="justify-center mb-5"
        priority={true}
      />
      {children}
      <Toaster
        position="top-center"
        richColors
        expand={false}
        toastOptions={{
          style: {
            background: 'var(--secondary-foreground)',
            borderColor: 'var(--custom-violet)',
            color: 'var(--custom-violet)',
          },
        }}
      />
    </div>
  );
}
