export default function InfoShort({ text, subText }: { text: string, subText: string }) {
    return (
        <div className="p-6 bg-secondary-background rounded-xl shadow-lg">
            <p className="text-foreground">{text}</p>
            <p className="text-sm text-muted-foreground">{subText}</p>
        </div>
    );
}
