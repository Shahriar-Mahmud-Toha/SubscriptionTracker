export default function HeaderActionsLoader() {
    return (
        <div className="flex gap-10">
            {[1, 2, 3].map((item) => (
                <div key={item} className="w-6 h-6 bg-secondary-background rounded-sm animate-pulse" />
            ))}
        </div>
    );
}
