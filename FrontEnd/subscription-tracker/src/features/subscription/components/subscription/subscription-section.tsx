import { redirect } from "next/navigation";
import { fetchSubscriptions } from "@/features/subscription/actions";
import SubscriptionController from "@/features/subscription/components/subscription/subscription-controller";

export default async function SubscriptionSection() {
    const response = await fetchSubscriptions();
    if (response?.status === 401 && response.error) {
        redirect("/login");
    }
    if (response.error) {
        return (
            <p className="text-red-general text-center">
                {response.error}
            </p>
        );
    }
    if (!response.data || response.data.length === 0) {
        return (
            <SubscriptionController initialData={[]} />
        );
    }
    return (
        <SubscriptionController initialData={response.data} />
    );
}