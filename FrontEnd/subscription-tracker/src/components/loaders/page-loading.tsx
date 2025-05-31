import Spinner from "@/components/loaders/spinner";

export default function PageLoading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-background">
            <div className="flex flex-col items-center space-y-4">
                <Spinner size="large" />
                <p className="text-lg font-medium text-foreground">Loading...</p>
            </div>
        </div>
    );
}
