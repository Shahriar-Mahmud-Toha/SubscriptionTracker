export default function GeneralInfoLoader() {
    return (
        <div className="w-full space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                    <div className="h-4 w-20 bg-background rounded"></div>
                    <div className="h-10 w-full bg-background rounded-lg"></div>
                </div>
            ))}
        </div>
    );
}
