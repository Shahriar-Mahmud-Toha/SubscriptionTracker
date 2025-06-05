import { fetchSubscriptions } from "@/features/subscription/actions";
import SubscriptionController from "@/features/subscription/components/subscription/subscription-controller";

export default async function SubscriptionSection() {
    const response = await fetchSubscriptions();

    if (response.error) {
        return (
            <div className="text-red-500 p-4 text-center">
                {response.error}
            </div>
        );
    }
    if (!response.data) {
        return (
            <SubscriptionController initialData={[]} />
        );
    }
    return (
        <SubscriptionController initialData={response.data} />
    );
}