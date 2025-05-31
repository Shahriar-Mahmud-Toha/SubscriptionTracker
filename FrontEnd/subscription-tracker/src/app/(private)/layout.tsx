import { Toaster, toast } from 'sonner'
import BrandInfo from "@/components/headers/brand-info";
import logo from "../../../public/logo.svg";
import HeaderAction from "@/features/auth/private/components/header-action";

//Suspense fallback Test
// import { delay } from "@/utils/timing";
// const HeaderAction = async () => {
//   await delay(1000);
//   const { default: HeaderAction } = await import("@/features/auth/private/components/header-action");
//   return <HeaderAction customClasses="" />;
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container mx-auto px-5 pt-2">
      <div className="flex flex-col md:flex-row justify-between items-center mb-5">
        <BrandInfo
          url="/"
          logo={logo}
          altImg="Subscription Tracker Logo"
          developerName="Md. Shahriar Mahmud"
          profileLink="http://github.com/Shahriar-Mahmud-Toha"
          customClasses="mb-5 md:mb-auto"
          priority={true}
        />
        <HeaderAction customClasses="" />
      </div>
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
