export default function InfoField({ label, value, customClass = "" }: { label: string, value: string, customClass?: string }) {
    return (
        <div className={`flex flex-col ${customClass}`}>
            <span className="text-sm font-medium mb-1">{label}</span>
            <div className="w-full px-4 py-2.5 rounded-lg bg-background">
                <span className="text-foreground">{value}</span>
            </div>
        </div>
    );
} 