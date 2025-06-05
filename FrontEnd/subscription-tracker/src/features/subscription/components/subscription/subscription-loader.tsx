export default function SubscriptionLoader() {
    return (
        <div className="space-y-10">
            {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                    <div>
                        <div className="p-6 bg-secondary-background rounded-xl shadow-lg space-y-2">
                            <div className="h-6 w-48 bg-background rounded"></div>
                            <div className="h-4 w-64 bg-background rounded"></div>
                        </div>
                        <div className="flex items-center gap-2 mt-1 bg-secondary-background border-border rounded-xl px-2 py-1">
                            <div className="p-2">
                                <div className="w-6 h-6 bg-background rounded"></div>
                            </div>
                            <div className="p-2">
                                <div className="w-6 h-6 bg-background rounded"></div>
                            </div>
                            <div className="p-2">
                                <div className="w-6 h-6 bg-background rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
