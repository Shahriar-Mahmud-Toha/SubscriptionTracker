import PageTitle from "@/components/titles/page-title";
import SectionTitle from "@/components/titles/section-title";
import GeneralInfoEditButton from "@/features/profile/components/general-info/general-info-edit-button";
import { GeneralInfoContextProvider } from "@/features/profile/contexts/general-info-context";
import GeneralInfoController from '@/features/profile/components/general-info/general-info-controller';
import GeneralInfoBackButton from "@/features/profile/components/general-info/general-info-back-button";

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
                    <GeneralInfoController />
                </GeneralInfoContextProvider>
            </div>
        </div>
    );
}