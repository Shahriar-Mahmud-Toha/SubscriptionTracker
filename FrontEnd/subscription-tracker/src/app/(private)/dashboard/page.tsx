import PageTitle from "@/components/titles/page-title";
import SubscriptionSection from "@/features/subscription/components/subscription/subscription-section";
import SectionTitle from "@/components/titles/section-title";
import { SubscriptionProvider } from "@/features/subscription/contexts/subscription-context";
import { Suspense } from "react";
import SubscriptionLoader from "@/features/subscription/components/subscription/subscription-loader";
import SubscriptionAddButton from "@/features/subscription/components/subscription/subscription-add-button";
import { getAuthToken } from "@/features/auth/actions";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const { error } = await getAuthToken();
    if (error) {
        redirect("/login");
    }
    return (
        <div className="flex flex-col items-center mb-20">
            <PageTitle title="Dashboard" />
            <SubscriptionProvider>
                <div className="flex items-center gap-2 mt-5 mb-6">
                    <SectionTitle title="Subscriptions" />
                    <SubscriptionAddButton />
                </div>
                <div className="w-full max-w-md mx-auto mt-4">
                    <Suspense fallback={<SubscriptionLoader />}>
                        <SubscriptionSection />
                    </Suspense>
                </div>
            </SubscriptionProvider>
        </div>
    );
}
