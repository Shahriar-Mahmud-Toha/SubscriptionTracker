import { Suspense } from "react";
import PageTitle from "@/components/titles/page-title";
import SectionTitle from "@/components/titles/section-title";
import GeneralInfoSection from "@/features/profile/components/general-info/general-info-section";
import GeneralInfoEditButton from "@/features/profile/components/general-info/general-info-edit-button";
import { GeneralInfoContextProvider } from "@/features/profile/contexts/general-info-context";
import GeneralInfoBackButton from "@/features/profile/components/general-info/general-info-back-button";
import GeneralInfoLoader from "@/features/profile/components/general-info/general-info-loader";
import { EmailInfoContextProvider } from "@/features/profile/contexts/email-info-context";
import { EmailInfoSection } from "@/features/profile/components/email-info/email-info-section";
import EmailEditButton from '@/features/profile/components/email-info/email-edit-button';
import EmailBackButton from "@/features/profile/components/email-info/email-back-button";
import EmailLoader from "@/features/profile/components/email-info/email-loader";
import { PasswordUpdateContextProvider } from "@/features/profile/contexts/password-update-context";
import PasswordUpdateEditButton from "@/features/profile/components/password-update/password-update-edit-button";
import PasswordUpdateBackButton from '@/features/profile/components/password-update/password-update-back-button';
import PasswordUpdateController from "@/features/profile/components/password-update/password-update-controller";

export default function Profile() {

    return (
        <div className="flex flex-col items-center mb-10">
            <PageTitle title="Profile" />
            <div className="w-full max-w-md mx-auto mt-4 p-6 bg-secondary-background rounded-xl shadow-lg">
                <GeneralInfoContextProvider>
                    <div className="flex items-center gap-2 mb-6">
                        <SectionTitle title="General" />
                        <GeneralInfoEditButton />
                        <GeneralInfoBackButton />
                    </div>
                    <Suspense fallback={GeneralInfoLoader()}>
                        <GeneralInfoSection />
                    </Suspense>
                </GeneralInfoContextProvider>
            </div>
            <div className="w-full max-w-md mx-auto mt-8 p-6 bg-secondary-background rounded-xl shadow-lg">
                <EmailInfoContextProvider>
                    <div className="flex items-center gap-2 mb-6">
                        <SectionTitle title="Authentication" />
                        <EmailEditButton />
                        <EmailBackButton />
                    </div>
                    <Suspense fallback={EmailLoader()}>
                        <EmailInfoSection />
                    </Suspense>
                </EmailInfoContextProvider>
            </div>
            <div className="w-full max-w-md mx-auto mt-8 p-6 bg-secondary-background rounded-xl shadow-lg">
                <PasswordUpdateContextProvider>
                    <div className="flex items-center gap-2 mb-6">
                        <SectionTitle title="Change Password" />
                        <PasswordUpdateEditButton />
                        <PasswordUpdateBackButton />
                    </div>
                    <PasswordUpdateController />
                </PasswordUpdateContextProvider>
            </div>
        </div>
    );
}