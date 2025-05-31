import { Suspense } from "react";
import PageTitle from "@/components/titles/page-title";
import SectionTitle from "@/components/titles/section-title";
import GeneralInfoSection from "@/features/profile/components/general-info/general-info-section";
import GeneralInfoEditButton from "@/features/profile/components/general-info/general-info-edit-button";
import { GeneralInfoContextProvider } from "@/features/profile/contexts/general-info-context";
import GeneralInfoBackButton from "@/features/profile/components/general-info/general-info-back-button";
import GeneralInfoLoader from "@/features/profile/components/general-info/general-info-loader";

export default function Profile() {

    return (
        <div className="flex flex-col items-center">
            <PageTitle title="Profile" />
            <div className="w-full max-w-md mx-auto mt-4 p-6 bg-secondary-background rounded-xl shadow-lg">
                <GeneralInfoContextProvider>
                    <div className="flex items-center gap-2 mb-6">
                        <SectionTitle title="General Info" />
                        <GeneralInfoEditButton />
                        <GeneralInfoBackButton />
                    </div>
                    <Suspense fallback={GeneralInfoLoader()}>
                        <GeneralInfoSection />
                    </Suspense>
                </GeneralInfoContextProvider>
            </div>
        </div>
    );
}